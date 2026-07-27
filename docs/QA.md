# QA i provjera

## Prije svakog push-a

```bash
npm run typecheck
npm run validate:source
npm run build
```

Ili sve zajedno:

```bash
npm run check
```

## Šta provjerava `validate:source`

- obavezne arhitekturne fajlove
- TS/TSX sintaksu
- 30 blog postova i jedinstvene slugove
- postojanje blog cover slika
- ključne legacy redirecte

## Staging browser provjera

- homepage desktop i mobilni
- header i mobilni meni
- svaki tip dinamičke stranice
- kontakt forma i `/hvala/`
- jobs feed, otvorena prijava i objava angažmana
- blog filter i search
- cookie Accept/Reject
- GTM Preview
- GA4 DebugView
- stari `/sr-me/` URL-ovi
- 404
- sitemap.xml i robots.txt

## Važna GA4 provjera

Direktni GA4 je sačuvan, a GTM container je takođe sačuvan. U DebugView provjeri da jedan route change šalje samo jedan poslovno relevantan pageview. Ako GTM takođe šalje GA4 pageview, ukloni duplu konfiguraciju iz GTM-a ili iz direktnog loadera tek nakon provjere svih ostalih GTM tagova.
