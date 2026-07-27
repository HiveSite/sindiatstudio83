# Netlify deploy - tačna podešavanja

## Struktura GitHub repoa

Na početnoj strani repoa odmah moraju biti:

```text
package.json
next.config.ts
netlify.toml
src/
public/
```

Ne stavljati cijeli projekat u dodatni folder.

## Netlify polja

```text
Base directory: prazno
Build command: npm run build
Publish directory: out
Functions directory: prazno
Production branch: main
Node version: 20
```

Prethodna statička verzija koristila je `dist`. Next.js verzija koristi `out`. Ako Netlify prijavi da `dist` ne postoji, u projektu je ostalo staro publish podešavanje.

## Promjena postojećeg Netlify projekta

1. Project configuration
2. Build & deploy
3. Continuous deployment
4. Repository - Link to a different repository
5. Izaberi novi GitHub repo i `main`
6. Build settings - provjeri da je publish `out`
7. Deploys - Trigger deploy - Clear cache and deploy site

Domen ostaje na postojećem Netlify projektu.

## Environment varijable

Kod ima postojeće vrijednosti kao fallback. Po želji ih možeš prebaciti u Netlify:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GA4_ID
NEXT_PUBLIC_GTM_ID
NEXT_PUBLIC_CONTACT_ENDPOINT
NEXT_PUBLIC_JOBS_ENDPOINT
NEXT_PUBLIC_BLOG_ENDPOINT
```

Pošto su sve `NEXT_PUBLIC_`, vidljive su browseru. Ovdje nema tajnih ključeva.
