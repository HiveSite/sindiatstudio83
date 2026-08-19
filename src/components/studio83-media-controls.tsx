'use client'

import { useEffect, useState } from 'react'
import styles from './studio83-media-controls.module.css'

type GalleryImage = { fileName: string; path: string; src: string }
type CustomSlot = { key: string; theme: string; path: string; imagePath: string | null; aspect: string; exists: boolean; src: string | null }
type Project = {
  key: string
  title: string
  route: string
  folder: string
  thumbnail: { fileName: string; path: string; exists: boolean; src: string | null }
  gallery: GalleryImage[]
  customSlots: CustomSlot[]
}

async function imageToWebp(file: File) {
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
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) throw new Error('Browser ne podržava obradu slike.')
    context.drawImage(image, 0, 0, width, height)
    let blob: Blob | null = null
    for (const quality of [0.84, 0.78, 0.72, 0.66, 0.6]) {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
      if (blob && blob.size <= 820_000) break
    }
    if (!blob || blob.size > 900_000) throw new Error('Slika je prevelika nakon optimizacije.')
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Slika se ne može pripremiti.'))
      reader.readAsDataURL(blob)
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function Studio83MediaControls() {
  const [projects, setProjects] = useState<Project[]>([])
  const [ready, setReady] = useState(false)
  const [githubConfigured, setGithubConfigured] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState<string | null>(null)
  const [theme, setTheme] = useState<Record<string, string>>({})
  const [aspect, setAspect] = useState<Record<string, string>>({})

  const load = async () => {
    const response = await fetch('/api/studio83-media-controls', { credentials: 'include', cache: 'no-store' })
    const data = await response.json().catch(() => ({}))
    setGithubConfigured(Boolean(data.githubConfigured))
    if (!response.ok || !data.authenticated) {
      setReady(false)
      return false
    }
    setProjects(Array.isArray(data.projects) ? data.projects : [])
    setReady(true)
    return true
  }

  useEffect(() => {
    let active = true
    let timer: ReturnType<typeof setInterval> | undefined
    const check = async () => {
      const ok = await load().catch(() => false)
      if (active && ok && timer) clearInterval(timer)
    }
    check()
    timer = setInterval(check, 2500)
    return () => {
      active = false
      if (timer) clearInterval(timer)
    }
  }, [])

  const act = async (project: Project, body: Record<string, unknown>, success: string) => {
    setBusy(project.key)
    setMessage((current) => ({ ...current, [project.key]: 'Upisujem izmjenu u repo…' }))
    try {
      const response = await fetch('/api/studio83-media-controls', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ projectKey: project.key, ...body }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Akcija nije uspjela.')
      setProjects(Array.isArray(data.projects) ? data.projects : [])
      setMessage((current) => ({ ...current, [project.key]: success }))
      setConfirm(null)
      return true
    } catch (error) {
      setMessage((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Akcija nije uspjela.' }))
      return false
    } finally {
      setBusy(null)
    }
  }

  const upload = async (project: Project, action: 'upload-thumbnail' | 'upload-custom', file: File | undefined, slotKey?: string) => {
    if (!file) return
    setBusy(project.key)
    setMessage((current) => ({ ...current, [project.key]: 'Optimizujem fotografiju…' }))
    try {
      const data = await imageToWebp(file)
      await act(project, { action, data, ...(slotKey ? { slotKey } : {}) }, 'Slika je sačuvana. Netlify će povući novi commit.')
    } catch (error) {
      setMessage((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Upload nije uspio.' }))
      setBusy(null)
    }
  }

  const confirmAction = async (id: string, callback: () => Promise<unknown>) => {
    if (confirm !== id) {
      setConfirm(id)
      return
    }
    await callback()
  }

  if (!ready) return null

  return (
    <section className={styles.shell} id="napredno-upravljanje">
      <div className={styles.header}>
        <div>
          <span>Studio83 / napredno</span>
          <h2>Thumbnail, brisanje i nove pozicije</h2>
          <p>Ovdje uklanjaš slike iz repoa i dodaješ potpuno nove galerijske pozicije sa sopstvenom temom.</p>
        </div>
        <strong className={githubConfigured ? styles.ok : styles.warn}>{githubConfigured ? 'GitHub write: OK' : 'GitHub write nije aktivan'}</strong>
      </div>

      <div className={styles.projects}>
        {projects.map((project) => (
          <article className={styles.project} key={project.key}>
            <div className={styles.projectHead}>
              <div><h3>{project.title}</h3><a href={project.route} target="_blank" rel="noreferrer">Pogledaj projekat ↗</a></div>
              <span>{project.gallery.length} galerijskih slika · {project.customSlots.length} dodatnih pozicija</span>
            </div>

            <div className={styles.thumbnailBlock}>
              <div className={styles.preview}>{project.thumbnail.src ? <img src={project.thumbnail.src} alt="" /> : <span>Nema thumbnaila</span>}</div>
              <div className={styles.copy}>
                <strong>Thumbnail / cover kartice</strong>
                <code>{project.thumbnail.fileName}</code>
                <div className={styles.actions}>
                  <label><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(event) => upload(project, 'upload-thumbnail', event.target.files?.[0])} />{project.thumbnail.exists ? 'Promijeni thumbnail' : 'Dodaj thumbnail'}</label>
                  {project.thumbnail.exists ? <button type="button" className={confirm === `${project.key}:thumb` ? styles.confirm : styles.danger} onClick={() => confirmAction(`${project.key}:thumb`, () => act(project, { action: 'delete-thumbnail' }, 'Thumbnail je uklonjen.'))}>{confirm === `${project.key}:thumb` ? 'Potvrdi brisanje' : 'Ukloni thumbnail'}</button> : null}
                  {confirm === `${project.key}:thumb` ? <button type="button" onClick={() => setConfirm(null)}>Odustani</button> : null}
                </div>
              </div>
            </div>

            {project.gallery.length ? <div className={styles.fileList}>
              <strong>Postojeće galerijske slike</strong>
              {project.gallery.map((image) => {
                const id = `${project.key}:gallery:${image.fileName}`
                return <div className={styles.fileRow} key={image.path}>
                  <span>{image.fileName}</span>
                  <div>
                    <button type="button" className={confirm === id ? styles.confirm : styles.danger} disabled={busy === project.key} onClick={() => confirmAction(id, () => act(project, { action: 'delete-gallery-image', fileName: image.fileName }, `Uklonjena slika ${image.fileName}.`))}>{confirm === id ? 'Potvrdi brisanje' : 'Ukloni sliku'}</button>
                    {confirm === id ? <button type="button" onClick={() => setConfirm(null)}>Odustani</button> : null}
                  </div>
                </div>
              })}
            </div> : null}

            <div className={styles.newSlot}>
              <div><strong>+ Nova pozicija sa temom</strong><p>Primjer: „Atmosfera večernje smjene“, „Detalj brendinga“, „Backstage tim“.</p></div>
              <input value={theme[project.key] || ''} onChange={(event) => setTheme((current) => ({ ...current, [project.key]: event.target.value }))} placeholder="Tema / naziv pozicije" maxLength={90} />
              <select value={aspect[project.key] || 'landscape'} onChange={(event) => setAspect((current) => ({ ...current, [project.key]: event.target.value }))}><option value="landscape">Landscape</option><option value="wide">Wide</option><option value="portrait">Portrait</option><option value="square">Square</option></select>
              <button type="button" disabled={busy === project.key || !githubConfigured} onClick={async () => {
                const value = (theme[project.key] || '').trim()
                if (!value) { setMessage((current) => ({ ...current, [project.key]: 'Unesi temu nove pozicije.' })); return }
                const ok = await act(project, { action: 'create-slot', theme: value, aspect: aspect[project.key] || 'landscape' }, `Dodata pozicija „${value}”.`)
                if (ok) setTheme((current) => ({ ...current, [project.key]: '' }))
              }}>Dodaj poziciju</button>
            </div>

            {project.customSlots.length ? <div className={styles.customGrid}>
              {project.customSlots.map((slot) => {
                const imageId = `${project.key}:${slot.key}:image`
                const slotId = `${project.key}:${slot.key}:slot`
                return <div className={styles.customCard} key={slot.key}>
                  <div className={styles.preview}>{slot.src ? <img src={slot.src} alt="" /> : <span>Nema slike</span>}</div>
                  <strong>{slot.theme}</strong>
                  <small>{slot.aspect}</small>
                  <div className={styles.actions}>
                    <label><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(event) => upload(project, 'upload-custom', event.target.files?.[0], slot.key)} />{slot.exists ? 'Promijeni sliku' : 'Dodaj sliku'}</label>
                    {slot.exists ? <button type="button" className={confirm === imageId ? styles.confirm : styles.danger} onClick={() => confirmAction(imageId, () => act(project, { action: 'delete-custom-image', slotKey: slot.key }, 'Slika je uklonjena, tema ostaje.'))}>{confirm === imageId ? 'Potvrdi' : 'Ukloni sliku'}</button> : null}
                    <button type="button" className={confirm === slotId ? styles.confirm : styles.remove} onClick={() => confirmAction(slotId, () => act(project, { action: 'remove-slot', slotKey: slot.key }, 'Pozicija je potpuno uklonjena.'))}>{confirm === slotId ? 'Potvrdi poziciju' : 'Ukloni poziciju'}</button>
                    {confirm?.startsWith(`${project.key}:${slot.key}:`) ? <button type="button" onClick={() => setConfirm(null)}>Odustani</button> : null}
                  </div>
                </div>
              })}
            </div> : null}

            {message[project.key] ? <div className={styles.message}>{message[project.key]}</div> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
