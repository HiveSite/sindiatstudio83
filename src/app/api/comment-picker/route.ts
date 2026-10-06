import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: 'Instagram API nije konfigurisan.' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const postUrl = String(body?.postUrl || '').trim();
    if (!postUrl.includes('instagram.com/')) {
      return NextResponse.json({ error: 'Unesi validan Instagram URL.' }, { status: 400 });
    }

    const target = new URL(postUrl).pathname.replace(/\/$/, '');
    let mediaUrl = `https://graph.instagram.com/me/media?fields=id,permalink&limit=100&access_token=${encodeURIComponent(accessToken)}`;
    let media: { id: string; permalink?: string } | undefined;

    for (let i = 0; i < 100 && mediaUrl; i++) {
      const response = await fetch(mediaUrl, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error?.message || 'Instagram API greška.');
      media = (data.data || []).find((item: { id: string; permalink?: string }) => {
        if (!item.permalink) return false;
        try { return new URL(item.permalink).pathname.replace(/\/$/, '') === target; } catch { return false; }
      });
      if (media) break;
      mediaUrl = data.paging?.next || '';
    }

    if (!media) {
      return NextResponse.json({ error: 'Post nije pronađen na povezanom Instagram nalogu.' }, { status: 404 });
    }

    const comments: Array<{ id: string; username: string; text: string; timestamp?: string }> = [];
    let commentsUrl = `https://graph.instagram.com/${media.id}/comments?fields=id,text,username,timestamp&limit=100&access_token=${encodeURIComponent(accessToken)}`;

    for (let i = 0; i < 200 && commentsUrl; i++) {
      const response = await fetch(commentsUrl, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error?.message || 'Instagram API greška.');
      for (const item of data.data || []) {
        if (item.id && item.username) comments.push({ id: item.id, username: item.username, text: item.text || '', timestamp: item.timestamp });
      }
      commentsUrl = data.paging?.next || '';
    }

    return NextResponse.json({ media, comments, ownerUsername: process.env.INSTAGRAM_OWNER_USERNAME || null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Greška pri učitavanju komentara.' }, { status: 500 });
  }
}
