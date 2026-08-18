'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './studio83-media-uploader.module.css'

type ApiSlot = {
  key: string
  label: string
  fileName: string
  exists: boolean
  planned: boolean
  path: string
  src: string
  previewUrl: string | null
}

type ApiProject = {
  key: string
  title: string
  route: string
  folder: string
  slots: ApiSlot[]
  existingCount?: number
}

type PendingFile = {
  file: File
  preview: string
}

type FitMode = 'cover' | 'contain'
type FrameMode = 'card' | 'wide' | 'portrait' | 'original'
type PositionMode = 'center' | 'top' | 'bottom' | 'left' | 'right'

type PreviewPrefs = {
  fit: FitMode
  frame: FrameMode
  position: PositionMode
}

type Dimensions = { width: number; height: number }

const defaultPrefs: PreviewPrefs = {
  fit: 'cover',
  frame: 'card',
  position: 'center',
}

function slotId(projectKey: string, slotKey: string) {
  return `${projectKey}::${slotKey}`
}

function defaultFrame(fileName: string): FrameMode {
  const value = fileName.toLowerCase()
  if (value.includes('og.')) return 'wide'
  if (value.includes('mobil') || value.includes('portrait')) return 'portrait'
  return 'card'
}

async function imageToWebp(file: File) {
  const url = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Fotografija ne može da se pročita.'))
      img.src = url
    })

    const maxEdge = 1800
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight))
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) throw new Error('Browser ne podržava obradu slike.')
    context.drawImage(image, 0, 0, width, height)

    let blob: Blob | null = null
    for (const quality of [0.84, 0.78, 0.72, 0.66, 0.6, 0.54]) {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
      if (blob && blob.size <= 450_000) break
    }
    if (!blob) throw new Error('WebP konverzija nije uspjela.')
    if (blob.size > 500_000) throw new Error('Fotografija je i nakon optimizacije prevelika. Probaj manju originalnu fotografiju.')

    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Fotografija ne može da se pripremi za upload.'))
      reader.readAsDataURL(blob)
    })

    return { data, width, height, size: blob.size }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function Studio83MediaUploader() {
  const [authState, setAuthState] = useState<'checking' | 'locked' | 'ready'>('checking')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [githubConfigured, setGithubConfigured] = useState(false)
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [catalogError, setCatalogError] = useState('')
  const [files, setFiles] = useState<Record<string, PendingFile>>({})
  const [prefs, setPrefs] = useState<Record<string, PreviewPrefs>>({})
  const [dimensions, setDimensions] = useState<Record<string, Dimensions>>({})
  const [busyProject, setBusyProject] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, string>>({})
  const [showOnlyMissing, setShowOnlyMissing] = useState(false)

  const loadCatalog = async () => {
    const response = await fetch('/api/studio83-media', { credentials: 'include', cache: 'no-store' })
    const data = await response.json().catch(() => ({}))
    setGithubConfigured(Boolean(data.githubConfigured))
    if (!data.authenticated) {
      setAuthState('locked')
      return
    }
    setProjects(Array.isArray(data.projects) ? data.projects : [])
    setCatalogError(data.catalogError || '')
    setAuthState('ready')
  }

  useEffect(() => {
    loadCatalog().catch(() => setAuthState('locked'))
  }, [])

  const totalSelected = Object.keys(files).length
  const totalSlots = projects.reduce((sum, project) => sum + project.slots.length, 0)
  const totalExisting = projects.reduce((sum, project) => sum + project.slots.filter((slot) => slot.exists).length, 0)
  const totalMissing = Math.max(0, totalSlots - totalExisting)

  const visibleProjects = useMemo(() => {
    if (!showOnlyMissing) return projects
    return projects
      .map((project) => ({ ...project, slots: project.slots.filter((slot) => !slot.exists) }))
      .filter((project) => project.slots.length)
  }, [projects, showOnlyMissing])

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

  const selectOne = (projectKey: string, slot: ApiSlot, file: File | undefined) => {
    if (!file || !['image/jpeg', 'image/png'].includes(file.type)) return
    const id = slotId(projectKey, slot.key)
    setFiles((current) => {
      if (current[id]?.preview) URL.revokeObjectURL(current[id].preview)
      return { ...current, [id]: { file, preview: URL.createObjectURL(file) } }
    })
    setMessages((current) => ({ ...current, [projectKey]: '' }))
  }

  const clearPending = (projectKey: string, slotKey: string) => {
    const id = slotId(projectKey, slotKey)
    setFiles((current) => {
      if (current[id]?.preview) URL.revokeObjectURL(current[id].preview)
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const getPrefs = (projectKey: string, slot: ApiSlot): PreviewPrefs => {
    const id = slotId(projectKey, slot.key)
    return prefs[id] || { ...defaultPrefs, frame: defaultFrame(slot.fileName) }
  }

  const updatePrefs = (projectKey: string, slot: ApiSlot, patch: Partial<PreviewPrefs>) => {
    const id = slotId(projectKey, slot.key)
    setPrefs((current) => ({ ...current, [id]: { ...getPrefs(projectKey, slot), ...patch } }))
  }

  const previewStyle = (projectKey: string, slot: ApiSlot): CSSProperties => {
    const id = slotId(projectKey, slot.key)
    const current = getPrefs(projectKey, slot)
    const size = dimensions[id]
    const aspect = current.frame === 'wide'
      ? '16 / 9'
      : current.frame === 'portrait'
        ? '4 / 5'
        : current.frame === 'original' && size
          ? `${size.width} / ${size.height}`
          : '4 / 3'
    return { aspectRatio: aspect }
  }

  const imageStyle = (projectKey: string, slot: ApiSlot): CSSProperties => {
    const current = getPrefs(projectKey, slot)
    const positions: Record<PositionMode, string> = {
      center: 'center',
      top: 'center top',
      bottom: 'center bottom',
      left: 'left center',
      right: 'right center',
    }
    return { objectFit: current.fit, objectPosition: positions[current.position] }
  }

  const uploadProject = async (project: ApiProject) => {
    const selected = project.slots.filter((slot) => files[slotId(project.key, slot.key)])
    if (!selected.length) {
      setMessages((current) => ({ ...current, [project.key]: 'Izaberi makar jednu fotografiju u ovom projektu.' }))
      return
    }
    if (selected.length > 8) {
      setMessages((current) => ({ ...current, [project.key]: 'Sačuvaj najviše 8 izmjena odjednom, pa zatim ostatak.' }))
      return
    }

    setBusyProject(project.key)
    setMessages((current) => ({ ...current, [project.key]: 'Konvertujem odabrane fotografije u WebP…' }))

    try {
      const payloadFiles = []
      for (const slot of selected) {
        const pending = files[slotId(project.key, slot.key)]
        const converted = await imageToWebp(pending.file)
        payloadFiles.push({ fileName: slot.fileName, data: converted.data })
      }

      setMessages((current) => ({ ...current, [project.key]: 'Upisujem samo ovaj projekat u GitHub repo…' }))
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
      setMessages((current) => ({
        ...current,
        [project.key]: `Sačuvano ${payloadFiles.length} izmjena. Commit ${String(data.commit || '').slice(0, 7)}.`,
      }))
      await loadCatalog()
    } catch (error) {
      setMessages((current) => ({
        ...current,
        [project.key]: error instanceof Error ? error.message : 'Upload nije uspio.',
      }))
    } finally {
      setBusyProject(null)
    }
  }

  if (authState === 'checking') {
    return <main className={styles.shell}><div className={styles.centerCard}>Učitavam media biblioteku…</div></main>
  }

  if (authState === 'locked') {
    return (
      <main className={styles.shell}>
        <section className={styles.loginCard}>
          <span className={styles.kicker}>Studio83 / private</span>
          <h1>Media manager</h1>
          <p>Kompletna biblioteka fotografija i screenshotova po projektu, sa pregledom fita i direktnom zamjenom fajlova.</p>
          <label>
            <span>Lozinka</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && login()} autoComplete="current-password" />
          </label>
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
          <p>Vidiš sve slike svih portfolio projekata. Postojeće možeš zamijeniti, prazne slotove dopuniti, a fit provjeriti prije uploadovanja.</p>
        </div>
        <div className={styles.topActions}>
          <button type="button" className={styles.ghostButton} onClick={() => setShowOnlyMissing((value) => !value)}>
            {showOnlyMissing ? 'Prikaži sve' : `Samo nedostaju (${totalMissing})`}
          </button>
          <button type="button" className={styles.ghostButton} onClick={logout}>Odjava</button>
        </div>
      </div>

      <div className={styles.summaryBar}>
        <span><strong>{projects.length}</strong> projekata</span>
        <span><strong>{totalExisting}</strong> postojeće</span>
        <span><strong>{totalMissing}</strong> nedostaje</span>
        <span><strong>{totalSelected}</strong> spremno za izmjenu</span>
      </div>

      {!githubConfigured ? (
        <div className={styles.warning}>
          <strong>Pregled radi, ali čuvanje je zaključano.</strong>
          <span>Dodaj <code>STUDIO83_GITHUB_TOKEN</code> u Netlify da bi dugmad “Sačuvaj ovaj projekat” mogla pisati u repo. Sve postojeće slike i fit možeš pregledati i bez tokena.</span>
        </div>
      ) : null}

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
                  <span className={styles.projectIndex}>{String(projectIndex + 1).padStart(2, '0')}</span>
                  <h2>{project.title}</h2>
                  <a href={project.route} target="_blank" rel="noreferrer">{project.route}</a>
                </div>
                <div className={styles.projectCounts}>
                  <span>{existingCount} ima</span>
                  {missingCount ? <span className={styles.missingCount}>{missingCount} fali</span> : <span>kompletno</span>}
                </div>
              </div>

              <div className={styles.folder}>{project.folder}/</div>

              <div className={styles.slotGrid}>
                {project.slots.map((slot) => {
                  const id = slotId(project.key, slot.key)
                  const pending = files[id]
                  const currentPrefs = getPrefs(project.key, slot)
                  const currentSrc = pending?.preview || (slot.exists ? (slot.previewUrl || slot.src) : '')
                  const size = dimensions[id]

                  return (
                    <article className={`${styles.slot}${!slot.exists ? ` ${styles.slotMissing}` : ''}`} key={slot.key}>
                      <div className={styles.slotTopline}>
                        <span className={`${styles.stateBadge}${slot.exists ? ` ${styles.stateExisting}` : ` ${styles.stateMissing}`}`}>
                          {pending ? 'IZMJENA' : slot.exists ? 'IMA' : 'NEDOSTAJE'}
                        </span>
                        {size ? <small>{size.width}×{size.height}</small> : null}
                      </div>

                      <div className={styles.slotPreview} style={previewStyle(project.key, slot)}>
                        {currentSrc ? (
                          <img
                            src={currentSrc}
                            alt=""
                            style={imageStyle(project.key, slot)}
                            onLoad={(event) => {
                              const image = event.currentTarget
                              setDimensions((current) => ({ ...current, [id]: { width: image.naturalWidth, height: image.naturalHeight } }))
                            }}
                          />
                        ) : (
                          <div className={styles.emptyPreview}><strong>+</strong><span>Fotografija nije dodata</span></div>
                        )}
                      </div>

                      <div className={styles.fitControls}>
                        <label>
                          <span>Frame</span>
                          <select value={currentPrefs.frame} onChange={(event) => updatePrefs(project.key, slot, { frame: event.target.value as FrameMode })}>
                            <option value="card">Kartica 4:3</option>
                            <option value="wide">Wide 16:9</option>
                            <option value="portrait">Portret 4:5</option>
                            <option value="original">Original</option>
                          </select>
                        </label>
                        <label>
                          <span>Fit</span>
                          <select value={currentPrefs.fit} onChange={(event) => updatePrefs(project.key, slot, { fit: event.target.value as FitMode })}>
                            <option value="cover">Cover</option>
                            <option value="contain">Cijela slika</option>
                          </select>
                        </label>
                        <label>
                          <span>Pozicija</span>
                          <select value={currentPrefs.position} onChange={(event) => updatePrefs(project.key, slot, { position: event.target.value as PositionMode })}>
                            <option value="center">Centar</option>
                            <option value="top">Gore</option>
                            <option value="bottom">Dolje</option>
                            <option value="left">Lijevo</option>
                            <option value="right">Desno</option>
                          </select>
                        </label>
                      </div>

                      <div className={styles.slotCopy}>
                        <strong>{slot.label}</strong>
                        <code>{slot.fileName}</code>
                        <small>{pending ? `Nova: ${pending.file.name}` : slot.exists ? 'Trenutni fajl iz repoa' : 'JPG, JPEG ili PNG → WebP'}</small>
                      </div>

                      <div className={styles.slotActions}>
                        <label className={styles.replaceButton}>
                          <input type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={(event) => selectOne(project.key, slot, event.target.files?.[0])} />
                          {slot.exists ? 'Promijeni sliku' : 'Dodaj sliku'}
                        </label>
                        {pending ? <button type="button" className={styles.clearButton} onClick={() => clearPending(project.key, slot.key)}>Poništi</button> : null}
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className={styles.projectFooter}>
                <span className={styles.status}>{messages[project.key] || (selectedCount ? `${selectedCount} izmjena spremno samo za ovaj projekat.` : 'Nema nesačuvanih izmjena u ovom projektu.')}</span>
                <button type="button" onClick={() => uploadProject(project)} disabled={!selectedCount || busy || !githubConfigured}>
                  {busy ? 'Čuvam projekat…' : `Sačuvaj ovaj projekat${selectedCount ? ` (${selectedCount})` : ''}`}
                </button>
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
