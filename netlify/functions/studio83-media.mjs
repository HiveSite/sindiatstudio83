const COOKIE_NAME = 'studio83_media_session'
const MAX_FILE_BYTES = 900_000
const MAX_FILES_PER_UPLOAD = 4

const PROJECTS = {
  'promo-timovi': {
    label: 'Promo timovi i terenski angažmani',
    slots: {
      tim: 'public/images/cases/promo-timovi/tim.webp',
      briefing: 'public/images/cases/promo-timovi/briefing.webp',
      realizacija: 'public/images/cases/promo-timovi/realizacija.webp',
      logistika: 'public/images/cases/promo-timovi/logistika.webp',
    },
  },
  'regulisane-aktivacije': {
    label: 'Promocije brendova pića',
    slots: {
      postavka: 'public/images/cases/regulisane-aktivacije/postavka.webp',
      tim: 'public/images/cases/regulisane-aktivacije/tim.webp',
      realizacija: 'public/images/cases/regulisane-aktivacije/realizacija.webp',
      detalj: 'public/images/cases/regulisane-aktivacije/detalj.webp',
    },
  },
  dogadjaji: {
    label: 'Privatni i korporativni događaji',
    slots: {
      postavka: 'public/images/cases/dogadjaji/postavka.webp',
      'program-tehnika': 'public/images/cases/dogadjaji/program-tehnika.webp',
      atmosfera: 'public/images/cases/dogadjaji/atmosfera.webp',
      backstage: 'public/images/cases/dogadjaji/backstage.webp',
    },
  },
  'student-connect': {
    label: 'Student Connect',
    slots: {
      prostor: 'public/images/cases/student-connect/prostor.webp',
      radionica: 'public/images/cases/student-connect/radionica.webp',
      atmosfera: 'public/images/cases/student-connect/atmosfera.webp',
      tim: 'public/images/cases/student-connect/tim.webp',
    },
  },
  'podgoricki-pazar': {
    label: 'Kućica na Podgoričkom pazaru',
    slots: {
      kucica: 'public/images/cases/podgoricki-pazar/kucica.webp',
      detalji: 'public/images/cases/podgoricki-pazar/detalji.webp',
      atmosfera: 'public/images/cases/podgoricki-pazar/atmosfera.webp',
      tim: 'public/images/cases/podgoricki-pazar/tim.webp',
    },
  },
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  })
}

function getEnv(name) {
  return typeof Netlify !== 'undefined' ? Netlify.env.get(name) : process.env[name]
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
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlDecode(signature),
      new TextEncoder().encode(payload),
    )
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

async function githubRequest(path, options = {}) {
  const token = getEnv('STUDIO83_GITHUB_TOKEN')
  if (!token) throw new Error('STUDIO83_GITHUB_TOKEN nije konfigurisan u Netlify environment variables.')
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const text = await response.text()
  const payload = text ? JSON.parse(text) : null
  if (!response.ok) {
    throw new Error(payload?.message || `GitHub API greška (${response.status})`)
  }
  return payload
}

function parseWebpData(data) {
  const match = /^data:image\/webp;base64,([A-Za-z0-9+/=]+)$/.exec(data || '')
  if (!match) throw new Error('Fajl nije validan WebP payload.')
  const buffer = Buffer.from(match[1], 'base64')
  if (!buffer.length || buffer.length > MAX_FILE_BYTES) {
    throw new Error(`WebP mora biti manji od ${Math.round(MAX_FILE_BYTES / 1000)} KB.`)
  }
  return buffer
}

async function commitFiles(projectKey, files) {
  const project = PROJECTS[projectKey]
  if (!project) throw new Error('Nepoznat projekat.')
  if (!Array.isArray(files) || files.length < 1 || files.length > MAX_FILES_PER_UPLOAD) {
    throw new Error('Po uploadu je dozvoljeno 1 do 4 fajla.')
  }

  const repo = getEnv('STUDIO83_GITHUB_REPO') || 'HiveSite/sindiatstudio83'
  const branch = getEnv('STUDIO83_GITHUB_BRANCH') || 'main'
  const [owner, name] = repo.split('/')
  if (!owner || !name) throw new Error('STUDIO83_GITHUB_REPO nije validan.')

  const uniqueSlots = new Set()
  const prepared = files.map((file) => {
    const path = project.slots[file.slotKey]
    if (!path) throw new Error(`Nepoznat slot: ${file.slotKey}`)
    if (uniqueSlots.has(file.slotKey)) throw new Error('Isti slot je poslat više puta.')
    uniqueSlots.add(file.slotKey)
    return { path, buffer: parseWebpData(file.data) }
  })

  const ref = await githubRequest(`/repos/${owner}/${name}/git/ref/heads/${encodeURIComponent(branch)}`)
  const headSha = ref.object.sha
  const headCommit = await githubRequest(`/repos/${owner}/${name}/git/commits/${headSha}`)

  const tree = []
  for (const file of prepared) {
    const blob = await githubRequest(`/repos/${owner}/${name}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: file.buffer.toString('base64'), encoding: 'base64' }),
    })
    tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha })
  }

  const newTree = await githubRequest(`/repos/${owner}/${name}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }),
  })

  const commit = await githubRequest(`/repos/${owner}/${name}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: `Upload Studio83 media: ${project.label}`,
      tree: newTree.sha,
      parents: [headSha],
    }),
  })

  await githubRequest(`/repos/${owner}/${name}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  })

  return { commit: commit.sha, paths: prepared.map((item) => item.path) }
}

export default async (req) => {
  const password = getEnv('STUDIO83_MEDIA_PASSWORD')
  if (!password) return json({ error: 'Media uploader nije konfigurisan.' }, 503)

  const authenticated = await verifySession(readCookie(req, COOKIE_NAME), password)

  if (req.method === 'GET') {
    return json({ authenticated, githubConfigured: Boolean(getEnv('STUDIO83_GITHUB_TOKEN')) })
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Neispravan zahtjev.' }, 400)
  }

  if (body.action === 'login') {
    if (body.password !== password) {
      await new Promise((resolve) => setTimeout(resolve, 350))
      return json({ error: 'Pogrešna lozinka.' }, 401)
    }
    const token = await makeSession(password)
    return json(
      { ok: true, githubConfigured: Boolean(getEnv('STUDIO83_GITHUB_TOKEN')) },
      200,
      { 'set-cookie': sessionCookie(token, 12 * 60 * 60) },
    )
  }

  if (body.action === 'logout') {
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) })
  }

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

export const config = {
  path: '/api/studio83-media',
}
