'use client'

import { useEffect, useState } from 'react'
import styles from './studio83-media-editor.module.css'

type MediaFit = 'cover' | 'contain'
type PreviewMode = 'desktop' | 'mobile'

type MediaSettings = {
  fit: MediaFit
  desktopX: number
  desktopY: number
  mobileX: number
  mobileY: number
  width?: number
  height?: number
}

type GalleryImage = {
  fileName: string
  path: string
  src: string
  settings: MediaSettings
}

type CustomSlot = {
  key: string
  theme: string
  path: string
  imagePath: string | null
  aspect: string
  exists: boolean
  src: string | null
  settings: MediaSettings
}

type Project = {
  key: string
  title: string
  route: string
  folder: string
  thumbnail: {
    fileName: string
    path: string
    exists: boolean
    src: string | null
    canonical?: boolean
    settings: MediaSettings
  }
  gallery: GalleryImage[]
  customSlots: CustomSlot[]
}

type DraftImage = {
  file: File
  preview: string
  width: number
  height: number
}

const DEFAULT_COVER: MediaSettings = { fit: 'cover', desktopX: 50, desktopY: 50, mobileX: 50, mobileY: 50 }
const DEFAULT_CONTAIN: MediaSettings = { fit: 'contain', desktopX: 50, desktopY: 50, mobileX: 50, mobileY: 50 }

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function normalizedSettings(value: Partial<MediaSettings> | undefined, fallback: MediaSettings): MediaSettings {
  return {
    fit: value?.fit === 'cover' || value?.fit === 'contain' ? value.fit : fallback.fit,
    desktopX: clamp(Number(value?.desktopX ?? fallback.desktopX)),
    desktopY: clamp(Number(value?.desktopY ?? fallback.desktopY)),
    mobileX: clamp(Number(value?.mobileX ?? fallback.mobileX)),
    mobileY: clamp(Number(value?.mobileY ?? fallback.mobileY)),
    ...(value?.width ? { width: value.width } : {}),
    ...(value?.height ? { height: value.height } : {}),
  }
}

function aspectRatio(aspect: string) {
  if (aspect === 'wide') return '16 / 9'
  if (aspect === 'portrait') return '4 / 5'
  if (aspect === 'square') return '1 / 1'
  return '3 / 2'
}

async function prepareDraft(file: File): Promise<DraftImage> {
  if (!file.type.startsWith('image/')) throw new Error('Izaberi JPG, PNG ili WebP fotografiju.')
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
    for (const quality of [0.92, 0.88, 0.84, 0.8, 0.76, 0.72, 0.68]) {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
      if (blob && blob.size <= 850_000) break
    }
    if (!blob || blob.size > 900_000) throw new Error('Slika je prevelika nakon optimizacije.')

    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Slika se ne može pripremiti.'))
      reader.readAsDataURL(blob)
    })

    return { data, width, height }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function qualityText(width?: number, height?: number, cover = false) {
  if (!width || !height) return 'Dimenzije će se provjeriti nakon izbora slike.'
  if (cover && (width < 1200 || height < 700)) return `⚠ ${width} × ${height}px — premalo za oštar veliki cover.`
  if (cover && (width < 1400 || height < 900)) return `△ ${width} × ${height}px — može, ali preporuka je najmanje 1400 × 900.`
  const longEdge = Math.max(width, height)
  if (!cover && longEdge < 800) return `⚠ ${width} × ${height}px — mala slika.`
  return `✓ ${width} × ${height}px — rezolucija je dobra.`
}

function SettingsEditor({
  value,
  onChange,
  onReset,
  compact = false,
}: {
  value: MediaSettings
  onChange: (next: MediaSettings) => void
  onReset: () => void
  compact?: boolean
}) {
  const field = (key: 'desktopX' | 'desktopY' | 'mobileX' | 'mobileY', label: string) => (
    <label className={styles.rangeField}>
      <span><b>{label}</b><strong>{value[key]}%</strong></span>
      <input
        type="range"
        min="0"
        max="100"
        value={value[key]}
        onChange={(event) => onChange({ ...value, [key]: clamp(Number(event.target.value)) })}
      />
    </label>
  )

  return (
    <div className={`${styles.settingsPanel}${compact ? ` ${styles.settingsCompact}` : ''}`}>
      <div className={styles.fitRow}>
        <label>
          <span>PRIKAZ SLIKE</span>
          <select value={value.fit} onChange={(event) => onChange({ ...value, fit: event.target.value as MediaFit })}>
            <option value="cover">COVER — popuni okvir / cropuje</option>
            <option value="contain">CONTAIN — cijela slika / bez cropa</option>
          </select>
        </label>
        <button type="button" onClick={onReset}>Reset na centar</button>
      </div>
      <div className={styles.focusColumns}>
        <div>
          <h5>Desktop fokus</h5>
          {field('desktopX', 'Lijevo ↔ desno')}
          {field('desktopY', 'Gore ↕ dolje')}
        </div>
        <div>
          <h5>Mobile fokus</h5>
          {field('mobileX', 'Lijevo ↔ desno')}
          {field('mobileY', 'Gore ↕ dolje')}
        </div>
      </div>
      <p className={styles.focusHelp}>0% = lijevo/gore · 50% = centar · 100% = desno/dolje. Fokus je najbitniji kada je prikaz COVER.</p>
    </div>
  )
}

function PreviewSwitch({
  mode,
  onChange,
}: {
  mode: PreviewMode
  onChange: (mode: PreviewMode) => void
}) {
  return (
    <div className={styles.previewSwitch}>
      <button type="button" className={mode === 'desktop' ? styles.activePreview : ''} onClick={() => onChange('desktop')}>Desktop</button>
      <button type="button" className={mode === 'mobile' ? styles.activePreview : ''} onClick={() => onChange('mobile')}>Mobile</button>
    </div>
  )
}

function mediaPosition(settings: MediaSettings, mode: PreviewMode) {
  return mode === 'mobile'
    ? `${settings.mobileX}% ${settings.mobileY}%`
    : `${settings.desktopX}% ${settings.desktopY}%`
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
  const [settingsDrafts, setSettingsDrafts] = useState<Record<string, MediaSettings>>({})
  const [imageDrafts, setImageDrafts] = useState<Record<string, DraftImage>>({})
  const [previewModes, setPreviewModes] = useState<Record<string, PreviewMode>>({})

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
      Object.values(imageDrafts).forEach((draft) => URL.revokeObjectURL(draft.preview))
    }
    // imageDrafts are intentionally not a dependency; cleanup is best-effort on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const act = async (project: Project, body: Record<string, unknown>, success: string) => {
    setBusy(project.key)
    setMessage((current) => ({ ...current, [project.key]: 'Upisujem izmjenu u GitHub…' }))
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

  const currentSettings = (id: string, server: MediaSettings | undefined, fallback: MediaSettings) =>
    settingsDrafts[id] || normalizedSettings(server, fallback)

  const setSettings = (id: string, value: MediaSettings) =>
    setSettingsDrafts((current) => ({ ...current, [id]: value }))

  const resetSettings = (id: string, fallback: MediaSettings) =>
    setSettingsDrafts((current) => ({ ...current, [id]: { ...fallback } }))

  const previewMode = (id: string) => previewModes[id] || 'desktop'

  const setPreviewMode = (id: string, mode: PreviewMode) =>
    setPreviewModes((current) => ({ ...current, [id]: mode }))

  const stageImage = async (project: Project, id: string, file: File | undefined) => {
    if (!file) return
    try {
      const draft = await prepareDraft(file)
      setImageDrafts((current) => {
        if (current[id]?.preview) URL.revokeObjectURL(current[id].preview)
        return { ...current, [id]: draft }
      })
      setMessage((current) => ({ ...current, [project.key]: 'Nova slika je samo u previewu. Namjesti kadar pa sačuvaj.' }))
    } catch (error) {
      setMessage((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Slika se ne može pripremiti.' }))
    }
  }

  const clearImageDraft = (id: string) => {
    setImageDrafts((current) => {
      if (current[id]?.preview) URL.revokeObjectURL(current[id].preview)
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const clearSettingsDraft = (id: string) => {
    setSettingsDrafts((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const saveCoverImage = async (project: Project, id: string, settings: MediaSettings) => {
    const draft = imageDrafts[id]
    if (!draft) return
    try {
      const prepared = await imageToWebp(draft.file)
      const ok = await act(project, {
        action: 'upload-thumbnail',
        data: prepared.data,
        width: prepared.width,
        height: prepared.height,
        settings,
      }, 'Cover + desktop/mobile fokus su sačuvani i koristiće ih live sajt.')
      if (ok) {
        clearImageDraft(id)
        clearSettingsDraft(id)
      }
    } catch (error) {
      setMessage((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Upload nije uspio.' }))
    }
  }

  const saveGalleryImage = async (project: Project, image: GalleryImage, id: string, settings: MediaSettings) => {
    const draft = imageDrafts[id]
    if (!draft) return
    try {
      const prepared = await imageToWebp(draft.file)
      const ok = await act(project, {
        action: 'upload-gallery-image',
        fileName: image.fileName,
        data: prepared.data,
        width: prepared.width,
        height: prepared.height,
        settings,
      }, `Slika ${image.fileName} + prikaz su sačuvani za live sajt.`)
      if (ok) {
        clearImageDraft(id)
        clearSettingsDraft(id)
      }
    } catch (error) {
      setMessage((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Upload nije uspio.' }))
    }
  }

  const saveCustomImage = async (project: Project, slot: CustomSlot, id: string, settings: MediaSettings) => {
    const draft = imageDrafts[id]
    if (!draft) return
    try {
      const prepared = await imageToWebp(draft.file)
      const ok = await act(project, {
        action: 'upload-custom',
        data: prepared.data,
        slotKey: slot.key,
        width: prepared.width,
        height: prepared.height,
        settings,
      }, `Slika „${slot.theme}” + prikaz su sačuvani za live sajt.`)
      if (ok) {
        clearImageDraft(id)
        clearSettingsDraft(id)
      }
    } catch (error) {
      setMessage((current) => ({ ...current, [project.key]: error instanceof Error ? error.message : 'Upload nije uspio.' }))
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
      <header className={styles.header}>
        <div>
          <span>Studio83 / media editor</span>
          <h2>Namjesti sliku jednom. Tako ide na live sajt.</h2>
          <p>Za cover, postojeću galeriju i nove media pozicije možeš posebno podesiti prikaz, desktop fokus i mobile fokus. Preview koristi iste vrijednosti koje se nakon čuvanja upisuju u manifest i čita ih javni portfolio.</p>
        </div>
        <strong className={githubConfigured ? styles.ok : styles.warn}>{githubConfigured ? 'LIVE SAVE: AKTIVAN' : 'GitHub write nije aktivan'}</strong>
      </header>

      <div className={styles.legend}>
        <span><b>COVER</b> popunjava okvir i može cropovati.</span>
        <span><b>CONTAIN</b> pokazuje cijelu sliku.</span>
        <span><b>Desktop/Mobile fokus</b> se čuva odvojeno.</span>
        <span><b>Sačuvaj kadar</b> mijenja live prikaz bez novog uploada.</span>
      </div>

      <div className={styles.projects}>
        {projects.map((project) => {
          const coverId = `cover:${project.key}`
          const coverDraft = imageDrafts[coverId]
          const coverSettings = currentSettings(coverId, project.thumbnail.settings, DEFAULT_COVER)
          const coverMode = previewMode(coverId)
          const coverSrc = coverDraft?.preview || project.thumbnail.src
          const projectBusy = busy === project.key

          return (
            <article className={styles.project} key={project.key}>
              <div className={styles.projectHead}>
                <div>
                  <span>PROJEKAT</span>
                  <h3>{project.title}</h3>
                  <a href={project.route} target="_blank" rel="noreferrer">Otvori stvarnu stranicu projekta ↗</a>
                </div>
                <small>{project.gallery.length} postojećih · {project.customSlots.length} dodatnih pozicija</small>
              </div>

              <section className={styles.coverBlock}>
                <div className={styles.sectionHead}>
                  <div>
                    <span className={styles.coverBadge}>GLAVNI COVER</span>
                    <h4>Cover projekta — kartice + detail hero</h4>
                    <p>Ovaj isti fajl i ova podešavanja koristi javni portfolio. Preporuka: landscape 1800 × 1200 px.</p>
                  </div>
                  <PreviewSwitch mode={coverMode} onChange={(mode) => setPreviewMode(coverId, mode)} />
                </div>

                <div className={`${styles.coverPreview}${coverMode === 'mobile' ? ` ${styles.coverPreviewMobile}` : ''}`}>
                  <div className={styles.coverVisual}>
                    {coverSrc ? (
                      <img
                        src={coverSrc}
                        alt=""
                        style={{ objectFit: coverSettings.fit, objectPosition: mediaPosition(coverSettings, coverMode) }}
                      />
                    ) : <div className={styles.empty}>COVER NEDOSTAJE</div>}
                    <div className={styles.safeZone}><span>sigurna zona</span></div>
                    <div className={styles.overlay}><b>CASE STUDY</b><strong>STUDIO83</strong><small>{project.title}</small></div>
                  </div>
                  <div className={styles.previewCopy}><span>RADOVI</span><h5>{project.title}</h5><p>Preview služi da vidiš crop i fokus prije čuvanja.</p></div>
                </div>

                <div className={styles.mediaInfo}>
                  <div><b>{coverDraft ? 'Nova slika — nije još sačuvana' : project.thumbnail.exists ? 'Trenutni live cover' : 'Nema covera'}</b><code>{project.thumbnail.fileName}</code></div>
                  <span>{qualityText(coverDraft?.width || coverSettings.width, coverDraft?.height || coverSettings.height, true)}</span>
                </div>

                <SettingsEditor
                  value={coverSettings}
                  onChange={(value) => setSettings(coverId, value)}
                  onReset={() => resetSettings(coverId, DEFAULT_COVER)}
                />

                <div className={styles.actions}>
                  <label><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(event) => stageImage(project, coverId, event.target.files?.[0])} />{coverDraft ? 'Izaberi drugi cover' : 'Promijeni cover'}</label>
                  {coverDraft ? <button type="button" className={styles.primary} disabled={projectBusy || !githubConfigured} onClick={() => saveCoverImage(project, coverId, coverSettings)}>Sačuvaj sliku + kadar</button> : null}
                  {project.thumbnail.exists ? <button type="button" className={styles.primarySoft} disabled={projectBusy || !githubConfigured} onClick={async () => {
                    const ok = await act(project, { action: 'save-thumbnail-settings', settings: coverSettings }, 'Desktop/mobile fokus covera je sačuvan za live sajt.')
                    if (ok) clearSettingsDraft(coverId)
                  }}>Sačuvaj samo kadar</button> : null}
                  {coverDraft ? <button type="button" onClick={() => clearImageDraft(coverId)}>Poništi novu sliku</button> : null}
                </div>
              </section>

              <section className={styles.gallerySection}>
                <div className={styles.sectionTitle}>
                  <div><h4>Postojeće galerijske slike</h4><p>Svaku možeš zamijeniti i podesiti joj COVER/CONTAIN + odvojeni desktop/mobile fokus.</p></div>
                  <span>{project.gallery.length} slika</span>
                </div>

                {project.gallery.length ? <div className={styles.galleryGrid}>
                  {project.gallery.map((image) => {
                    const id = `gallery:${project.key}:${image.path}`
                    const draft = imageDrafts[id]
                    const settings = currentSettings(id, image.settings, DEFAULT_CONTAIN)
                    const mode = previewMode(id)
                    const src = draft?.preview || image.src
                    const deleteId = `${id}:delete`

                    return (
                      <article className={styles.mediaCard} key={image.path}>
                        <div className={styles.mediaCardHead}>
                          <div><span>GALERIJA</span><code>{image.fileName}</code></div>
                          <PreviewSwitch mode={mode} onChange={(next) => setPreviewMode(id, next)} />
                        </div>
                        <div className={`${styles.imagePreview}${mode === 'mobile' ? ` ${styles.imagePreviewMobile}` : ''}`}>
                          <img src={src} alt="" style={{ objectFit: settings.fit, objectPosition: mediaPosition(settings, mode) }} />
                        </div>
                        <div className={styles.quality}>{qualityText(draft?.width || settings.width, draft?.height || settings.height)}</div>
                        <SettingsEditor value={settings} compact onChange={(value) => setSettings(id, value)} onReset={() => resetSettings(id, DEFAULT_CONTAIN)} />
                        <div className={styles.actions}>
                          <label><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(event) => stageImage(project, id, event.target.files?.[0])} />{draft ? 'Izaberi drugu' : 'Zamijeni sliku'}</label>
                          {draft ? <button type="button" className={styles.primary} disabled={projectBusy || !githubConfigured || !image.fileName.toLowerCase().endsWith('.webp')} onClick={() => saveGalleryImage(project, image, id, settings)}>Sačuvaj sliku + kadar</button> : null}
                          <button type="button" className={styles.primarySoft} disabled={projectBusy || !githubConfigured} onClick={async () => {
                            const ok = await act(project, { action: 'save-gallery-settings', path: image.path, settings }, `Prikaz slike ${image.fileName} je sačuvan.`)
                            if (ok) clearSettingsDraft(id)
                          }}>Sačuvaj kadar</button>
                          {draft ? <button type="button" onClick={() => clearImageDraft(id)}>Poništi sliku</button> : null}
                          {!draft ? <button type="button" className={confirm === deleteId ? styles.confirm : styles.danger} onClick={() => confirmAction(deleteId, () => act(project, { action: 'delete-gallery-image', fileName: image.fileName }, `Uklonjena slika ${image.fileName}.`))}>{confirm === deleteId ? 'Potvrdi brisanje' : 'Ukloni'}</button> : null}
                          {confirm === deleteId ? <button type="button" onClick={() => setConfirm(null)}>Odustani</button> : null}
                        </div>
                      </article>
                    )
                  })}
                </div> : <div className={styles.emptyList}>Nema galerijskih slika.</div>}
              </section>

              <section className={styles.newSlot}>
                <div><h4>+ Nova media pozicija</h4><p>Dodaje novu fotografiju u vizuelni pregled projekta. Nakon kreiranja dobija isti komplet fokus kontrola.</p></div>
                <input value={theme[project.key] || ''} onChange={(event) => setTheme((current) => ({ ...current, [project.key]: event.target.value }))} placeholder="Naziv / tema fotografije" maxLength={90} />
                <select value={aspect[project.key] || 'landscape'} onChange={(event) => setAspect((current) => ({ ...current, [project.key]: event.target.value }))}>
                  <option value="landscape">Landscape 3:2</option>
                  <option value="wide">Wide 16:9</option>
                  <option value="portrait">Portrait 4:5</option>
                  <option value="square">Square 1:1</option>
                </select>
                <button type="button" disabled={projectBusy || !githubConfigured} onClick={async () => {
                  const value = (theme[project.key] || '').trim()
                  if (!value) {
                    setMessage((current) => ({ ...current, [project.key]: 'Unesi naziv nove media pozicije.' }))
                    return
                  }
                  const ok = await act(project, { action: 'create-slot', theme: value, aspect: aspect[project.key] || 'landscape', settings: DEFAULT_CONTAIN }, `Dodata pozicija „${value}”.`)
                  if (ok) setTheme((current) => ({ ...current, [project.key]: '' }))
                }}>Dodaj poziciju</button>
              </section>

              {project.customSlots.length ? <section className={styles.gallerySection}>
                <div className={styles.sectionTitle}><div><h4>Dodatne media pozicije</h4><p>Ovdje ti biraš temu, format, sliku i tačan kadar.</p></div></div>
                <div className={styles.galleryGrid}>
                  {project.customSlots.map((slot) => {
                    const id = `custom:${project.key}:${slot.key}`
                    const draft = imageDrafts[id]
                    const settings = currentSettings(id, slot.settings, DEFAULT_CONTAIN)
                    const mode = previewMode(id)
                    const src = draft?.preview || slot.src
                    const removeImageId = `${id}:image`
                    const removeSlotId = `${id}:slot`

                    return (
                      <article className={styles.mediaCard} key={slot.key}>
                        <div className={styles.mediaCardHead}>
                          <div><span>DODATNA POZICIJA · {slot.aspect}</span><strong>{slot.theme}</strong></div>
                          <PreviewSwitch mode={mode} onChange={(next) => setPreviewMode(id, next)} />
                        </div>
                        <div className={`${styles.imagePreview}${mode === 'mobile' ? ` ${styles.imagePreviewMobile}` : ''}`} style={{ aspectRatio: aspectRatio(slot.aspect) }}>
                          {src ? <img src={src} alt="" style={{ objectFit: settings.fit, objectPosition: mediaPosition(settings, mode) }} /> : <div className={styles.empty}>Nema slike</div>}
                        </div>
                        <div className={styles.quality}>{qualityText(draft?.width || settings.width, draft?.height || settings.height)}</div>
                        <SettingsEditor value={settings} compact onChange={(value) => setSettings(id, value)} onReset={() => resetSettings(id, DEFAULT_CONTAIN)} />
                        <div className={styles.actions}>
                          <label><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={(event) => stageImage(project, id, event.target.files?.[0])} />{draft ? 'Izaberi drugu' : slot.exists ? 'Zamijeni sliku' : 'Dodaj sliku'}</label>
                          {draft ? <button type="button" className={styles.primary} disabled={projectBusy || !githubConfigured} onClick={() => saveCustomImage(project, slot, id, settings)}>Sačuvaj sliku + kadar</button> : null}
                          {slot.exists ? <button type="button" className={styles.primarySoft} disabled={projectBusy || !githubConfigured} onClick={async () => {
                            const ok = await act(project, { action: 'save-custom-settings', slotKey: slot.key, settings }, `Prikaz „${slot.theme}” je sačuvan.`)
                            if (ok) clearSettingsDraft(id)
                          }}>Sačuvaj kadar</button> : null}
                          {draft ? <button type="button" onClick={() => clearImageDraft(id)}>Poništi sliku</button> : null}
                          {!draft && slot.exists ? <button type="button" className={confirm === removeImageId ? styles.confirm : styles.danger} onClick={() => confirmAction(removeImageId, () => act(project, { action: 'delete-custom-image', slotKey: slot.key }, 'Slika je uklonjena, pozicija ostaje.'))}>{confirm === removeImageId ? 'Potvrdi sliku' : 'Ukloni sliku'}</button> : null}
                          {!draft ? <button type="button" className={confirm === removeSlotId ? styles.confirm : styles.remove} onClick={() => confirmAction(removeSlotId, () => act(project, { action: 'remove-slot', slotKey: slot.key }, 'Pozicija je potpuno uklonjena.'))}>{confirm === removeSlotId ? 'Potvrdi poziciju' : 'Ukloni poziciju'}</button> : null}
                          {confirm?.startsWith(id) ? <button type="button" onClick={() => setConfirm(null)}>Odustani</button> : null}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section> : null}

              {message[project.key] ? <div className={styles.message}>{message[project.key]}</div> : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
