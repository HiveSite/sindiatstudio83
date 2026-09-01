// Studio83 private media manager
const COOKIE_NAME = 'studio83_media_session'
const MAX_FILE_BYTES = 900_000
const MAX_FILES_PER_UPLOAD = 12
const MEDIA_PASSWORD = 'studio83media2026!'

const MANAGED_THUMBNAIL_NAMES = new Set([
  'thumbnail.webp',
  'imaposla-thumbnail.webp',
  'battlebots-thumbnail.webp',
  'mini-sajtovi-thumbnail.webp',
  'hive-thumbnail.webp',
])

const PROJECTS = [
  {
    key: 'imaposla',
    title: 'ImaPosla.me',
    route: '/radovi/imaposla-digitalni-proizvod/',
    folder: 'public/images/cases/imaposla',
    planned: [
      ['imaposla-me-platforma-poslovi-crna-gora-cover.webp', 'Glavni cover / Radovi kartica'],
      ['imaposla-pocetna-platforma-poslovi.webp', 'Naslovna platforme'],
      ['imaposla-oglasi-za-posao.webp', 'Oglasi i detalj pozicije'],
      ['imaposla-brzi-angazmani.webp', 'Brzi angažmani'],
      ['imaposla-usluge-marketplace.webp', 'Usluge i marketplace'],
      ['imaposla-firme-poslodavci.webp', 'Firme i poslodavci'],
      ['imaposla-kategorije-poslova.webp', 'Kategorije poslova i mobilni prikaz'],
    ],
  },
  {
    key: 'battlebots-arena',
    title: 'BattleBots Arena',
    route: '/radovi/battlebots-arena/',
    folder: 'public/images/cases/battlebots-arena',
    planned: [
      ['battlebots-finalna-arena-i-publika.webp', 'Glavni cover / finalna arena i publika'],
      ['battlebots-edukativna-radionica.webp', 'Edukativna radionica i predavanje'],
      ['battlebots-programiranje-robota.webp', 'Programiranje i testiranje robota'],
      ['battlebots-ucesnici-na-programu.webp', 'Učesnici tokom programa i pripreme'],
      ['battlebots-pobjednicki-tim.webp', 'Pobjednički tim i završna dodjela'],
      ['battlebots-robot-u-borbenoj-areni.webp', 'Robot u borbenoj areni'],
      ['battlebots-roboti-pred-borbu.webp', 'Roboti i takmičari pred borbu'],
      ['battlebots-arena-produkcija-i-rasvjeta.webp', 'Arena, rasvjeta i produkcija događaja'],
    ],
  },
  {
    key: 'promo-timovi',
    title: 'Promo timovi i terenski angažmani',
    route: '/radovi/sistem-za-terenske-angazmane/',
    folder: 'public/images/cases/promo-timovi',
    planned: [
      ['tim.webp', 'Glavni cover / kompletan promo ili event tim'],
      ['briefing.webp', 'Briefing, priprema i podjela odgovornosti'],
      ['realizacija.webp', 'Realizacija kroz više pozicija ili lokacija'],
      ['logistika.webp', 'Logistika, supervizija i operativno izvještavanje'],
    ],
  },
  {
    key: 'regulisane-aktivacije',
    title: 'Regulisane aktivacije',
    route: '/radovi/aktivacije-regulisanih-brendova/',
    folder: 'public/images/cases/regulisane-aktivacije',
    planned: [
      ['postavka.webp', 'Glavni cover / postavka na lokaciji'],
      ['tim.webp', 'Promo tim, uniforme i priprema'],
      ['realizacija.webp', 'Realizacija i komunikacija u prostoru'],
      ['detalj.webp', 'Detalji postavke i završni dokaz standarda'],
    ],
  },
  {
    key: 'dogadjaji',
    title: 'Privatni i korporativni događaji',
    route: '/radovi/privatni-i-korporativni-dogadjaji/',
    folder: 'public/images/cases/dogadjaji',
    planned: [
      ['postavka.webp', 'Glavni cover / završena postavka prostora'],
      ['program-tehnika.webp', 'Program i tehnička realizacija'],
      ['atmosfera.webp', 'Atmosfera, tok gostiju i ključni momenti'],
      ['backstage.webp', 'Tim, backstage i koordinacija iza scene'],
    ],
  },
  {
    key: 'student-connect',
    title: 'Student Connect',
    route: '/radovi/student-connect-mini-festival/',
    folder: 'public/images/cases/student-connect',
    planned: [
      ['prostor.webp', 'Glavni cover / prostor i vizuelni identitet'],
      ['radionica.webp', 'Radionica, predavanje ili interaktivni sadržaj'],
      ['atmosfera.webp', 'Studenti, povezivanje i atmosfera'],
      ['tim.webp', 'Organizacioni tim i realizacija iza scene'],
    ],
  },
  {
    key: 'podgoricki-pazar',
    title: 'Kućica na Podgoričkom pazaru',
    route: '/radovi/kucica-na-podgorickom-pazaru/',
    folder: 'public/images/cases/podgoricki-pazar',
    planned: [
      ['kucica.webp', 'Glavni cover / kompletna kućica i postavka'],
      ['detalji.webp', 'Brending, detalji prostora i digitalni meni'],
      ['atmosfera.webp', 'Atmosfera, posjetioci i tok kroz termine'],
      ['tim.webp', 'Tim, program i svakodnevna operativa'],
    ],
  },
  {
    key: 'mini-sajtovi',
    title: 'Mini-sajtovi i digitalni alati',
    route: '/radovi/mini-sajtovi-i-digitalni-alati/',
    folder: 'public/images/cases/mini-sajtovi-i-digitalni-alati',
    planned: [
      ['mini-sajtovi-cover.webp', 'Glavni cover / kolaž digitalnih rješenja'],
      ['dj-miqelly-mobilna-naslovna.webp', 'DJ Miqelly - mobilna naslovna'],
      ['dj-miqelly-mobilni-program-i-zurke.webp', 'DJ Miqelly - mobilni program i kontakt'],
      ['dj-miqelly-desktop-portfolio.webp', 'DJ Miqelly - desktop portfolio'],
      ['stan-na-dan-mobilna-naslovna.webp', 'Stan na dan - mobilna naslovna'],
      ['stan-na-dan-mobilna-galerija.webp', 'Stan na dan - mobilna galerija'],
      ['stan-na-dan-lokacija-i-navigacija.webp', 'Stan na dan - lokacija i navigacija'],
      ['stan-na-dan-desktop-galerija.webp', 'Stan na dan - desktop galerija'],
      ['graficke-mape-desktop-alat.webp', 'Grafičke mape - desktop alat'],
      ['graficke-mape-podgorica-tamni-poster.webp', 'Grafičke mape - tamni poster'],
      ['graficke-mape-podgorica-lokacija.webp', 'Grafičke mape - označena lokacija'],
    ],
  },
  {
    key: 'hive-agency',
    title: 'Hive Agency platforma',
    route: '/radovi/hive-agency-platforma/',
    folder: 'public/images/cases/hive-agency',
    planned: [
      ['hive-team-building-avanturisticki-park.webp', 'Glavni cover / avanturistički park'],
      ['hive-team-building-paintball-turnir.webp', 'Paintball turnir'],
      ['hive-team-building-splavarska-misija.webp', 'Splavarska misija'],
      ['hive-team-building-planinarenje.webp', 'Planinarenje'],
      ['hive-team-building-timska-mreza-vizual.webp', 'Timska mreža - vizual'],
      ['hive-team-building-plazni-poligon-vizual.webp', 'Plažni poligon - vizual'],
      ['hive-team-building-zamkovi-od-pijeska-vizual.webp', 'Zamkovi od pijeska - vizual'],
    ],
  },
]

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  })
}

function env(name) {
  return Netlify.env.get(name)
}

function base64UrlEncode(bytes) {
  return Buffer.from(bytes).toString('base64url')
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url')
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function makeSession(secret) {
  const payload = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ exp: Date.now() + 12 * 60 * 60 * 1000 })))
  const key = await importHmacKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${base64UrlEncode(signature)}`
}

async function verifySession(token, secret) {
  if (!token || !token.includes('.')) return false
  const [payload, signature] = token.split('.')
  try {
    const key = await importHmacKey(secret)
    const valid = await crypto.subtle.verify('HMAC', key, base64UrlDecode(signature), new TextEncoder().encode(payload))
    if (!valid) return false
    const data = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)))
    return typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

function readCookie(req, name) {
  const raw = req.headers.get('cookie') || ''
  const item = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return item ? decodeURIComponent(item.slice(name.length + 1)) : ''
}

function sessionCookie(value, maxAge) {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
}

function repoConfig() {
  const repo = env('STUDIO83_GITHUB_REPO') || 'HiveSite/sindiatstudio83'
  const branch = env('STUDIO83_GITHUB_BRANCH') || 'main'
  const [owner, name] = repo.split('/')
  if (!owner || !name) throw new Error('STUDIO83_GITHUB_REPO nije validan.')
  return { repo, branch, owner, name }
}

async function githubApi(path, options = {}, requireToken = false) {
  const token = env('STUDIO83_GITHUB_TOKEN')
  if (requireToken && !token) throw new Error('STUDIO83_GITHUB_TOKEN nije konfigurisan.')
  const headers = {
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'content-type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) headers.authorization = `Bearer ${token}`
  const response = await fetch(`https://api.github.com${path}`, { ...options, headers })
  const text = await response.text()
  const payload = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(payload?.message || `GitHub API greška (${response.status})`)
  return payload
}

function humanize(fileName) {
  const text = String(fileName).replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : fileName
}

function safeFileName(fileName) {
  return /^[a-z0-9][a-z0-9._-]*\.webp$/i.test(String(fileName || ''))
}

function protectedTechnicalFile(fileName) {
  const value = String(fileName || '')
  return value.includes('/') || MANAGED_THUMBNAIL_NAMES.has(value) || /(?:^|[-_])og\.webp$/i.test(value)
}

async function repositoryState() {
  const { repo, branch, owner, name } = repoConfig()
  const ref = await githubApi(`/repos/${owner}/${name}/git/ref/heads/${encodeURIComponent(branch)}`)
  const headSha = ref.object.sha
  const headCommit = await githubApi(`/repos/${owner}/${name}/git/commits/${headSha}`)
  const tree = await githubApi(`/repos/${owner}/${name}/git/trees/${headCommit.tree.sha}?recursive=1`)
  const files = (tree.tree || []).filter((item) => item.type === 'blob' && /^public\/images\/cases\/.+\.webp$/i.test(item.path))
  return { repo, branch, owner, name, headSha, headCommit, files }
}

function visibleExistingForProject(project, files) {
  const prefix = `${project.folder}/`
  return files
    .filter((item) => item.path.startsWith(prefix))
    .map((item) => ({ ...item, fileName: item.path.slice(prefix.length) }))
    .filter((item) => safeFileName(item.fileName) && !protectedTechnicalFile(item.fileName))
}

async function repositoryCatalog() {
  const state = await repositoryState()
  const projects = PROJECTS.map((project) => {
    const existing = visibleExistingForProject(project, state.files)
    const existingNames = new Map(existing.map((item) => [item.fileName, item]))
    const plannedNames = new Set(project.planned.map(([fileName]) => fileName))
    const slots = project.planned.map(([fileName, label]) => {
      const item = existingNames.get(fileName)
      const path = `${project.folder}/${fileName}`
      return {
        key: fileName,
        label,
        fileName,
        exists: Boolean(item),
        planned: true,
        path,
        size: item?.size || 0,
        src: `/${path.replace(/^public\//, '')}`,
        previewUrl: item ? `https://raw.githubusercontent.com/${state.repo}/${state.branch}/${path}?v=${state.headSha.slice(0, 10)}` : null,
      }
    })

    for (const item of existing.sort((a, b) => a.path.localeCompare(b.path))) {
      if (plannedNames.has(item.fileName)) continue
      slots.push({
        key: item.fileName,
        label: humanize(item.fileName),
        fileName: item.fileName,
        exists: true,
        planned: false,
        path: item.path,
        size: item.size || 0,
        src: `/${item.path.replace(/^public\//, '')}`,
        previewUrl: `https://raw.githubusercontent.com/${state.repo}/${state.branch}/${item.path}?v=${state.headSha.slice(0, 10)}`,
      })
    }

    return { ...project, slots, existingCount: slots.filter((slot) => slot.exists).length }
  })

  return { projects, headSha: state.headSha }
}

function parseWebpData(data) {
  const match = /^data:image\/webp;base64,([A-Za-z0-9+/=]+)$/.exec(String(data || ''))
  if (!match) throw new Error('Fajl nije validan WebP payload.')
  const buffer = Buffer.from(match[1], 'base64')
  if (!buffer.length || buffer.length > MAX_FILE_BYTES) {
    throw new Error(`WebP mora biti manji od ${Math.round(MAX_FILE_BYTES / 1000)} KB.`)
  }
  return buffer
}

async function commitFiles(projectKey, files) {
  const project = PROJECTS.find((item) => item.key === projectKey)
  if (!project) throw new Error('Nepoznat projekat.')
  if (!Array.isArray(files) || files.length < 1 || files.length > MAX_FILES_PER_UPLOAD) {
    throw new Error(`Po jednom čuvanju je dozvoljeno 1 do ${MAX_FILES_PER_UPLOAD} fajlova.`)
  }

  const state = await repositoryState()
  const existingNames = new Set(visibleExistingForProject(project, state.files).map((item) => item.fileName))
  const plannedNames = new Set(project.planned.map(([fileName]) => fileName))
  const uniqueNames = new Set()

  const prepared = files.map((file) => {
    const fileName = String(file.fileName || '')
    if (!safeFileName(fileName) || protectedTechnicalFile(fileName)) throw new Error('Ovaj fajl nije dozvoljen u standardnom media editoru.')
    if (!plannedNames.has(fileName) && !existingNames.has(fileName)) throw new Error('Nova proizvoljna pozicija mora se dodati kroz Napredno upravljanje.')
    if (uniqueNames.has(fileName)) throw new Error('Isti fajl je poslat više puta.')
    uniqueNames.add(fileName)
    return { path: `${project.folder}/${fileName}`, buffer: parseWebpData(file.data) }
  })

  const tree = []
  for (const file of prepared) {
    const blob = await githubApi(`/repos/${state.owner}/${state.name}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: file.buffer.toString('base64'), encoding: 'base64' }),
    }, true)
    tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha })
  }

  const newTree = await githubApi(`/repos/${state.owner}/${state.name}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: state.headCommit.tree.sha, tree }),
  }, true)
  const commit = await githubApi(`/repos/${state.owner}/${state.name}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message: `Update Studio83 media: ${project.title}`, tree: newTree.sha, parents: [state.headSha] }),
  }, true)
  await githubApi(`/repos/${state.owner}/${state.name}/git/refs/heads/${encodeURIComponent(state.branch)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  }, true)

  return { commit: commit.sha, paths: prepared.map((item) => item.path) }
}

export default async (req) => {
  const authenticated = await verifySession(readCookie(req, COOKIE_NAME), MEDIA_PASSWORD)
  const githubConfigured = Boolean(env('STUDIO83_GITHUB_TOKEN'))

  if (req.method === 'GET') {
    if (!authenticated) return json({ authenticated: false, githubConfigured })
    try {
      const catalog = await repositoryCatalog()
      return json({ authenticated: true, githubConfigured, ...catalog })
    } catch (error) {
      return json({
        authenticated: true,
        githubConfigured,
        projects: PROJECTS.map((project) => ({
          ...project,
          slots: project.planned.map(([fileName, label]) => ({
            key: fileName,
            label,
            fileName,
            exists: false,
            planned: true,
            path: `${project.folder}/${fileName}`,
            size: 0,
            src: `/${project.folder.replace(/^public\//, '')}/${fileName}`,
            previewUrl: null,
          })),
        })),
        catalogError: error instanceof Error ? error.message : 'Katalog nije dostupan.',
      })
    }
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body
  try { body = await req.json() } catch { return json({ error: 'Neispravan zahtjev.' }, 400) }

  if (body.action === 'login') {
    if (body.password !== MEDIA_PASSWORD) {
      await new Promise((resolve) => setTimeout(resolve, 350))
      return json({ error: 'Pogrešna lozinka.' }, 401)
    }
    const token = await makeSession(MEDIA_PASSWORD)
    return json({ ok: true, githubConfigured }, 200, { 'set-cookie': sessionCookie(token, 12 * 60 * 60) })
  }

  if (body.action === 'logout') return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) })
  if (!authenticated) return json({ error: 'Sesija je istekla. Prijavi se ponovo.' }, 401)

  if (body.action === 'upload') {
    try {
      const result = await commitFiles(body.projectKey, body.files)
      return json({ ok: true, ...result })
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : 'Upload nije uspio.' }, 400)
    }
  }

  return json({ error: 'Nepoznata akcija.' }, 400)
}

export const config = { path: '/api/studio83-media' }
