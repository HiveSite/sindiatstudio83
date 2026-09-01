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
type ImageSize = { width: number; height: number }
type AuthState = 'checking' | 'locked' | 'ready'
type QualityTone = 'good' | 'warn' | 'bad' | 'unknown'

const slotId = (projectKey: string, slotKey: string) => `${projectKey}:${slotKey}`
const isCoverSlot = (slot: Slot) => /glavni cover/i.test(slot.label)

function slotUsage(cover: boolean) {
  if (cover) return 'Radovi kartica + početna gdje je projekat izdvojen + glavni vizual projekta.'
  return 'Detalj projekta → sekcija “Vizuelni pregled”. Slika se prikazuje cijela.'
}

function slotPreparation(cover: boolean) {
  if (cover) return {
    format: 'Landscape 3:2',
    target: '1800 × 1200 px',
    minimum: '1400 × 900 px',
    fit: 'COVER',
    crop: 'DA',
    focus: 'CENTAR',
    note: 'Najvažniji motiv drži u srednjih ~70% kadra. Desktop i mobile mogu odsjeći ivice.',
  }
  return {
    format: 'Originalni odnos',
    target: 'duža ivica 1600–1800 px',
    minimum: 'duža ivica 1000 px',
    fit: 'CONTAIN',
    crop: 'NE',
    focus: 'NEBITNO',
    note: 'Ne cropuj zbog sajta. Screenshot ostavi u originalnom odnosu; fotografija se prikazuje cijela.',
  }
}

function qualityFor(size: ImageSize | undefined, cover: boolean): { tone: QualityTone; label: string; detail: string } {
  if (!size) return { tone: 'unknown', label: 'PROVJERA ČEKA', detail: 'Dimenzije će se pojaviti kada se slika učita.' }
  if (cover) {
    if (size.width >= 1400 && size.height >= 900) return { tone: 'good', label: 'KVALITET OK', detail: `${size.width} × ${size.height}px — dovoljno za cover.` }
    if (size.width >= 1200 && size.height >= 700) return { tone: 'warn', label: 'MOŽE, ALI BOLJE VEĆA', detail: `${size.width} × ${size.height}px — koristi samo ako nemaš bolju.` }
    return { tone: 'bad', label: 'PREMALA ZA COVER', detail: `${size.width} × ${size.height}px — nemoj ovu koristiti kao glavni cover.` }
  }
  const longEdge = Math.max(size.width, size.height)
  if (longEdge >= 1200) return { tone: 'good', label: 'KVALITET OK', detail: `${size.width} × ${size.height}px — dobra rezolucija.` }
  if (longEdge >= 800) return { tone: 'warn', label: 'MANJA SLIKA', detail: `${size.width} × ${size.height}px — za screenshot može proći, za fotografiju traži veću.` }
  return { tone: 'bad', label: 'PREMALA', detail: `${size.width} × ${size.height}px — vjerovatno će izgledati mekano.` }
}

async function readDimensions(url: string) {
  return await new Promise<ImageSize>((resolve, reject) => {
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
  const [dimensions, setDimensions] = useState<Record<string, ImageSize>>({})
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
      const quality = qualityFor(size, isCoverSlot(slot))
      setMessages((current) => ({ ...current, [projectKey]: `${slot.label}: ${quality.detail} Slika je samo u previewu dok ne klikneš “Sačuvaj ovaj projekat”.` }))
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
    setMessages((current) => ({ ...current, [project.key]: 'Optimizujem izabrane slike u WebP i upisujem ih na tačne pozicije…' }))
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
      setMessages((current) => ({ ...current, [project.key]: `Sačuvano ${payloadFiles.length} slika na tačne pozicije. Commit ${String(data.commit || '').slice(0, 7)}.` }))
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
          <h1>Media uploader</h1>
          <p>Jedan alat za zamjenu portfolio covera i galerijskih slika na tačno definisanim pozicijama.</p>
          <label><span>Lozinka</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && login()} autoComplete="current-password" /></label>
          {loginError ? <div className={styles.error}>{loginError}</div> : null}
          <button type="button" onClick={login} disabled={!password}>Uđi u media uploader</button>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <span className={styles.kicker}>Studio83 / media admin</span>
          <h1>Slike bez nagađanja.</h1>
          <p>Izaberi projekat i poziciju. Svaka pozicija ispod kaže <b>gdje se vidi</b>, <b>koje dimenzije da pripremiš</b>, <b>da li se cropuje</b> i <b>da li je izabrana slika dovoljno velika</b>. Ti biraš kadar; uploader samo optimizuje u WebP i snimi na pravo mjesto.</p>
        </div>
        <div className={styles.topActions}>
          <button type="button" className={styles.ghostButton} onClick={() => setShowOnlyMissing((value) => !value)}>{showOnlyMissing ? 'Prikaži sve' : `Samo nedostaju (${totalMissing})`}</button>
          <button type="button" className={styles.ghostButton} onClick={logout}>Odjava</button>
        </div>
      </div>

      <section className={styles.howTo}>
        <article><span>1</span><div><strong>Nađi poziciju</strong><p>Ne mijenjaj ime fajla. Gledaj naziv pozicije: Glavni cover, Naslovna platforme, Atmosfera, Tim…</p></div></article>
        <article><span>2</span><div><strong>Pripremi sliku po pravilima</strong><p>Cover: 1800×1200, 3:2, važan motiv u centru. Galerija: zadrži originalni odnos, bez cropa.</p></div></article>
        <article><span>3</span><div><strong>Preview pa sačuvaj</strong><p>Prvo vidiš kako će kadar sjesti. Tek dugme “Sačuvaj ovaj projekat” pravi GitHub commit i pokreće deploy.</p></div></article>
      </section>

      <div className={styles.summaryBar}>
        <span><strong>{projects.length}</strong> projekata</span>
        <span><strong>{totalExisting}</strong> slika postoji</span>
        <span><strong>{totalMissing}</strong> nedostaje</span>
        <span><strong>{totalSelected}</strong> izabrano za čuvanje</span>
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
                <div>
                  <span className={styles.projectIndex}>PROJEKAT {String(projectIndex + 1).padStart(2, '0')}</span>
                  <h2>{project.title}</h2>
                  <a href={project.route} target="_blank" rel="noreferrer">Otvori live projekat ↗</a>
                </div>
                <div className={styles.projectCounts}><span>{existingCount} ima</span>{missingCount ? <span className={styles.missingCount}>{missingCount} fali</span> : <span>kompletno</span>}</div>
              </div>

              <div className={styles.slotGrid}>
                {project.slots.map((slot, slotIndex) => {
                  const id = slotId(project.key, slot.key)
                  const pending = files[id]
                  const currentSrc = pending?.preview || (slot.exists ? (slot.previewUrl || slot.src) : '')
                  const size = pending ? { width: pending.width, height: pending.height } : dimensions[id]
                  const cover = isCoverSlot(slot)
                  const prep = slotPreparation(cover)
                  const quality = qualityFor(size, cover)
                  return (
                    <article className={`${styles.slot}${!slot.exists ? ` ${styles.slotMissing}` : ''}${cover ? ` ${styles.coverSlot}` : ''}`} key={slot.key}>
                      <div className={styles.slotHeader}>
                        <div>
                          <span className={cover ? styles.coverBadge : styles.galleryBadge}>{cover ? 'GLAVNI COVER' : `GALERIJA ${String(slotIndex).padStart(2, '0')}`}</span>
                          <strong>{slot.label}</strong>
                        </div>
                        <span className={`${styles.quality} ${styles[`quality_${quality.tone}`]}`}>{pending ? 'NOVA · ' : ''}{quality.label}</span>
                      </div>

                      <div className={styles.usageBox}><span>GDJE SE VIDI</span><p>{slotUsage(cover)}</p></div>

                      <div className={styles.rules}>
                        <div><span>PRIPREMI</span><strong>{prep.target}</strong><small>{prep.format}</small></div>
                        <div><span>MINIMUM</span><strong>{prep.minimum}</strong><small>ispod ovoga ne preporučujem</small></div>
                        <div><span>PRIKAZ</span><strong>{prep.fit}</strong><small>crop: {prep.crop.toLowerCase()} · fokus: {prep.focus.toLowerCase()}</small></div>
                      </div>

                      <div className={styles.slotPreview} style={{ aspectRatio: cover ? '3 / 2' : '4 / 3' }}>
                        {currentSrc ? <img src={currentSrc} alt="" style={{ objectFit: cover ? 'cover' : 'contain', objectPosition: 'center' }} onLoad={(event) => { const image = event.currentTarget; setDimensions((current) => ({ ...current, [id]: { width: image.naturalWidth, height: image.naturalHeight } })) }} /> : <div className={styles.emptyPreview}><strong>+</strong><span>Ova pozicija nema sliku</span></div>}
                        {cover && currentSrc ? <div className={styles.safeZone}><span>VAŽAN MOTIV DRŽI OVDJE</span></div> : null}
                      </div>

                      <div className={styles.qualityDetail}><strong>{quality.detail}</strong><p>{prep.note}</p></div>

                      <div className={styles.fileInfo}>
                        <span>{pending ? `Izabrano: ${pending.file.name}` : slot.exists ? 'Trenutna live slika' : 'Nedostaje slika'}</span>
                        <code>{slot.fileName}</code>
                        {slot.size && !pending ? <small>{Math.round(slot.size / 1000)} KB u repou</small> : null}
                      </div>

                      <div className={styles.slotActions}>
                        <label className={styles.replaceButton}><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(event) => selectOne(project.key, slot, event.target.files?.[0])} />{pending ? 'Izaberi drugu' : slot.exists ? 'Promijeni ovu sliku' : 'Dodaj sliku'}</label>
                        {pending ? <button type="button" className={styles.clearButton} onClick={() => clearPending(project.key, slot.key)}>Poništi</button> : null}
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className={styles.projectFooter}>
                <span className={styles.status}>{messages[project.key] || (selectedCount ? `${selectedCount} izmjena je samo u previewu. Ništa još nije poslato.` : 'Nema nesačuvanih izmjena u ovom projektu.')}</span>
                <button type="button" onClick={() => uploadProject(project)} disabled={!selectedCount || busy || !githubConfigured}>{busy ? 'Čuvam projekat…' : `Sačuvaj ovaj projekat${selectedCount ? ` (${selectedCount})` : ''}`}</button>
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
