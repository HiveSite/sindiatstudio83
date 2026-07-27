# Sindikat Studio 83 - detaljan audit sajta

Datum pregleda: 27. jul 2026.

## Izvršni zaključak

Nova Next.js verzija je tehnički zdrava i znatno bolja od prethodne statičke verzije. Produkcijski build je uspješno objavljen na Netlifyju kao Next.js projekat, generiše 58 stranica, obrađuje postojeće redirecte i zadržava GA4, GTM i Google Apps Script integracije.

Najveći preostali problem više nije struktura koda. Najveći problem je povjerenje: sajt govori dovoljno dobro šta Sindikat radi, ali još nema dovoljno stvarnih fotografija, izjava klijenata, logotipa i case study rezultata da u potpunosti potvrdi obećanje.

## Trenutno stanje

- 5 glavnih usluga
- 5 industrijskih stranica
- 3 case study stranice
- 30 blog tekstova
- kontakt i recruitment forme povezane sa postojećim endpointima
- GA4 i GTM zadržani
- statički Next.js export na Netlifyju
- redirecti sa stare `/sr-me/` strukture
- sitemap, robots, canonical, Open Graph i JSON-LD sistem

## Ukupna ocjena

| Oblast | Ocjena | Napomena |
|---|---:|---|
| Pozicioniranje | 8/10 | Jasna kombinacija digitala, ljudi i terena |
| Struktura ponude | 8/10 | Usluge su organizovane prema cilju |
| UI i vizuelna konzistentnost | 8/10 | Jak sistem, ali nedostaju stvarni vizuali |
| UX i konverzija | 7/10 | Dobar CTA flow, potrebno jače povjerenje i bolja potvrda formi |
| SEO osnova | 8/10 | Dobra tehnička osnova, blog traži uredničku konsolidaciju |
| Sadržaj i dokaz | 5.5/10 | Najveći prostor za rast |
| Tehnička održivost | 9/10 | Centralizovani podaci, komponente i statički export |
| Analitika i mjerenje | 6.5/10 | Događaji postoje, ali treba provjeriti duplikaciju i kvalitet leadova |

## Šta je dobro

1. Glavna poruka je mnogo jasnija od stare full-service ponude.
2. Homepage vodi korisnika od problema do usluge, dokaza i kontakta.
3. Usluge su organizovane prema ishodu, a ne prema alatima.
4. Cijene imaju orijentacioni okvir i odvojene troškove.
5. Svaka glavna ruta ima title, description, canonical i Open Graph podatke.
6. Stari URL-ovi imaju 301 redirecte.
7. Forme čuvaju UTM, gclid i fbclid podatke.
8. Mobilni sticky CTA i skip link su dobra osnova za konverziju i pristupačnost.
9. Sadržaj, navigacija, integracije i SEO podaci sada se mijenjaju centralizovano.
10. Statički export daje dobru brzinu i mali operativni rizik.

## Kritični problemi

### 1. Dokaz nije dovoljno jak

Trenutni case studyji uglavnom pokazuju obim i operativni rezultat, ali ne potvrđuju dovoljno prvu uslugu - performance marketing. Potrebni su stvarni screenshotovi, period, uloga Sindikata, budžetski okvir i poslovni rezultat gdje postoji dozvola za objavu.

### 2. Vizuali su još uvijek prototipski

Case study i blog coveri su generički vizuali. Sajt izgleda uredno, ali ne daje dovoljan osjećaj stvarnog tima, ljudi, događaja i lokalne realizacije. Prioritet su originalne fotografije i screenshotovi.

### 3. Pravne stranice traže konačnu poslovnu potvrdu

Interni produkcijski komentari su uklonjeni. I dalje treba unijeti tačan naziv pravnog lica, adresu, osnov obrade, rokove čuvanja, primaoce podataka i kontakt nadležnog lica. Završnu verziju treba potvrditi sa lokalnim pravnikom.

### 4. GA4 može biti dupliran

Direktni GA4 kod i GTM su oba aktivna. Ako GTM već učitava isti GA4 property, može nastati dupli `page_view`. Obavezna je provjera kroz GTM Preview i GA4 DebugView.

### 5. Jobs forma ne može potvrditi odgovor servera

Slanje oglasa i prijava koristi `no-cors`, pa browser ne može pouzdano znati da li je endpoint stvarno prihvatio zahtjev. Potrebno je da Apps Script vrati CORS header i JSON status ili da se uvede posredni API endpoint.

## Sadržajni audit

### Ponuda

Ponuda je dobra, ali dio izraza je i dalje previše agencijski: growth, funnel, rollout, lead capture, creative testing, UGC i retargeting. Na glavnim prodajnim mjestima treba koristiti domaći izraz ili kratko objašnjenje.

### Cijene

Rasponi su korisni, ali treba uskladiti poruke:

- homepage mjesečna saradnja kreće od 600 €
- performance vođenje kreće od 400 €
- kontinuirana produkcija kreće od 700 €

To nije nužno kontradikcija, ali mora biti jasno šta je samostalna usluga, a šta kombinovani paket.

### Case studyji

Potrebno dodati:

- datum i trajanje projekta
- klijenta ili jasno označenu anonimnu industriju
- konkretan obim Sindikat rada
- fotografije ili screenshotove
- mjerljivi poslovni rezultat
- napomenu o izvoru brojke

### Blog

Utvrđeno stanje:

- svih 30 tekstova nema datum
- 17 meta opisa je duže od približno 165 karaktera
- tekst p10 ima samo oko 57 riječi i treba ga proširiti ili spojiti
- više grupa tekstova ciljaju skoro istu temu
- u p23 postoji miješana ćirilica i latinica u riječi `Jeftin`

Preporučena konsolidacija:

1. Meta kampanje - spojiti p01, p16, p18 i p20.
2. Event budžet i organizacija - spojiti p04, p06, p07, p08 i p11.
3. Aktivacije - spojiti ili jasnije razdvojiti p05, p09, p12, p13, p14 i p15.
4. Landing i CRO - spojiti p10, p19, p29 i p30.
5. Lokalni SEO - urediti p25, p26, p27 i p28 kao jedan glavni vodič i podržavajuće tekstove.

Ne brisati URL-ove prije provjere Google Search Console podataka. Za svaki spojeni tekst postaviti 301 redirect na glavni vodič.

## UX audit

### Optimizacije pripremljene u audit grani

- aktivna navigacija bira samo najprecizniju stavku
- mobilni meni dobija `aria-controls` i stvarni hidden state
- service i industry parametri čuvaju se uz lead formu
- cookie izbor može se ponovo otvoriti iz footera
- CTA `Pogledaj rezultate` promijenjen je u preciznije `Pogledaj projekte`
- izraz `Kontinuirani growth` zamijenjen je sa `Mjesečna saradnja`
- tehnički izraz `backend` uklonjen je sa kandidat stranice
- blog listing više ne mijenja title i opis preko runtime feeda bez odgovarajuće statičke stranice

### Preostalo

- modal za prijavu treba fokus trap i vraćanje fokusa na dugme
- `window.alert` poruke zamijeniti inline statusima
- kontakt polje treba razdvojiti na email i telefon
- dodati očekivano vrijeme odgovora
- dodati Viber ili telefon samo ako postoji zvaničan poslovni kontakt

## SEO audit

### Optimizacije pripremljene u audit grani

- jezik je preciziran kao `sr-Latn-ME`
- sitemap više ne označava sve stranice kao izmijenjene pri svakom buildu
- Organization schema dobija contact point i jezičke podatke
- Article schema dobija keywords, word count i datum kada postoji
- povezani blog tekstovi biraju se prema kategoriji i tagovima
- runtime blog sync je uklonjen da listing i statički SEO sadržaj ostanu usklađeni

### Preostalo

- unijeti stvarne datume objave ili revizije blog tekstova
- skratiti 17 predugih meta opisa
- dodati stvarne social share fotografije za glavne stranice
- povezati industrijske stranice sa relevantnim case studyjima
- dodati FAQ schema samo tamo gdje sadržaj stvarno odgovara vidljivom FAQ-u
- provjeriti Search Console nakon migracije i pratiti 404/redirect izvještaj

## Tehnički audit

### Optimizacije pripremljene u audit grani

- osnovna sanitizacija HTML-a blog tekstova prije `dangerouslySetInnerHTML`
- uklanjanje script, style, iframe, object, embed i form tagova iz importovanog sadržaja
- uklanjanje inline event handlera i `javascript:` URL-ova
- validator prijavljuje tekst bez datuma, predugačak meta opis, miješanu ćirilicu i rizične HTML tagove
- sitemap koristi stabilan datum izmjene umjesto trenutnog datuma svakog builda

### Preostalo

- testirati stvarno slanje svake forme
- provjeriti CORS i odgovor Apps Script endpointa
- uraditi Lighthouse mjerenje na produkcijskom domenu
- provjeriti da li GTM učitava dodatne marketinške tagove prije pristanka
- dodati spam zaštitu na serverskoj strani
- uvesti monitoring forme i obavještenje kada endpoint ne radi
- provjeriti mobilne animacije i blur efekte na slabijim telefonima

## Prioritetni naredni koraci

### P0 - prije jače promocije sajta

1. Potvrditi da kontakt forma stvarno upisuje i šalje lead.
2. Provjeriti GA4 duplikaciju.
3. Završiti pravne podatke firme.
4. Zamijeniti Gmail adresu domen emailom ako je dostupan.
5. Dodati 6-10 stvarnih fotografija tima, aktivacija i projekata.
6. Ispraviti miješanu ćirilicu u p23.

### P1 - prodaja i povjerenje

1. Dodati logotipe klijenata za koje postoji dozvola.
2. Dodati najmanje tri kratke izjave klijenata.
3. Napraviti jedan kvalitetan non-gambling performance case study.
4. U svaki case study dodati period, obim, ulogu i izvor metrike.
5. Dodati blok `Šta se dešava nakon upita` i vrijeme odgovora.
6. Jasno objasniti razliku između pojedinačne usluge i mjesečnog paketa.

### P2 - SEO i sadržaj

1. Pregledati Search Console prije spajanja tekstova.
2. Konsolidovati 30 tekstova u 10-15 jačih resursa.
3. Dodati datume, autora i datum revizije.
4. Svaki tekst povezati sa jednom uslugom, jednim case studyjem i jednim jasnim CTA-om.
5. Skratiti predugačke meta opise.
6. Dodati englesku verziju tek kada domaća verzija bude potpuno potvrđena.

### P3 - mjerenje i iteracije

1. Definisati glavne GA4 konverzije.
2. Napraviti dashboard za leadove po izvoru, usluzi i budžetu.
3. Mjeriti kvalitet leadova, ne samo broj slanja formi.
4. A/B testirati hero naslov i CTA tek nakon dovoljnog saobraćaja.
5. Kvartalno pregledati cijene, ponudu i case study podatke.

## Preporučeni redosljed rada

1. Spojiti i objaviti sigurne tehničke i UX optimizacije iz audit grane.
2. Testirati kontakt i jobs forme na produkciji.
3. Provjeriti GTM i GA4 u DebugView režimu.
4. Prikupiti stvarne fotografije, logotipe i izjave.
5. Doraditi case study sadržaj.
6. Završiti pravne podatke.
7. Tek zatim krenuti u blog konsolidaciju i jači SEO rad.
