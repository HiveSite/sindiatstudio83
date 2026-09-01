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

type DraftImage = {
  file: File
  preview: string
  width: number
  height: number
}

type PreviewMode = 'desktop' | 'mobile'

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

async function prepareDraft(file: File): Promise<DraftImage> {
  if (!file.type.startsWith('image/')) throw new Error('Izaberi fotografiju.')
  const preview = URL.createObjectURL(file)
  try {
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
      image.onerror = () => reject(new Error('Fotografija ne može da se pročita.'))
      image.src = preview
    })
    return { file, preview, ...dimensions }
  } catch (error) {
    URL.revokeObjectURL(preview)
    throw error
  }
}

function thumbnailAdvice(draft?: DraftImage) {
  if (!draft) return 'Izaberi sliku i ovdje ćeš prije čuvanja vidjeti tačan odnos slike i ograničene kartice.'
  const ratio = draft.width / draft.height
  if (ratio < 0.9) return 'Portretna slika će se prikazati cijela, ali će u desktop kartici ostati više praznog prostora sa strane.'
  if (ratio > 2) return 'Vrlo široka slika će se prikazati cijela, ali će u kartici ostati više praznog prostora iznad i ispod.'
  return 'Odnos stranica je dobar za thumbnail karticu. Slika ostaje cijela - bez cropa.'
}

function aspectRatio(aspect: string) {
  if (aspect === 'wide') return '16 / 9'
  if (aspect === 'portrait') return '4 / 5'
  if (aspect === 'square') return '1 / 1'
  return '3 / 2'
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
  const [thumbnailDrafts, setThumbnailDrafts] = useState<Record<string, DraftImage>>({})
  const [customDrafts, setCustomDrafts] = useState<Record<string, DraftImage>>({})
  const [previewMode, setPreviewMode] = useState<Record<string, PreviewMode>>({})

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

  const stageThumbnail = async (project: Project, file: File | undefined) => {
    if (!file) return
    try {
      const draft = await prepareDraft(file)
      setThumbnailDrafts((current) => {
        if (current[project.key]?.preview) URL.revokeObjectURL(current[project.key].preview)
        return { ...current, [project.key]: draft }
      })
      setMessage((current) => ({ ...current, [project.key]: 'Nova thumbnail slika je samo u previewu. Provjeri desktop/mobile prikaz pa klikni Sačuvaj thumbnail.' }))
    } catch (error) {
      setMessage((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Slika se ne može pripremiti.' }))
    }
  }

  const clearThumbnailDraft = (projectKey: string) => {
    setThumbnailDrafts((current) => {
      if (current[projectKey]?.preview) URL.revokeObjectURL(current[projectKey].preview)
      const next = { ...current }
      delete next[projectKey]
      return next
    })
  }

  const saveThumbnail = async (project: Project) => {
    const draft = thumbnailDrafts[project.key]
    if (!draft) return
    setBusy(project.key)
    setMessage((current) => ({ ...current, [project.key]: 'Optimizujem thumbnail u WebP…' }))
    try {
      const data = await imageToWebp(draft.file)
      const ok = await act(project, { action: 'upload-thumbnail', data }, 'Thumbnail je sačuvan. Netlify će povući novi commit.')
      if (ok) clearThumbnailDraft(project.key)
    } catch (error) {
      setMessage((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Upload nije uspio.' }))
      setBusy(null)
    }
  }

  const customDraftId = (projectKey: string, slotKey: string) => `${projectKey}:${slotKey}`

  const stageCustom = async (project: Project, slot: CustomSlot, file: File | undefined) => {
    if (!file) return
    const id = customDraftId(project.key, slot.key)
    try {
      const draft = await prepareDraft(file)
      setCustomDrafts((current) => {
        if (current[id]?.preview) URL.revokeObjectURL(current[id].preview)
        return { ...current, [id]: draft }
      })
      setMessage((current) => ({ ...current, [project.key]: `Slika za „${slot.theme}” je u previewu. Sačuvaj tek kada provjeriš prikaz.` }))
    } catch (error) {
      setMessage((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Slika se ne može pripremiti.' }))
    }
  }

  const clearCustomDraft = (projectKey: string, slotKey: string) => {
    const id = customDraftId(projectKey, slotKey)
    setCustomDrafts((current) => {
      if (current[id]?.preview) URL.revokeObjectURL(current[id].preview)
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const saveCustom = async (project: Project, slot: CustomSlot) => {
    const id = customDraftId(project.key, slot.key)
    const draft = customDrafts[id]
    if (!draft) return
    setBusy(project.key)
    setMessage((current) => ({ ...current, [project.key]: 'Optimizujem fotografiju u WebP…' }))
    try {
      const data = await imageToWebp(draft.file)
      const ok = await act(project, { action: 'upload-custom', data, slotKey: slot.key }, 'Slika je sačuvana. Netlify će povući novi commit.')
      if (ok) clearCustomDraft(project.key, slot.key)
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
          <span>Studio83 / pozicije i preview</span>
          <h2>Thumbnail i ograničene media pozicije</h2>
          <p>Svaka pozicija sada kaže gdje se slika koristi, kako je sajt stvarno prikazuje i da li je okvir ograničen. Izbor fajla više ništa ne uploaduje odmah - prvo vidiš preview, pa tek onda čuvaš.</p>
        </div>
        <strong className={githubConfigured ? styles.ok : styles.warn}>{githubConfigured ? 'GitHub write: OK' : 'GitHub write nije aktivan'}</strong>
      </div>

      <div className={styles.projects}>
        {projects.map((project) => {
          const thumbDraft = thumbnailDrafts[project.key]
          const thumbSrc = thumbDraft?.preview || project.thumbnail.src
          const mode = previewMode[project.key] || 'desktop'
          const thumbBusy = busy === project.key

          return (
            <article className={styles.project} key={project.key}>
              <div className={styles.projectHead}>
                <div><h3>{project.title}</h3><a href={project.route} target="_blank" rel="noreferrer">Pogledaj projekat ↗</a></div>
                <span>{project.gallery.length} galerijskih slika · {project.customSlots.length} dodatnih pozicija</span>
              </div>

              <div className={styles.thumbnailBlock}>
                <div className={styles.positionHeader}>
                  <div>
                    <span className={styles.restrictedBadge}>OGRANIČENA POZICIJA</span>
                    <strong>Thumbnail / cover kartice projekta</strong>
                    <p>Lokacija: kartice na <b>/radovi/</b> i povezane case-study kartice. Ovo nije galerijska fotografija.</p>
                  </div>
                  <div className={styles.rulePills}>
                    <span>FIT: contain</span>
                    <span>CROP: nema</span>
                    <span>FOKUS: centar</span>
                    <span>DESKTOP: min 440px</span>
                    <span>MOBILE: min 280px</span>
                  </div>
                </div>

                <div className={styles.previewToolbar}>
                  <div>
                    <strong>Preview stvarne kartice</strong>
                    <small>Slika se prikazuje cijela kao na sajtu. Prazan prostor koji vidiš ovdje vidjeće se i na kartici.</small>
                  </div>
                  <div className={styles.previewSwitch}>
                    <button type="button" className={mode === 'desktop' ? styles.activePreview : ''} onClick={() => setPreviewMode((current) => ({ ...current, [project.key]: 'desktop' }))}>Desktop</button>
                    <button type="button" className={mode === 'mobile' ? styles.activePreview : ''} onClick={() => setPreviewMode((current) => ({ ...current, [project.key]: 'mobile' }))}>Mobile</button>
                  </div>
                </div>

                <div className={`${styles.siteCardPreview}${mode === 'mobile' ? ` ${styles.siteCardPreviewMobile}` : ''}`}>
                  <div className={styles.siteCardVisual}>
                    {thumbSrc ? <img src={thumbSrc} alt="" /> : <span className={styles.noImage}>Nema thumbnaila</span>}
                    <span className={styles.siteCardShade} aria-hidden="true" />
                    <div className={styles.siteCardOverlay}>
                      <span>CASE STUDY</span>
                      <strong>STUDIO83</strong>
                      <small>{project.title}</small>
                    </div>
                  </div>
                  <div className={styles.siteCardCopyMock}>
                    <span>RADOVI</span>
                    <h4>{project.title}</h4>
                    <p>Ovako thumbnail sjeda uz tekst kartice i ograničeni media okvir.</p>
                    <b>Pogledaj projekat ↗</b>
                  </div>
                </div>

                <div className={styles.thumbnailInfo}>
                  <div>
                    <strong>{thumbDraft ? 'Nova slika - još nije sačuvana' : project.thumbnail.exists ? 'Trenutni thumbnail' : 'Thumbnail nedostaje'}</strong>
                    <code>{project.thumbnail.fileName}</code>
                    {thumbDraft ? <small>{thumbDraft.width} × {thumbDraft.height}px · {thumbDraft.file.name}</small> : null}
                  </div>
                  <p className={styles.advice}>{thumbnailAdvice(thumbDraft)}</p>
                </div>

                <div className={styles.actions}>
                  <label><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(event) => stageThumbnail(project, event.target.files?.[0])} />{thumbDraft ? 'Izaberi drugu sliku' : project.thumbnail.exists ? 'Promijeni thumbnail' : 'Dodaj thumbnail'}</label>
                  {thumbDraft ? <button type="button" className={styles.save} disabled={thumbBusy || !githubConfigured} onClick={() => saveThumbnail(project)}>Sačuvaj thumbnail</button> : null}
                  {thumbDraft ? <button type="button" onClick={() => clearThumbnailDraft(project.key)}>Poništi preview</button> : null}
                  {!thumbDraft && project.thumbnail.exists ? <button type="button" className={confirm === `${project.key}:thumb` ? styles.confirm : styles.danger} onClick={() => confirmAction(`${project.key}:thumb`, () => act(project, { action: 'delete-thumbnail' }, 'Thumbnail je uklonjen.'))}>{confirm === `${project.key}:thumb` ? 'Potvrdi brisanje' : 'Ukloni thumbnail'}</button> : null}
                  {confirm === `${project.key}:thumb` ? <button type="button" onClick={() => setConfirm(null)}>Odustani</button> : null}
                </div>
              </div>

              {project.gallery.length ? <div className={styles.fileList}>
                <div className={styles.listHeading}>
                  <div><strong>Postojeće galerijske slike</strong><p>Lokacija: detalj projekta. Prikaz: cijela fotografija bez cropa, maksimalno do okvira sadržaja.</p></div>
                  <div className={styles.rulePills}><span>FIT: contain</span><span>CROP: nema</span><span>MAX: 1180 × 920</span></div>
                </div>
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
                <div><strong>+ Nova galerijska pozicija</strong><p>Pozicija ide u detalj projekta. Aspect je organizaciona oznaka, a sama fotografija se na sajtu prikazuje cijela - bez cropa.</p></div>
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
                  const removeSlotId = `${project.key}:${slot.key}:slot`
                  const draftId = customDraftId(project.key, slot.key)
                  const draft = customDrafts[draftId]
                  const src = draft?.preview || slot.src
                  return <div className={styles.customCard} key={slot.key}>
                    <div className={styles.customMeta}>
                      <span>DETALJ PROJEKTA</span>
                      <small>{slot.aspect} · contain · bez cropa</small>
                    </div>
                    <div className={styles.preview} style={{ aspectRatio: aspectRatio(slot.aspect) }}>{src ? <img src={src} alt="" /> : <span>Nema slike</span>}</div>
                    <strong>{slot.theme}</strong>
                    {draft ? <small>{draft.width} × {draft.height}px · preview prije čuvanja</small> : <small>{slot.aspect} · puna fotografija</small>}
                    <div className={styles.actions}>
                      <label><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(event) => stageCustom(project, slot, event.target.files?.[0])} />{draft ? 'Izaberi drugu' : slot.exists ? 'Promijeni sliku' : 'Dodaj sliku'}</label>
                      {draft ? <button type="button" className={styles.save} disabled={busy === project.key || !githubConfigured} onClick={() => saveCustom(project, slot)}>Sačuvaj sliku</button> : null}
                      {draft ? <button type="button" onClick={() => clearCustomDraft(project.key, slot.key)}>Poništi</button> : null}
                      {!draft && slot.exists ? <button type="button" className={confirm === imageId ? styles.confirm : styles.danger} onClick={() => confirmAction(imageId, () => act(project, { action: 'delete-custom-image', slotKey: slot.key }, 'Slika je uklonjena, tema ostaje.'))}>{confirm === imageId ? 'Potvrdi' : 'Ukloni sliku'}</button> : null}
                      {!draft ? <button type="button" className={confirm === removeSlotId ? styles.confirm : styles.remove} onClick={() => confirmAction(removeSlotId, () => act(project, { action: 'remove-slot', slotKey: slot.key }, 'Pozicija je potpuno uklonjena.'))}>{confirm === removeSlotId ? 'Potvrdi poziciju' : 'Ukloni poziciju'}</button> : null}
                      {confirm?.startsWith(`${project.key}:${slot.key}:`) ? <button type="button" onClick={() => setConfirm(null)}>Odustani</button> : null}
                    </div>
                  </div>
                })}
              </div> : null}

              {message[project.key] ? <div className={styles.message}>{message[project.key]}</div> : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}