# Mapa izmjena - šta tačno mijenjaš i gdje

Ovaj dokument je glavno uputstvo za svakodnevne izmjene. Ne mijenjaj `out/` ručno - taj folder se regeneriše pri svakom buildu.

## 1. Osnovni podaci firme

Fajl: `src/data/site.ts`

| Šta mijenjaš | Tačno polje |
|---|---|
| Naziv studija | `site.name` |
| Kratki naziv | `site.shortName` |
| Produkcijski domen | `site.domain` fallback ili `NEXT_PUBLIC_SITE_URL` |
| Lokacija | `site.location` |
| Kontakt email | `site.email` |
| Instagram link | `site.instagram` |
| ImaPosla link | `site.imaposla` |
| GA4 ID | `site.analytics.ga4Id` |
| GTM ID | `site.analytics.gtmId` |
| Kontakt Apps Script | `site.integrations.contactEndpoint` |
| Jobs Apps Script | `site.integrations.jobsEndpoint` |
| Blog Apps Script | `site.integrations.blogEndpoint` |
| Brojke ispod hero sekcije | `site.proof` |
| Glavni meni | `navigation` |

Nakon izmjene:

```bash
npm run check
```

## 2. Homepage

Fajl: `src/app/page.tsx`

| Dio stranice | Tekst ili blok koji tražiš |
|---|---|
| SEO title i description | `export const metadata` |
| Hero eyebrow | `Podgorica - digital - ljudi - teren` |
| Glavni naslov | `Kampanje koje...` |
| Hero opis | `Povezujemo Meta i Google...` |
| Glavni CTA | `Zatraži plan i procjenu` |
| Drugi CTA | `Pogledaj rezultate` |
| Četiri problema | `problem-grid` |
| Aktivacije proces | `step-list` u sekciji `Aktivacije i eventi` |
| Cjenovni modeli | `pricing-panel` |
| Homepage FAQ | konstanta `faqs` na vrhu fajla |

Kartice usluga, industrija i radova na homepageu se ne mijenjaju ovdje - povlače se iz data fajlova navedenih ispod.

## 3. Usluge i cijene

Fajl: `src/data/services.ts`

Svaka usluga je jedan objekat u nizu `services`.

| Polje | Šta kontroliše |
|---|---|
| `slug` | URL, npr. `/usluge/performance-marketing/` |
| `eyebrow` | mala oznaka iznad naslova |
| `title` | H1 na detaljnoj stranici |
| `shortTitle` | naziv kartice i breadcrumb |
| `summary` | glavni opis i SEO description |
| `outcomes` | tipični ishodi |
| `includes` | blok `Šta konkretno dobijaš` |
| `process` | koraci procesa |
| `pricing` | nazivi paketa, opis i cijena |
| `faq` | FAQ detaljne stranice |

### Promjena postojeće cijene

Nađi uslugu, zatim njen `pricing` niz. Primjer:

```ts
pricing: [
  { name: 'Dijagnostika', price: 'od 190 €', text: 'Jednokratni audit i akcioni plan.' },
]
```

Mijenjaš samo `price` i po potrebi `text`.

### Dodavanje nove usluge

1. U `src/data/services.ts` kopiraj cijeli objekat postojeće usluge.
2. Postavi jedinstven `slug` bez razmaka i dijakritike.
3. Popuni sva polja.
4. Nova ruta se automatski generiše kroz `src/app/usluge/[slug]/page.tsx`.
5. Ako treba u glavnom meniju, dodaj je u `navigation` u `src/data/site.ts`.
6. Ako treba u footeru, dodaj link u `src/components/footer.tsx`.

Ne pravi novi `page.tsx` za svaku uslugu.

## 4. Stranice usluga - izgled i flow

- Listing: `src/app/usluge/page.tsx`
- Generička detaljna stranica: `src/app/usluge/[slug]/page.tsx`

Tu mijenjaš redosljed sekcija koji važi za sve usluge. Sadržaj pojedinačne usluge mijenja se u `src/data/services.ts`.

## 5. Industrije

Fajl: `src/data/industries.ts`

| Polje | Šta kontroliše |
|---|---|
| `slug` | URL |
| `title` | naziv industrije |
| `summary` | opis |
| `problems` | lista problema |
| `solutions` | lista rješenja |
| `cta` | tekst CTA dugmeta |

- Listing layout: `src/app/industrije/page.tsx`
- Detaljni layout: `src/app/industrije/[slug]/page.tsx`
- Povezane usluge po industriji: varijabla `relatedSlugs` u detaljnom layoutu

## 6. Case studies i radovi

Fajl: `src/data/cases.ts`

| Polje | Šta kontroliše |
|---|---|
| `slug` | URL projekta |
| `type` | kategorija projekta |
| `title` | naziv projekta |
| `summary` | kratak opis |
| `metrics` | tri glavne brojke |
| `challenge` | izazov |
| `solution` | sistem/rješenje |
| `result` | ishod |
| `services` | tagovi usluga |

- Listing: `src/app/radovi/page.tsx`
- Detaljni template: `src/app/radovi/[slug]/page.tsx`

### Dodavanje novog case studyja

Dodaj novi objekat u `cases`. Ruta, sitemap i listing nastaju automatski.

## 7. Blog

Fajl sa sadržajem: `src/data/blog-posts.json`

Svaki post ima:

```json
{
  "slug": "p01",
  "title": "Naslov",
  "excerpt": "Kratak opis",
  "description": "SEO description",
  "category": "performance",
  "date": "",
  "cover": "/images/blog/p01.svg",
  "coverAlt": "Opis slike",
  "tags": ["Meta", "budžet"],
  "body": "<p>HTML sadržaj...</p>"
}
```

### Ručna izmjena teksta

Mijenjaš odgovarajući objekat u `blog-posts.json`.

### Sync sa Google Apps Script feedom

```bash
npm run sync:blog
npm run check
```

Sync skripta: `scripts/sync-blog.mjs`.

### Kategorije i nazivi kategorija

Fajl: `src/data/blog.ts`

Objekat: `categoryLabels`.

### Blog listing i filter

Fajl: `src/components/blog-explorer.tsx`.

### Izgled članka

Fajl: `src/app/blog/[slug]/page.tsx`.

## 8. Slike

Sve javne slike su u `public/images/`.

| Vrsta | Folder |
|---|---|
| Logo i OG cover | `public/images/brand/` |
| Blog coveri | `public/images/blog/` |
| Opšti coveri | `public/images/covers/` |

Za zamjenu slike zadrži isti naziv fajla i dimenzije/aspect ratio gdje je moguće. Ako mijenjaš putanju, promijeni i referencu u odgovarajućem data fajlu.

### Logo

Zamijeni:

```text
public/images/brand/logo.png
```

Logo se automatski koristi u headeru, footeru i Organization schema podacima.

### OG slika

Zamijeni:

```text
public/images/brand/og-cover.png
```

## 9. Boje, fontovi, spacing i responsive dizajn

Fajl: `src/app/globals.css`

Na samom vrhu su CSS varijable:

```css
--bg
--panel
--text
--muted
--pink
--cyan
--yellow
--green
--container
--radius
--header
```

### Primarna roze boja

Promijeni `--pink` i po potrebi `--pink-light`.

### Maksimalna širina sajta

Promijeni `--container`.

### Mobilni breakpointi

Na dnu fajla:

```css
@media (max-width:1080px)
@media (max-width:900px)
@media (max-width:620px)
```

## 10. Header i meni

- Funkcionalnost i markup: `src/components/header.tsx`
- Linkovi: `src/data/site.ts -> navigation`
- Stil: `src/app/globals.css`, sekcija `/* Header */`

CTA dugme `Zatraži plan` mijenjaš u `header.tsx`.

## 11. Footer

Fajl: `src/components/footer.tsx`

Tu mijenjaš:

- opis brenda
- kolone linkova
- prikaz kontakta
- pravne linkove
- mobilni sticky CTA

Email i Instagram vrijednosti se ipak povlače iz `src/data/site.ts`.

## 12. Kontakt forma

Fajl: `src/components/lead-form.tsx`

| Šta mijenjaš | Gdje |
|---|---|
| Polja forme | JSX unutar `form-grid` |
| Tekst dugmeta | `Pošalji upit` |
| Payload koji ide endpointu | objekat `payload` |
| Poruka uspjeha | `Hvala. Upit je poslat...` |
| Poruka greške | `Slanje nije prošlo...` |
| Redirect poslije uspjeha | `router.push('/hvala/...')` |

Endpoint ne mijenjaš ovdje. Mijenja se u `src/data/site.ts` ili Netlify env varijabli `NEXT_PUBLIC_CONTACT_ENDPOINT`.

Kontakt page layout: `src/app/kontakt/page.tsx`.

## 13. Angažmani i prijave

Fajl: `src/components/jobs-board.tsx`

| Funkcija | Dio koda |
|---|---|
| Fallback pozicije | `fallbackJobs` |
| Učitavanje oglasa | `fetch(...?action=jobs)` |
| Prijava kandidata | `submitApplication` |
| Slanje oglasa firme | `submitJob` |
| Modal | blok sa klasom `modal` |
| Tekst roster procesa | druga `list-panel` kartica |

Endpoint: `src/data/site.ts -> integrations.jobsEndpoint`.

Page hero: `src/app/postani-dio-tima/page.tsx`.

## 14. GA4, GTM i tracking

### ID-jevi

`src/data/site.ts`

### Učitavanje skripti i consent default

`src/components/analytics.tsx`

### Next.js pageview, UTM memorija i click tracking

`src/components/client-runtime.tsx`

### Kontakt događaji

`src/components/lead-form.tsx`

### Blog događaji

`src/components/blog-explorer.tsx`

### Jobs događaji

`src/components/jobs-board.tsx`

Događaji koji ostaju:

```text
header_lead
hero_lead
hero_cases
final_lead
mobile_sticky_lead
service_lead
form_start
form_error
generate_lead
email_click
phone_click
instagram_click
imaposla_click
blog_filter
blog_feed_sync
job_apply_start
job_application
job_post_submit
consent_update
next_page_view
```

## 15. Cookie banner

Fajl: `src/components/cookie-banner.tsx`

Tu mijenjaš tekst, dugmad i consent logiku.

Politika kolačića: `src/data/legal.ts`, objekat `kolacici`.

## 16. SEO metadata

### Globalna pravila

`src/lib/metadata.ts`

Kontroliše title, canonical, robots, Open Graph i Twitter metadata.

### Metadata pojedinačne stranice

Na vrhu odgovarajućeg `page.tsx` fajla:

```ts
export const metadata = createMetadata(...)
```

Dinamičke stranice koriste `generateMetadata` u `[slug]/page.tsx`.

### Schema podaci

- helperi: `src/lib/schema.ts`
- output komponenta: `src/components/json-ld.tsx`
- Organization i WebSite: `src/app/layout.tsx`
- Service schema: `src/app/usluge/[slug]/page.tsx`
- Article schema: `src/app/blog/[slug]/page.tsx`
- CreativeWork schema: `src/app/radovi/[slug]/page.tsx`

### Sitemap

`src/app/sitemap.ts`

Nove usluge, industrije, case studies i blog postovi automatski ulaze u sitemap jer se povlače iz data fajlova.

### Robots

`src/app/robots.ts`.

## 17. Redirecti

Netlify fajl: `public/_redirects`

Format:

```text
/stari-url/ /novi-url/ 301!
```

Nakon izmjene uradi deploy. Ne treba mijenjati React/Next kod.

## 18. Sigurnosni i cache headeri

- Netlify: `netlify.toml`
- Statički fallback: `public/_headers`

## 19. Pravni tekstovi

Fajl: `src/data/legal.ts`

Objekti:

- `privatnost`
- `kolacici`
- `uslovi-koriscenja`

Generički template: `src/app/[legal]/page.tsx`.

## 20. 404 i thank-you stranica

- 404: `src/app/not-found.tsx`
- Hvala: `src/app/hvala/page.tsx`

## 21. Dodavanje potpuno nove obične stranice

Primjer `/partneri/`:

1. Napravi `src/app/partneri/page.tsx`.
2. Dodaj metadata kroz `createMetadata`.
3. Dodaj sadržaj kao Server Component.
4. Dodaj link u navigaciju/footer ako je potreban.
5. Dodaj `/partneri/` u `src/app/sitemap.ts` ako stranica treba da se indeksira.
6. Pokreni `npm run check`.

## 22. Šta se nikad ne mijenja ručno

Ne mijenjaj:

```text
.next/
out/
node_modules/
```

To su generisani folderi.
