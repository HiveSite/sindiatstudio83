export function cleanArticleBody(raw = '', cover = '/images/covers/generic.svg') {
  return raw
    .replace(/<(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1="#"')
    .replaceAll('/sr-me/blog/', '/blog/')
    .replaceAll('/sr-me/kontakt/', '/kontakt/')
    .replaceAll('/sr-me/usluge/', '/usluge/')
    .replace(/src="https?:\/\/[^\"]+"/gi, `src="${cover}"`)
    .replace(/<img(?![^>]*\bwidth=)/gi, '<img width="1280" height="720"')
    .replace(/<p>\s*<strong>([^<]+)<\/strong>\s*<\/p>/gi, '<h2>$1</h2>')
    .replace(/ style="[^"]*"/g, '')
    .replace(/target="_blank"(?![^>]*\brel=)/gi, 'target="_blank" rel="noopener noreferrer"')
}
