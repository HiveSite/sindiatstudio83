'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './studio83-media-uploader.module.css'

type Slot = {
  key: string
  label: string
  fileName: string
  exists: boolean
  planned: boolean
  path: string
  size?: number
  src: string
  previewUrl: string | null
}

type Project = {
  key: string
  title: string
  route: string
  folder: string
  slots: Slot[]
}

type PendingFile = { file: File; preview: string; width: number; height: number }
type AuthState = 'checking' | 'locked' | 'ready'

const slotId = (projectKey: string, slotKey: string) => `${projectKey}:${slotKey}`
const isCoverSlot = (slot: Slot) => /glavni cover/i.test(slot.label)

async function readDimensions(url: string) {
  return await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => reject(new Error('Fotografija ne može da se pročita.'))
    image.src = url
  })
}

async function imageToWebp(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Izaberi fotografiju.')
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Fotografija ne može da se pročita.'))
      img.src = objectUrl
    })

    const maxEdge = 1800
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight))
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('Browser ne podržava obradu slike.')
    ctx.drawImage(image, 0, 0, width, height)

    let blob: Blob | null = null
    for (const quality of [0.9, 0.86, 0.82, 0.78, 0.74, 0.7, 0.66]) {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
      if (blob && blob.size <= 850_000) break
    }
    if (!blob || blob.size > 900_000) throw new Error('Slika je prevelika nakon optimizacije.')

    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Slika se ne može pripremiti.'))
      reader.readAsDataURL(blob!)
    })

    return { data, width, height, bytes: blob.size }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function Studio83MediaUploader() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [githubConfigured, setGithubConfigured] = useState(false)
  const [catalogError, setCatalogError] = useState('')
  const [files, setFiles] = useState<Record<string, PendingFile>>({})
  const [dimensions, setDimensions] = useState<Record<string, { width: number; height: number }>>({})
  const [messages, setMessages] = useState<Record<string, string>>({})
  const [busyProject, setBusyProject] = useState<string | null>(null)
  const [showOnlyMissing, setShowOnlyMissing] = useState(false)

  const loadCatalog = async () => {
    const response = await fetch('/api/studio83-media', { credentials: 'include', cache: 'no-store' })
    const data = await response.json().catch(() => ({}))
    setGithubConfigured(Boolean(data.githubConfigured))
    if (!response.ok || !data.authenticated) {
      setAuthState('locked')
      return false
    }
    setProjects(Array.isArray(data.projects) ? data.projects : [])
    setCatalogError(String(data.catalogError || ''))
    setAuthState('ready')
    return true
  }

  useEffect(() => { loadCatalog().catch(() => setAuthState('locked')) }, [])

  const login = async () => {
    setLoginError('')
    const response = await fetch('/api/studio83-media', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'login', password }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setLoginError(data.error || 'Prijava nije uspjela.')
      return
    }
    setPassword('')
    await loadCatalog()
  }

  const logout = async () => {
    await fetch('/api/studio83-media', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    }).catch(() => undefined)
    setAuthState('locked')
    setProjects([])
  }

  const selectOne = async (projectKey: string, slot: Slot, file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessages((current) => ({ ...current, [projectKey]: 'Izaberi JPG, PNG ili WebP fotografiju.' }))
      return
    }
    const preview = URL.createObjectURL(file)
    try {
      const size = await readDimensions(preview)
      setFiles((current) => {
        const id = slotId(projectKey, slot.key)
        if (current[id]?.preview) URL.revokeObjectURL(current[id].preview)
        return { ...current, [id]: { file, preview, ...size } }
      })
      const warning = isCoverSlot(slot) && (size.width < 1200 || size.height < 700)
        ? ` Cover je ${size.width}×${size.height}px — preporuka je najmanje 1400×900.`
        : ''
      setMessages((current) => ({ ...current, [projectKey]: `Slika je samo u previewu.${warning} Klikni “Sačuvaj ovaj projekat” tek kada provjeriš kadar.` }))
    } catch (error) {
      URL.revokeObjectURL(preview)
      setMessages((current) => ({ ...current, [projectKey]: error instanceof Error ? error.message : 'Slika se ne može pripremiti.' }))
    }
  }

  const clearPending = (projectKey: string, slotKey: string) => {
    setFiles((current) => {
      const id = slotId(projectKey, slotKey)
      if (current[id]?.preview) URL.revokeObjectURL(current[id].preview)
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const uploadProject = async (project: Project) => {
    const selected = project.slots.filter((slot) => files[slotId(project.key, slot.key)])
    if (!selected.length) return
    setBusyProject(project.key)
    setMessages((current) => ({ ...current, [project.key]: 'Optimizujem fotografije i upisujem ih u repo…' }))
    try {
      const payloadFiles = []
      for (const slot of selected) {
        const pending = files[slotId(project.key, slot.key)]
        const prepared = await imageToWebp(pending.file)
        payloadFiles.push({ fileName: slot.fileName, data: prepared.data })
      }
      const response = await fetch('/api/studio83-media', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'upload', projectKey: project.key, files: payloadFiles }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Upload nije uspio.')

      setFiles((current) => {
        const next = { ...current }
        for (const slot of selected) {
          const id = slotId(project.key, slot.key)
          if (next[id]?.preview) URL.revokeObjectURL(next[id].preview)
          delete next[id]
        }
        return next
      })
      setMessages((current) => ({ ...current, [project.key]: `Sačuvano ${payloadFiles.length} izmjena. Commit ${String(data.commit || '').slice(0, 7)}.` }))
      await loadCatalog()
    } catch (error) {
      setMessages((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Upload nije uspio.' }))
    } finally {
      setBusyProject(null)
    }
  }

  const totalExisting = useMemo(() => projects.reduce((sum, project) => sum + project.slots.filter((slot) => slot.exists).length, 0), [projects])
  const totalMissing = useMemo(() => projects.reduce((sum, project) => sum + project.slots.filter((slot) => !slot.exists).length, 0), [projects])
  const totalSelected = Object.keys(files).length
  const visibleProjects = showOnlyMissing ? projects.filter((project) => project.slots.some((slot) => !slot.exists)) : projects

  if (authState === 'checking') return <main className={styles.shell}><div className={styles.centerCard}>Učitavam media biblioteku…</div></main>

  if (authState === 'locked') {
    return (
      <main className={styles.shell}>
        <section className={styles.loginCard}>
          <span className={styles.kicker}>Studio83 / private</span>
          <h1>Media manager</h1>
          <p>Kompletna biblioteka fotografija i screenshotova po projektu, sa stvarnim statusom svakog očekivanog fajla.</p>
          <label><span>Lozinka</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && login()} autoComplete="current-password" /></label>
          {loginError ? <div className={styles.error}>{loginError}</div> : null}
          <button type="button" onClick={login} disabled={!password}>Uđi u media manager</button>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <span className={styles.kicker}>Studio83 / media admin</span>
          <h1>Media biblioteka</h1>
          <p>Sada vidiš unaprijed definisane pozicije za svih 9 portfolio projekata. Cover koristi <b>cover/crop</b>; galerijske fotografije i screenshotovi koriste <b>contain</b>. Nema više kontrola koje mijenjaju samo preview, a ne live sajt.</p>
        </div>
        <div className={styles.topActions}>
          <button type="button" className={styles.ghostButton} onClick={() => setShowOnlyMissing((value) => !value)}>{showOnlyMissing ? 'Prikaži sve' : `Samo nedostaju (${totalMissing})`}</button>
          <button type="button" className={styles.ghostButton} onClick={logout}>Odjava</button>
        </div>
      </div>

      <div className={styles.summaryBar}>
        <span><strong>{projects.length}</strong> projekata</span>
        <span><strong>{totalExisting}</strong> postoji</span>
        <span><strong>{totalMissing}</strong> nedostaje</span>
        <span><strong>{totalSelected}</strong> spremno za izmjenu</span>
      </div>

      {!githubConfigured ? <div className={styles.warning}><strong>Pregled radi, ali čuvanje je zaključano.</strong><span>Nedostaje GitHub write token na Netlify projektu.</span></div> : null}
      {catalogError ? <div className={styles.warning}><strong>Katalog nije potpuno učitan.</strong><span>{catalogError}</span></div> : null}

      <div className={styles.projectList}>
        {visibleProjects.map((project, projectIndex) => {
          const selectedCount = project.slots.filter((slot) => files[slotId(project.key, slot.key)]).length
          const existingCount = project.slots.filter((slot) => slot.exists).length
          const missingCount = project.slots.length - existingCount
          const busy = busyProject === project.key
          return (
            <section className={styles.projectCard} key={project.key}>
              <div className={styles.projectHeader}>
                <div><span className={styles.projectIndex}>{String(projectIndex + 1).padStart(2, '0')}</span><h2>{project.title}</h2><a href={project.route} target="_blank" rel="noreferrer">{project.route}</a></div>
                <div className={styles.projectCounts}><span>{existingCount} ima</span>{missingCount ? <span className={styles.missingCount}>{missingCount} fali</span> : <span>kompletno</span>}</div>
              </div>
              <div className={styles.folder}>{project.folder}/</div>

              <div className={styles.slotGrid}>
                {project.slots.map((slot) => {
                  const id = slotId(project.key, slot.key)
                  const pending = files[id]
                  const currentSrc = pending?.preview || (slot.exists ? (slot.previewUrl || slot.src) : '')
                  const size = pending ? { width: pending.width, height: pending.height } : dimensions[id]
                  const cover = isCoverSlot(slot)
                  const tinyExisting = Boolean(slot.exists && slot.size && slot.size < 20_000)
                  return (
                    <article className={`${styles.slot}${!slot.exists ? ` ${styles.slotMissing}` : ''}`} key={slot.key}>
                      <div className={styles.slotTopline}>
                        <span className={`${styles.stateBadge}${slot.exists ? ` ${styles.stateExisting}` : ` ${styles.stateMissing}`}`}>{pending ? 'IZMJENA' : slot.exists ? 'IMA' : 'NEDOSTAJE'}</span>
                        <small>{cover ? 'LIVE: COVER / CROP' : 'LIVE: CONTAIN / BEZ CROPA'}</small>
                      </div>
                      <div className={styles.slotPreview} style={{ aspectRatio: cover ? '3 / 2' : '4 / 3' }}>
                        {currentSrc ? <img src={currentSrc} alt="" style={{ objectFit: cover ? 'cover' : 'contain', objectPosition: 'center' }} onLoad={(event) => { const image = event.currentTarget; setDimensions((current) => ({ ...current, [id]: { width: image.naturalWidth, height: image.naturalHeight } })) }} /> : <div className={styles.emptyPreview}><strong>+</strong><span>Fotografija nije dodata</span></div>}
                      </div>
                      <div className={styles.slotCopy}>
                        <strong>{slot.label}</strong>
                        <code>{slot.fileName}</code>
                        <small>{pending ? `Nova: ${pending.file.name} · ${pending.width}×${pending.height}px` : slot.exists ? `${size ? `${size.width}×${size.height}px · ` : ''}${slot.size ? `${Math.round(slot.size / 1000)} KB` : 'fajl iz repoa'}${tinyExisting ? ' · PREMALA TEŽINA / provjeri kvalitet' : ''}` : 'JPG, PNG ili WebP → kvalitetni WebP'}</small>
                      </div>
                      <div className={styles.slotActions}>
                        <label className={styles.replaceButton}><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(event) => selectOne(project.key, slot, event.target.files?.[0])} />{slot.exists ? 'Promijeni sliku' : 'Dodaj sliku'}</label>
                        {pending ? <button type="button" className={styles.clearButton} onClick={() => clearPending(project.key, slot.key)}>Poništi</button> : null}
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className={styles.projectFooter}>
                <span className={styles.status}>{messages[project.key] || (selectedCount ? `${selectedCount} izmjena spremno samo za ovaj projekat.` : 'Nema nesačuvanih izmjena u ovom projektu.')}</span>
                <button type="button" onClick={() => uploadProject(project)} disabled={!selectedCount || busy || !githubConfigured}>{busy ? 'Čuvam projekat…' : `Sačuvaj ovaj projekat${selectedCount ? ` (${selectedCount})` : ''}`}</button>
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
