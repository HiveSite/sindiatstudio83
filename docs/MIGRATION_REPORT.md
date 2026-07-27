# Migration report - HTML produkcija u Next.js

## Šta je promijenjeno

Prethodni custom static generator i gotovi HTML fajlovi zamijenjeni su Next.js App Router projektom.

### Prije

- `build.mjs` ručno sklapa HTML stringove
- zajednički UI se generiše kroz template stringove
- interakcije su u jednom globalnom `app.js`
- build rezultat je `dist/`

### Sada

- `src/app/` predstavlja rute
- sadržajni layouti su React Server Components
- forme, meni, blog i jobs su mali Client Components
- TypeScript provjerava strukturu podataka i props
- build rezultat je `out/`
- dinamičke sadržajne rute koriste `generateStaticParams`

## Preneseno bez gubitka

- kompletan homepage dizajn i flow
- svih 5 usluga i cijene
- svih 5 industrija
- sva 3 case studyja
- svih 30 blog tekstova
- logo, OG i svi lokalni coveri
- GA4 `G-NH2FL5SP1Y`
- GTM `GTM-PBXVW3GK`
- kontakt Google Apps Script
- jobs Google Apps Script
- blog Google Apps Script
- UTM, gclid i fbclid capture
- consent default i cookie banner
- lead, blog, jobs i click dataLayer događaji
- stari `/sr-me/` redirecti
- sitemap, robots, canonical, Open Graph i schema podaci
- responsive CSS i mobilni sticky CTA

## Poboljšanja specifična za Next.js

- pageview se šalje i pri client-side promjeni rute
- sav statički sadržaj ostaje indeksabilan bez client fetcha
- samo interaktivne komponente šalju JavaScript browseru
- novi sadržaj se dodaje kroz data fajl, bez ručnog pravljenja HTML stranice
- isti template automatski pokriva usluge, industrije, projekte i blog
- Netlify dobija deterministički build command i `out` publish folder

## Test status u radnom okruženju

Završene provjere:

- parsiranje svih TS/TSX fajlova
- pomoćna stroga TypeScript provjera sa lokalnim module stubovima
- 41 TS/TSX source fajl
- 30 jedinstvenih blog slugova
- svi blog coveri postoje
- svi glavni integration ID-jevi postoje
- Netlify `out` konfiguracija postoji
- ključni legacy redirecti postoje

Ograničenje radnog okruženja:

- npm registry DNS nije bio dostupan, pa Next.js paketi nijesu mogli biti instalirani i stvarni `next build` nije mogao biti izvršen lokalno
- Netlify će pri prvom deployu instalirati pakete iz `package.json` i izvršiti `npm run build`

Prvi Netlify build zato treba pregledati. Ako dođe do package-registry ili verzijskog problema, log će jasno pokazati fazu prije deploya. Izvorni kod nije ostavljen bez provjere - prošao je sintaksnu, strukturnu i pomoćnu tip provjeru.
