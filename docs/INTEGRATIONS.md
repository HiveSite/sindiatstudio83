# Integracije

## GA4

Postojeći ID: `G-NH2FL5SP1Y`

Lokacije:

- vrijednost: `src/data/site.ts`
- loader: `src/components/analytics.tsx`
- App Router pageview tracking: `src/components/client-runtime.tsx`

Direktni GA4 config koristi `send_page_view: false`; pageview se šalje kroz client runtime pri navigaciji.

## GTM

Postojeći container: `GTM-PBXVW3GK`

- script i noscript: `src/components/analytics.tsx`
- custom događaji idu kroz `window.dataLayer`

Obavezno periodično provjeriti u GTM Preview i GA4 DebugView da GTM ne šalje dodatni GA4 pageview za isti stream, jer sajt podržava i direktni GA4 loader.

## Consent

- default consent se postavlja prije analytics loadera
- izbor se čuva verzionirano u `localStorage`
- korisnik može ponovo otvoriti postavke iz footera
- analytics/ad storage ostaje denied dok korisnik ne prihvati

## Kontakt forma

- UI i payload: `src/components/lead-form.tsx`
- endpoint: `src/data/site.ts -> integrations.contactEndpoint`
- uspjeh vodi na `/hvala/`
- čuvaju se UTM, gclid, fbclid i first-touch podaci

## Poslovi i kandidati

Studio83 više nema interni jobs board niti prijavnu formu za kandidate. Svi "Postani dio tima" tokovi i legacy `/postani-dio-tima/` URL vode na `https://imaposla.me/`.

## Blog

Produkcija čita lokalni `src/data/blog-posts.json`.

- `src/components/blog-explorer.tsx` samo filtrira/pretražuje već učitani lokalni sadržaj
- `npm run sync:blog` pokreće `scripts/sync-blog.mjs`
- sync endpoint se uzima iz `NEXT_PUBLIC_BLOG_ENDPOINT` ili fallback vrijednosti u samom sync scriptu
- remote feed se pri syncu pretvara u lokalni produkcijski snapshot, pa frontend ne zavisi od Google Apps Script feeda u runtime-u
