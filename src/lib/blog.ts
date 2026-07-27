const blockedTags = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta']

export function cleanArticleBody(body: string, cover: string) {
  let html = String(body || '')

  for (const tag of blockedTags) {
    html = html.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi'), '')
    html = html.replace(new RegExp(`<${tag}\\b[^>]*\\/?\\s*>`, 'gi'), '')
  }

  html = html
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1="#"')
    .replace(/target\s*=\s*(["'])_blank\1/gi, 'target="_blank" rel="noopener noreferrer"')

  const escapedCover = cover.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  html = html.replace(new RegExp(`<figure[^>]*>[\\s\\S]*?<img[^>]+src=["']${escapedCover}["'][^>]*>[\\s\\S]*?<\\/figure>`, 'i'), '')
  html = html.replace(new RegExp(`<img[^>]+src=["']${escapedCover}["'][^>]*>`, 'i'), '')
  return html
}

export function plainTextFromHtml(body: string) {
  return String(body || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
