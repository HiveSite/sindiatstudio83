const SESSION_COOKIE = 'studio83_media_session';

function sessionToken(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const entry = cookie.split(';').map(part => part.trim()).find(part => part.startsWith(SESSION_COOKIE + '='));
  try { return entry ? decodeURIComponent(entry.slice(SESSION_COOKIE.length + 1)) : ''; }
  catch { return ''; }
}

async function hasAdminSession(request: Request) {
  const secret = (Netlify.env.get('STUDIO83_MEDIA_PASSWORD') || '').trim();
  if (secret.length < 24) return false;
  const token = sessionToken(request);
  if (!token || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');
  try {
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const valid = await crypto.subtle.verify(
      'HMAC', key, Uint8Array.from(Buffer.from(signature, 'base64url')), new TextEncoder().encode(payload)
    );
    if (!valid) return false;
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: number };
    return typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch { return false; }
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; }
  catch { return false; }
}

declare const Netlify: { env: { get: (key: string) => string | undefined } };

type MediaItem = { id: string; permalink?: string };
type CommentItem = { id: string; text?: string; username?: string; timestamp?: string };
type GraphPage<T> = { data?: T[]; paging?: { next?: string }; error?: { message?: string } };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function canonical(input: string) {
  try {
    const url = new URL(input);
    if (url.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(url.hostname) || url.port) return '';
    const parts = url.pathname.split('/').filter(Boolean);
    return parts.length >= 2 && ['p', 'reel', 'tv'].includes(parts[0]) ? `/${parts[0]}/${parts[1]}` : '';
  } catch { return ''; }
}

function graph(path: string, token: string) {
  return `https://graph.instagram.com${path}${path.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(token)}`;
}

async function graphFetch<T>(url: string) {
  const endpoint = new URL(url);
  if (endpoint.protocol !== 'https:' || endpoint.hostname !== 'graph.instagram.com' || endpoint.port) {
    throw new Error('Instagram API returned an invalid pagination URL.');
  }
  const response = await fetch(endpoint, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(12000) });
  const data = await response.json().catch(() => ({})) as GraphPage<unknown>;
  if (!response.ok || data.error) throw new Error(data.error?.message || `Instagram API request failed (${response.status}).`);
  return data as T;
}

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!sameOrigin(req)) return json({ error: 'Forbidden origin.' }, 403);
  if (!(await hasAdminSession(req))) return json({ error: 'Administrator session required.' }, 401);
  const token = (Netlify.env.get('INSTAGRAM_ACCESS_TOKEN') || '').trim();
  if (!token) return json({ error: 'Instagram API token nije konfigurisan na serveru.' }, 503);

  try {
    const body = await req.json().catch(() => ({})) as { postUrl?: string };
    const postUrl = String(body.postUrl || '').trim();
    const target = canonical(postUrl);
    if (!target) return json({ error: 'Unesi validan Instagram post ili reel URL.' }, 400);

    let mediaUrl = graph('/me/media?fields=id,permalink&limit=100', token);
    let media: MediaItem | undefined;
    for (let i = 0; i < 100 && mediaUrl; i++) {
      const page = await graphFetch<GraphPage<MediaItem>>(mediaUrl);
      media = (page.data || []).find(item => item.permalink && canonical(item.permalink) === target);
      if (media) break;
      mediaUrl = page.paging?.next || '';
    }
    if (!media) return json({ error: 'Post nije pronađen među objavama povezanog Instagram naloga.' }, 404);

    const comments: CommentItem[] = [];
    let commentsUrl = graph(`/${media.id}/comments?fields=id,text,username,timestamp&limit=100`, token);
    for (let i = 0; i < 200 && commentsUrl; i++) {
      const page = await graphFetch<GraphPage<CommentItem>>(commentsUrl);
      for (const item of page.data || []) {
        if (item.id && item.username) comments.push({ id: item.id, username: item.username, text: item.text || '', timestamp: item.timestamp });
      }
      commentsUrl = page.paging?.next || '';
    }

    return json({ media, comments, ownerUsername: (Netlify.env.get('INSTAGRAM_OWNER_USERNAME') || '').trim() || null });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Greška pri učitavanju komentara.' }, 500);
  }
};

export const config = { path: '/comment-picker/api' };
