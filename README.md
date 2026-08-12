# Sindikat Studio 83 - Next.js produkcijski sajt

Next.js 16 App Router sajt za Sindikat Studio 83. Produkcija je statički eksportovana i obuhvata ponudu, case studies, industrijske stranice, resurse, GA4/GTM mjerenje, Google Apps Script kontakt formu, SEO i legacy redirecte.

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

`netlify.toml` je source of truth za build, cache i security header konfiguraciju.

## Najvažniji fajlovi

- `src/data/site.ts` - domen, kontakt, analitika, navigacija i proof brojke
- `src/data/services.ts` - sadržaj glavnih usluga
- `src/data/service-products.ts` - centralni proizvodi i javne početne cijene
- `src/data/industries.ts` - industrijske stranice
- `src/data/cases.ts` - case studies
- `src/data/blog-posts.json` - lokalni produkcijski blog sadržaj
- `src/app/page.tsx` - homepage
- `src/app/globals.css` - glavni vizuelni sistem
- `src/app/sales-ux.css` - product/service sales UI
- `src/app/contrast.css` - završni contrast/readability sloj
- `src/components/lead-form.tsx` - kontakt i brief forma
- `src/components/analytics.tsx` - GA4, GTM i consent default
- `src/lib/metadata.ts` i `src/lib/schema.ts` - metadata i structured-data SEO sloj
- `public/_redirects` - canonical, legacy i ImaPosla 301 redirecti

Prijave za poslove više nijesu dio ovog sajta. Svi "Postani dio tima" tokovi vode na `imaposla.me`.

Detaljno: `docs/ARCHITECTURE.md`, `docs/INTEGRATIONS.md` i `docs/CHANGE_MAP.md`.
