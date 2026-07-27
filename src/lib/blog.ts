export function cleanArticleBody(raw = '', cover = '/images/covers/generic.svg') {
  return raw
    .replaceAll('/sr-me/blog/', '/blog/')
    .replaceAll('/sr-me/kontakt/', '/kontakt/')
    .replaceAll('/sr-me/usluge/', '/usluge/')
    .replace(/src="https?:\/\/[^\"]+"/gi, `src="${cover}"`)
    .replace(/<img(?![^>]*\bwidth=)/gi, '<img width="1280" height="720"')
    .replace(/<p>\s*<strong>([^<]+)<\/strong>\s*<\/p>/gi, '<h2>$1</h2>')
    .replace(/ style="[^"]*"/g, '')
}
