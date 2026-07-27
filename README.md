# Sindikat Studio 83 - Next.js produkcijski sajt

Kompletna Next.js 16 App Router verzija sajta. Dizajn, sadržaj, ponuda, GA4/GTM, Google Apps Script forme, blog, angažmani, SEO i stari redirecti preneseni su iz prethodne produkcijske verzije.

## Brzi početak

```bash
npm install
npm run dev
```

Lokalno: `http://localhost:3000`

Produkcijska provjera:

```bash
npm run check
```

Build rezultat se generiše u folderu `out/`.

## Netlify

- Base directory: prazno
- Build command: `npm run build`
- Publish directory: `out`
- Node: `20`

`netlify.toml` već sadrži ovu konfiguraciju. Kada je repo pravilno postavljen u rootu, Netlify ne treba ručno podešavati osim povezivanja repozitorijuma.

## Najvažniji fajlovi

- `src/data/site.ts` - domen, email, analitika, endpointi, navigacija i brojke
- `src/data/services.ts` - kompletna ponuda i cijene
- `src/data/industries.ts` - industrijske stranice
- `src/data/cases.ts` - case studies
- `src/data/blog-posts.json` - blog sadržaj
- `src/app/page.tsx` - homepage
- `src/app/globals.css` - kompletan vizuelni sistem
- `src/components/lead-form.tsx` - kontakt forma
- `src/components/jobs-board.tsx` - poslovi, prijave i objava angažmana
- `src/components/analytics.tsx` - GA4, GTM i consent default
- `public/_redirects` - Netlify 301 redirecti

Detaljno: `docs/CHANGE_MAP.md`.
