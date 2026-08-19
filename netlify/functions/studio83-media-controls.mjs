const COOKIE_NAME = 'studio83_media_session'
const MEDIA_PASSWORD = 'studio83media2026!'
const MANIFEST_PATH = 'src/data/studio83-media-manifest.json'
const MAX_FILE_BYTES = 900_000

const PROJECTS = [
  ['imaposla','imaposla-digitalni-proizvod','ImaPosla.me','/radovi/imaposla-digitalni-proizvod/','public/images/cases/imaposla','imaposla-thumbnail.webp'],
  ['battlebots-arena','battlebots-arena','BattleBots Arena','/radovi/battlebots-arena/','public/images/cases/battlebots-arena','battlebots-thumbnail.webp'],
  ['promo-timovi','sistem-za-terenske-angazmane','Promo timovi i terenski angažmani','/radovi/sistem-za-terenske-angazmane/','public/images/cases/promo-timovi','thumbnail.webp'],
  ['regulisane-aktivacije','aktivacije-regulisanih-brendova','Promocije brendova pića','/radovi/aktivacije-regulisanih-brendova/','public/images/cases/regulisane-aktivacije','thumbnail.webp'],
  ['dogadjaji','privatni-i-korporativni-dogadjaji','Privatni i korporativni događaji','/radovi/privatni-i-korporativni-dogadjaji/','public/images/cases/dogadjaji','thumbnail.webp'],
  ['student-connect','student-connect-mini-festival','Student Connect','/radovi/student-connect-mini-festival/','public/images/cases/student-connect','thumbnail.webp'],
  ['podgoricki-pazar','kucica-na-podgorickom-pazaru','Kućica na Podgoričkom pazaru','/radovi/kucica-na-podgorickom-pazaru/','public/images/cases/podgoricki-pazar','thumbnail.webp'],
  ['mini-sajtovi','mini-sajtovi-i-digitalni-alati','Mini-sajtovi i digitalni alati','/radovi/mini-sajtovi-i-digitalni-alati/','public/images/cases/mini-sajtovi-i-digitalni-alati','mini-sajtovi-thumbnail.webp'],
  ['hive-agency','hive-agency-platforma','Hive Agency platforma','/radovi/hive-agency-platforma/','public/images/cases/hive-agency','hive-thumbnail.webp'],
].map(([key,caseSlug,title,route,folder,thumbnail]) => ({ key,caseSlug,title,route,folder,thumbnail }))

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } })
}

function getEnv(name) {
  return typeof Netlify !== 'undefined' ? Netlify.env.get(name) : process.env[name]
}

function repoConfig() {
  const repo = getEnv('STUDIO83_GITHUB_REPO') || 'HiveSite/sindiatstudio83'
  const branch = getEnv('STUDIO83_GITHUB_BRANCH') || 'main'
  const [owner, name] = repo.split('/')
  if (!owner || !name) throw new Error('GitHub repo nije validan.')
  return { repo, branch, owner, name }
}

async function github(path, options = {}, requireToken = false) {
  const token = getEnv('STUDIO83_GITHUB_TOKEN')
  if (requireToken && !token) throw new Error('STUDIO83_GITHUB_TOKEN nije konfigurisan.')
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const text = await response.text()
  const payload = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(payload?.message || `GitHub API greška (${response.status})`)
  return payload
}

function readCookie(req, name) {
  const raw = req.headers.get('cookie') || ''
  const item = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return item ? decodeURIComponent(item.slice(name.length + 1)) : ''
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
}

async function verifySession(token) {
  if (!token || !token.includes('.')) return false
  const [payload, signature] = token.split('.')
  try {
    const key = await importHmacKey(MEDIA_PASSWORD)
    const valid = await crypto.subtle.verify('HMAC', key, Buffer.from(signature, 'base64url'), new TextEncoder().encode(payload))
    if (!valid) return false
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

function emptyManifest() { return { version: 1, projects: {} } }

async function getContent(path, required = true) {
  const { owner, name, branch } = repoConfig()
  try {
    return await github(`/repos/${owner}/${name}/contents/${path}?ref=${encodeURIComponent(branch)}`)
  } catch (error) {
    if (!required) return null
    throw error
  }
}

async function readManifest() {
  const file = await getContent(MANIFEST_PATH, false)
  if (!file?.content) return emptyManifest()
  try {
    const parsed = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'))
    return parsed?.projects ? parsed : emptyManifest()
  } catch {
    return emptyManifest()
  }
}

function manifestProject(manifest, project) {
  if (!manifest.projects[project.caseSlug]) manifest.projects[project.caseSlug] = { thumbnailPath: null, customSlots: [] }
  if (!Array.isArray(manifest.projects[project.caseSlug].customSlots)) manifest.projects[project.caseSlug].customSlots = []
  return manifest.projects[project.caseSlug]
}

async function saveManifest(manifest, message) {
  const current = await getContent(MANIFEST_PATH, false)
  const { owner, name, branch } = repoConfig()
  const body = {
    message,
    branch,
    content: Buffer.from(JSON.stringify(manifest, null, 2) + '\n', 'utf8').toString('base64'),
    ...(current?.sha ? { sha: current.sha } : {}),
  }
  return github(`/repos/${owner}/${name}/contents/${MANIFEST_PATH}`, { method: 'PUT', body: JSON.stringify(body) }, true)
}

function parseWebp(data) {
  const match = /^data:image\/webp;base64,([A-Za-z0-9+/=]+)$/.exec(data || '')
  if (!match) throw new Error('Neispravan WebP payload.')
  const buffer = Buffer.from(match[1], 'base64')
  if (!buffer.length || buffer.length > MAX_FILE_BYTES) throw new Error('Slika mora biti manja od 900 KB.')
  return buffer
}

function safeName(name) {
  return /^[a-z0-9][a-z0-9._-]*\.(?:webp|png|jpe?g)$/i.test(name || '') && !String(name).includes('/')
}

function protectedTechnicalFile(name) {
  return /(?:^|[-_])og\.(?:webp|png|jpe?g)$/i.test(String(name || ''))
}

function cleanTheme(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 90)
}

function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'dj').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'slika'
}

async function putImage(path, data, message) {
  const current = await getContent(path, false)
  const { owner, name, branch } = repoConfig()
  const body = {
    message,
    branch,
    content: parseWebp(data).toString('base64'),
    ...(current?.sha ? { sha: current.sha } : {}),
  }
  return github(`/repos/${owner}/${name}/contents/${path}`, { method: 'PUT', body: JSON.stringify(body) }, true)
}

async function removeImagePath(path, message) {
  const current = await getContent(path, false)
  if (!current?.sha) return null
  const { owner, name, branch } = repoConfig()
  return github(`/repos/${owner}/${name}/contents/${path}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, branch, sha: current.sha }),
  }, true)
}

async function listProject(project, manifest) {
  const { owner, name, branch, repo } = repoConfig()
  let entries = []
  try {
    const payload = await github(`/repos/${owner}/${name}/contents/${project.folder}?ref=${encodeURIComponent(branch)}`)
    entries = Array.isArray(payload) ? payload : []
  } catch {
    entries = []
  }
  const mp = manifestProject(manifest, project)
  const customPaths = new Set(mp.customSlots.map((slot) => slot.path))
  const thumbPath = `${project.folder}/${project.thumbnail}`
  const imageEntries = entries.filter((entry) => entry.type === 'file' && /\.(?:webp|png|jpe?g)$/i.test(entry.name))
  const thumbnailEntry = imageEntries.find((entry) => entry.path === thumbPath)
  const gallery = imageEntries.filter((entry) => entry.path !== thumbPath && !customPaths.has(entry.path) && !protectedTechnicalFile(entry.name)).map((entry) => ({
    fileName: entry.name,
    path: entry.path,
    src: `https://raw.githubusercontent.com/${repo}/${branch}/${entry.path}`,
  }))
  const customSlots = mp.customSlots.map((slot) => ({
    ...slot,
    exists: Boolean(slot.imagePath && imageEntries.some((entry) => entry.path === slot.imagePath)),
    src: slot.imagePath ? `https://raw.githubusercontent.com/${repo}/${branch}/${slot.imagePath}` : null,
  }))
  return {
    key: project.key,
    caseSlug: project.caseSlug,
    title: project.title,
    route: project.route,
    folder: project.folder,
    thumbnail: {
      fileName: project.thumbnail,
      path: thumbPath,
      exists: Boolean(thumbnailEntry),
      src: thumbnailEntry ? `https://raw.githubusercontent.com/${repo}/${branch}/${thumbPath}` : null,
    },
    gallery,
    customSlots,
  }
}

async function catalog() {
  const manifest = await readManifest()
  const projects = []
  for (const project of PROJECTS) projects.push(await listProject(project, manifest))
  return { projects, manifest }
}

function projectByKey(key) {
  const project = PROJECTS.find((item) => item.key === key)
  if (!project) throw new Error('Nepoznat projekat.')
  return project
}

export default async (req) => {
  const authenticated = await verifySession(readCookie(req, COOKIE_NAME))
  if (!authenticated) return json({ authenticated: false, githubConfigured: Boolean(getEnv('STUDIO83_GITHUB_TOKEN')) }, 401)

  if (req.method === 'GET') {
    try {
      const { projects } = await catalog()
      return json({ authenticated: true, githubConfigured: Boolean(getEnv('STUDIO83_GITHUB_TOKEN')), projects })
    } catch (error) {
      return json({ authenticated: true, githubConfigured: Boolean(getEnv('STUDIO83_GITHUB_TOKEN')), projects: [], error: error instanceof Error ? error.message : 'Katalog nije dostupan.' })
    }
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  let body
  try { body = await req.json() } catch { return json({ error: 'Neispravan zahtjev.' }, 400) }

  try {
    const project = projectByKey(body.projectKey)
    const manifest = await readManifest()
    const mp = manifestProject(manifest, project)

    if (body.action === 'upload-thumbnail') {
      const path = `${project.folder}/${project.thumbnail}`
      await putImage(path, body.data, `Update Studio83 thumbnail: ${project.title}`)
      mp.thumbnailPath = `/${path.replace(/^public\//, '')}`
      await saveManifest(manifest, `Link Studio83 thumbnail: ${project.title}`)
    } else if (body.action === 'delete-thumbnail') {
      const path = `${project.folder}/${project.thumbnail}`
      await removeImagePath(path, `Remove Studio83 thumbnail: ${project.title}`)
      mp.thumbnailPath = null
      await saveManifest(manifest, `Unlink Studio83 thumbnail: ${project.title}`)
    } else if (body.action === 'delete-gallery-image') {
      if (!safeName(body.fileName)) throw new Error('Neispravan naziv slike.')
      if (protectedTechnicalFile(body.fileName)) throw new Error('SEO/social asset je zaštićen i ne može se brisati iz galerijskog panela.')
      await removeImagePath(`${project.folder}/${body.fileName}`, `Remove Studio83 image: ${project.title}`)
    } else if (body.action === 'create-slot') {
      const theme = cleanTheme(body.theme)
      if (theme.length < 2) throw new Error('Unesi temu/naziv nove pozicije.')
      const id = crypto.randomUUID().replace(/-/g, '').slice(0, 8)
      const filename = `${slugify(theme)}-${id}.webp`
      mp.customSlots.push({
        key: `custom-${id}`,
        theme,
        path: `${project.folder}/custom/${filename}`,
        imagePath: null,
        aspect: ['wide','landscape','portrait','square'].includes(body.aspect) ? body.aspect : 'landscape',
      })
      await saveManifest(manifest, `Add Studio83 media slot: ${project.title}`)
    } else if (body.action === 'upload-custom') {
      const slot = mp.customSlots.find((item) => item.key === body.slotKey)
      if (!slot) throw new Error('Nepoznata pozicija.')
      await putImage(slot.path, body.data, `Update Studio83 custom image: ${project.title}`)
      slot.imagePath = slot.path
      await saveManifest(manifest, `Link Studio83 custom image: ${project.title}`)
    } else if (body.action === 'delete-custom-image') {
      const slot = mp.customSlots.find((item) => item.key === body.slotKey)
      if (!slot) throw new Error('Nepoznata pozicija.')
      if (slot.imagePath) await removeImagePath(slot.imagePath, `Remove Studio83 custom image: ${project.title}`)
      slot.imagePath = null
      await saveManifest(manifest, `Unlink Studio83 custom image: ${project.title}`)
    } else if (body.action === 'remove-slot') {
      const index = mp.customSlots.findIndex((item) => item.key === body.slotKey)
      if (index < 0) throw new Error('Nepoznata pozicija.')
      const [slot] = mp.customSlots.splice(index, 1)
      if (slot.imagePath) await removeImagePath(slot.imagePath, `Remove Studio83 custom slot image: ${project.title}`)
      await saveManifest(manifest, `Remove Studio83 media slot: ${project.title}`)
    } else {
      return json({ error: 'Nepoznata akcija.' }, 400)
    }

    const { projects } = await catalog()
    return json({ ok: true, projects })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Akcija nije uspjela.' }, 400)
  }
}

export const config = { path: '/api/studio83-media-controls' }
