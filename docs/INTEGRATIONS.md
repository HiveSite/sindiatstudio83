# Integracije

## GA4

Postojeći ID: `G-NH2FL5SP1Y`

Lokacije:

- vrijednost: `src/data/site.ts`
- loader: `src/components/analytics.tsx`
- Next.js pageview tracking: `src/components/client-runtime.tsx`

Direktni GA4 config koristi `send_page_view: false`; pageview se šalje pri svakoj App Router navigaciji.

## GTM

Postojeći container: `GTM-PBXVW3GK`

- script i noscript: `src/components/analytics.tsx`
- custom događaji idu kroz `window.dataLayer`

Provjeriti u GTM Preview i GA4 DebugView da GTM ne šalje dodatni dupli GA4 pageview.

## Kontakt forma

- UI i payload: `src/components/lead-form.tsx`
- endpoint: `src/data/site.ts -> integrations.contactEndpoint`
- uspjeh vodi na `/hvala/`
- čuvaju se UTM, gclid i fbclid podaci

## Angažmani

- UI, fetch i forme: `src/components/jobs-board.tsx`
- endpoint: `src/data/site.ts -> integrations.jobsEndpoint`
- `GET ?action=jobs`
- `POST action=apply`
- `POST action=post_job`

## Blog feed

- endpoint: `src/data/site.ts -> integrations.blogEndpoint`
- frontend sync naslova/opisa: `src/components/blog-explorer.tsx`
- trajni sync u repo: `npm run sync:blog`
