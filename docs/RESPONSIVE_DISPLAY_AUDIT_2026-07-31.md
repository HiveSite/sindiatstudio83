# Responsive i display audit - 31. jul 2026.

## Obuhvat

Pregledani su zajednicki layout sistemi i komponente koje se koriste na svim javnim stranicama:

- header i mobilna navigacija
- pocetna stranica i hero sistem
- kartice usluga
- horizontalni rail Radovi i sistemi
- stranica Radovi i case preview kartice
- detaljne case study stranice i galerije
- industrije
- O nama
- kontakt forma
- otvorene prijave i modal
- blog lista, tekstovi, tabele i code blokovi
- FAQ, finalni CTA, footer i cookie banner

## Pronadjeni problemi

1. Kasniji `max-width:1040px` blok je na telefonu ponovo postavljao neke tablet vrijednosti.
2. Pet usluga je na sirinama od 320 do 760 px ostajalo u dvije kolone.
3. Hero vizual je na telefonu ostajao visok 500 px umjesto mobilne vrijednosti.
4. Pojedine kartice su dobijale desktop/tablet padding na manjoj sirini.
5. Dugi naslovi su koristili agresivni `overflow-wrap: break-word` i mogli su izgledati neprirodno.
6. Galerijske fotografije su koristile `object-fit: cover`, pa je dio kadra mogao biti odsjecen.
7. Gallery box je zavisio od minimalne visine umjesto stabilnog aspect-ratio prikaza.
8. Odd-card pravila su na uskom ekranu mogla dati posljednjoj kartici drugaciju visinu vizuala.
9. Forme i dugmad nijesu svuda imala zavrsnu zastitu od dugih vrijednosti i teksta.
10. Prethodni validator je provjeravao postojanje breakpointa, ali ne i finalni cascade koji browser stvarno primjenjuje.

## Ispravke

- dodat finalni cascade sloj koji eksplicitno definise vrijednosti na 1040, 900, 760, 620 i 420 px
- usluge prelaze u jednu kolonu na 760 px i manjim ekranima
- hero, logo, header i dekorativni elementi imaju kontrolisane mobilne dimenzije
- kartice koriste automatsku visinu i rastu prema sadrzaju
- horizontalni rail vise ne namece `height: 100%` karticama
- naslovi koriste `text-wrap: balance`, a pasusi `text-wrap: pretty`
- forme, CTA dugmad, linkovi i footer mogu bezbjedno prikazati dug tekst
- case galerije na tabletu i telefonu prelaze u jednu kolonu
- galerijske slike koriste `object-fit: contain`, tako da cijeli kadar ostaje vidljiv
- slike imaju stabilne aspect-ratio okvire prema tipu medija
- animacije i dark overlay ostaju aktivni iznad slika
- modal ima kontrolisano skrolovanje i sticky header na telefonu
- blog tabele, code blokovi i dugi linkovi ostaju unutar ekrana
- validator sada provjerava finalne mobilne override vrijednosti i postojanje svih data-referenciranih slika

## Provjerene sirine

Finalni CSS cascade je izracunat i provjeren za:

- 320 px
- 375 px
- 420 px
- 620 px
- 760 px
- 900 px
- 1040 px
- 1440 px

Na 760 px i manjim ekranima svi kriticni sadrzajni gridovi koji mogu imati duge naslove ili tekst prelaze u jednu kolonu.

## Namjerno zadrzano

- horizontalni skrol za Radovi i sistemi na pocetnoj
- placeholder/orbit animacije iznad stvarnih slika
- tamni overlay i oko 60% vidljivosti slika
- mobilni sticky CTA
- horizontalni skrol samo za filtere i siroke blog tabele
