'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './studio83-media-uploader.module.css'

type Slot = {
  key: string
  label: string
  fileName: string
}

type Project = {
  key: string
  title: string
  route: string
  folder: string
  slots: Slot[]
}

type PendingFile = {
  file: File
  preview: string
}

type ProjectFiles = Record<string, PendingFile>

const projects: Project[] = [
  {
    key: 'promo-timovi',
    title: 'Promo timovi i terenski angažmani',
    route: '/radovi/sistem-za-terenske-angazmane/',
    folder: 'public/images/cases/promo-timovi/',
    slots: [
      { key: 'tim', label: 'Kompletan promo ili event tim na lokaciji', fileName: 'tim.webp' },
      { key: 'briefing', label: 'Briefing, priprema i podjela odgovornosti', fileName: 'briefing.webp' },
      { key: 'realizacija', label: 'Realizacija kroz više pozicija ili lokacija', fileName: 'realizacija.webp' },
      { key: 'logistika', label: 'Logistika, supervizija i operativno izvještavanje', fileName: 'logistika.webp' },
    ],
  },
  {
    key: 'regulisane-aktivacije',
    title: 'Promocije brendova pića',
    route: '/radovi/aktivacije-regulisanih-brendova/',
    folder: 'public/images/cases/regulisane-aktivacije/',
    slots: [
      { key: 'postavka', label: 'Kompletna brendirana postavka na lokaciji', fileName: 'postavka.webp' },
      { key: 'tim', label: 'Promo tim, uniforme i priprema', fileName: 'tim.webp' },
      { key: 'realizacija', label: 'Realizacija i komunikacija u prostoru', fileName: 'realizacija.webp' },
      { key: 'detalj', label: 'Detalji postavke i završni dokaz standarda', fileName: 'detalj.webp' },
    ],
  },
  {
    key: 'dogadjaji',
    title: 'Privatni i korporativni događaji',
    route: '/radovi/privatni-i-korporativni-dogadjaji/',
    folder: 'public/images/cases/dogadjaji/',
    slots: [
      { key: 'postavka', label: 'Završena postavka prostora prije dolaska gostiju', fileName: 'postavka.webp' },
      { key: 'program-tehnika', label: 'DJ, program, bar ili tehnička realizacija', fileName: 'program-tehnika.webp' },
      { key: 'atmosfera', label: 'Atmosfera, tok gostiju i ključni momenti', fileName: 'atmosfera.webp' },
      { key: 'backstage', label: 'Tim, backstage i koordinacija iza scene', fileName: 'backstage.webp' },
    ],
  },
  {
    key: 'student-connect',
    title: 'Student Connect',
    route: '/radovi/student-connect-mini-festival/',
    folder: 'public/images/cases/student-connect/',
    slots: [
      { key: 'prostor', label: 'Glavni prostor i vizuelni identitet festivala', fileName: 'prostor.webp' },
      { key: 'radionica', label: 'Radionica, predavanje ili interaktivni sadržaj', fileName: 'radionica.webp' },
      { key: 'atmosfera', label: 'Studenti, povezivanje i atmosfera između programa', fileName: 'atmosfera.webp' },
      { key: 'tim', label: 'Organizacioni tim i realizacija iza scene', fileName: 'tim.webp' },
    ],
  },
  {
    key: 'podgoricki-pazar',
    title: 'Kućica na Podgoričkom pazaru',
    route: '/radovi/kucica-na-podgorickom-pazaru/',
    folder: 'public/images/cases/podgoricki-pazar/',
    slots: [
      { key: 'kucica', label: 'Kompletna kućica i vizuelna postavka', fileName: 'kucica.webp' },
      { key: 'detalji', label: 'Brending, detalji prostora i digitalni meni', fileName: 'detalji.webp' },
      { key: 'atmosfera', label: 'Atmosfera, posjetioci i tok kroz termine', fileName: 'atmosfera.webp' },
      { key: 'tim', label: 'Tim, program i svakodnevna operativa', fileName: 'tim.webp' },
    ],
  },
]

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
    for (const quality of [0.84, 0.78, 0.72, 0.66, 0.6]) {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
      if (blob && blob.size <= 850_000) break
    }
    if (!blob) throw new Error('WebP konverzija nije uspjela.')
    if (blob.size > 900_000) throw new Error('Fotografija je i nakon optimizacije prevelika. Probaj manju originalnu fotografiju.')

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
  const [files, setFiles] = useState<Record<string, ProjectFiles>>({})
  const [busyProject, setBusyProject] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/studio83-media', { credentials: 'include' })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        setGithubConfigured(Boolean(data.githubConfigured))
        setAuthState(data.authenticated ? 'ready' : 'locked')
      })
      .catch(() => setAuthState('locked'))
  }, [])

  const totalSelected = useMemo(
    () => Object.values(files).reduce((sum, projectFiles) => sum + Object.keys(projectFiles).length, 0),
    [files],
  )

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
    setGithubConfigured(Boolean(data.githubConfigured))
    setPassword('')
    setAuthState('ready')
  }

  const logout = async () => {
    await fetch('/api/studio83-media', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    }).catch(() => undefined)
    setAuthState('locked')
  }

  const selectMany = (project: Project, list: FileList | null) => {
    if (!list?.length) return
    const accepted = Array.from(list)
      .filter((file) => ['image/jpeg', 'image/png'].includes(file.type))
      .slice(0, project.slots.length)

    setFiles((current) => {
      const nextProject: ProjectFiles = { ...(current[project.key] || {}) }
      accepted.forEach((file, index) => {
        const slot = project.slots[index]
        if (!slot) return
        if (nextProject[slot.key]?.preview) URL.revokeObjectURL(nextProject[slot.key].preview)
        nextProject[slot.key] = { file, preview: URL.createObjectURL(file) }
      })
      return { ...current, [project.key]: nextProject }
    })
    setMessages((current) => ({ ...current, [project.key]: '' }))
  }

  const selectOne = (projectKey: string, slotKey: string, file: File | undefined) => {
    if (!file || !['image/jpeg', 'image/png'].includes(file.type)) return
    setFiles((current) => {
      const projectFiles = { ...(current[projectKey] || {}) }
      if (projectFiles[slotKey]?.preview) URL.revokeObjectURL(projectFiles[slotKey].preview)
      projectFiles[slotKey] = { file, preview: URL.createObjectURL(file) }
      return { ...current, [projectKey]: projectFiles }
    })
    setMessages((current) => ({ ...current, [projectKey]: '' }))
  }

  const uploadProject = async (project: Project) => {
    const selected = files[project.key] || {}
    const slotEntries = project.slots.filter((slot) => selected[slot.key])
    if (!slotEntries.length) {
      setMessages((current) => ({ ...current, [project.key]: 'Prvo izaberi makar jednu fotografiju.' }))
      return
    }

    setBusyProject(project.key)
    setMessages((current) => ({ ...current, [project.key]: 'Konvertujem u WebP i optimizujem…' }))

    try {
      const payloadFiles = []
      for (const slot of slotEntries) {
        const pending = selected[slot.key]
        const converted = await imageToWebp(pending.file)
        payloadFiles.push({ slotKey: slot.key, data: converted.data })
      }

      setMessages((current) => ({ ...current, [project.key]: 'Upisujem fajlove u GitHub repo…' }))
      const response = await fetch('/api/studio83-media', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'upload', projectKey: project.key, files: payloadFiles }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Upload nije uspio.')

      setMessages((current) => ({
        ...current,
        [project.key]: `Gotovo. ${payloadFiles.length} fajla su upisana u repo. Commit ${String(data.commit || '').slice(0, 7)}.`,
      }))
      setFiles((current) => ({ ...current, [project.key]: {} }))
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
    return <main className={styles.shell}><div className={styles.centerCard}>Provjeravam privatnu sesiju…</div></main>
  }

  if (authState === 'locked') {
    return (
      <main className={styles.shell}>
        <section className={styles.loginCard}>
          <span className={styles.kicker}>Studio83 / private</span>
          <h1>Media uploader</h1>
          <p>Privatni alat za case-study fotografije. Slike se automatski pretvaraju u WebP i šalju na unaprijed definisanu putanju u repou.</p>
          <label>
            <span>Lozinka</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && login()} autoComplete="current-password" />
          </label>
          {loginError ? <div className={styles.error}>{loginError}</div> : null}
          <button type="button" onClick={login} disabled={!password}>Uđi u uploader</button>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <span className={styles.kicker}>Studio83 / media admin</span>
          <h1>Case-study fotografije</h1>
          <p>Odaberi do četiri fotografije odjednom. Redosljed izbora prati redosljed slotova ispod, a svaku možeš naknadno zamijeniti pojedinačno.</p>
        </div>
        <div className={styles.topActions}>
          <span>{totalSelected} odabrano</span>
          <button type="button" className={styles.ghostButton} onClick={logout}>Odjava</button>
        </div>
      </div>

      {!githubConfigured ? (
        <div className={styles.warning}>
          <strong>Još fali GitHub dozvola.</strong>
          <span>U Netlify environment variables treba dodati <code>STUDIO83_GITHUB_TOKEN</code>. Uploader je spreman, ali neće pisati u repo dok taj server-side token ne postoji.</span>
        </div>
      ) : null}

      <div className={styles.projectList}>
        {projects.map((project) => {
          const projectFiles = files[project.key] || {}
          const selectedCount = Object.keys(projectFiles).length
          const busy = busyProject === project.key
          return (
            <section className={styles.projectCard} key={project.key}>
              <div className={styles.projectHeader}>
                <div>
                  <span className={styles.projectIndex}>{String(projects.indexOf(project) + 1).padStart(2, '0')}</span>
                  <h2>{project.title}</h2>
                  <a href={project.route} target="_blank" rel="noreferrer">{project.route}</a>
                </div>
                <label className={styles.batchPicker}>
                  <input type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" multiple onChange={(event) => selectMany(project, event.target.files)} />
                  Odaberi do 4 slike
                </label>
              </div>

              <div className={styles.folder}>{project.folder}</div>

              <div className={styles.slotGrid}>
                {project.slots.map((slot, index) => {
                  const pending = projectFiles[slot.key]
                  return (
                    <article className={styles.slot} key={slot.key}>
                      <div className={styles.slotPreview}>
                        {pending ? <img src={pending.preview} alt="" /> : <span>{String(index + 1).padStart(2, '0')}</span>}
                      </div>
                      <div className={styles.slotCopy}>
                        <strong>{slot.label}</strong>
                        <code>{slot.fileName}</code>
                        <small>{pending ? pending.file.name : 'JPG, JPEG ili PNG'}</small>
                      </div>
                      <label className={styles.replaceButton}>
                        <input type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={(event) => selectOne(project.key, slot.key, event.target.files?.[0])} />
                        {pending ? 'Promijeni' : 'Izaberi'}
                      </label>
                    </article>
                  )
                })}
              </div>

              <div className={styles.projectFooter}>
                <span className={styles.status}>{messages[project.key] || `${selectedCount}/4 spremno za upload`}</span>
                <button type="button" onClick={() => uploadProject(project)} disabled={!selectedCount || busy || !githubConfigured}>
                  {busy ? 'Obrađujem…' : `Uploaduj ${selectedCount || ''}${selectedCount ? ' odabrano' : ''}`}
                </button>
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
