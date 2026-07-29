# Responsive i tehnicka priprema

## Responsive zavrsetak

- Zavrseni breakpointi za 320, 375, 420, 620, 760, 900, 960, 1024 i velike desktop sirine.
- Uklonjeno horizontalno prelivanje kod hero sekcija, kartica, dugih naslova, filtera, tabela, code blokova i formi.
- Poboljsani mobilni i tablet rasporedi za stranice usluga, projekte, blog, forme, posao/prijavu, footer i CTA blokove.
- Dodati safe-area razmaci za mobilne uredjaje sa donjom sistemskom zonom.
- Form inputi imaju najmanje 16 px na telefonu, bez iOS automatskog zooma.
- Filteri se na malom ekranu kontrolisano horizontalno skroluju.
- Modal prijave radi kao mobilni bottom sheet i ostaje upotrebljiv na maloj visini ekrana.
- Tabele, iframe, video i pre/code sadrzaj ostaju unutar sirine stranice.

## Navigacija i pristupacnost

- Mobilni meni se aktivira i na tablet sirinama gdje desktop meni vise nije bezbjedan.
- Dodati Escape zatvaranje, fokus trap, automatski fokus, povratak fokusa i zatvaranje pri prelasku na desktop.
- Dodata pozadinska zona za zatvaranje menija.
- Dugmad i filteri imaju stabilne focus i aria veze.
- Telefonsko polje koristi ispravan mobilni tip tastature.

## Tehnicka zastita

- Build sada prije Next.js builda provjerava source, responsive pravila i integritet sajta.
- Novi integrity validator provjerava rute, interne linkove, redirect ciljeve, javne fajlove, sitemap, robots, manifest, tracking i kljucna CSP pravila.
- Uslovi koriscenja uskladjeni su sa uklanjanjem javnih nepotvrdjenih cijena.
- Datum izmjene sadrzaja i pravnih dokumenata postavljen je na 29. jul 2026.

## Namjerno nije radjeno u ovoj fazi

- stvarne fotografije i screenshotovi
- logotipi i izjave klijenata
- dodatne javne metrike bez potvrde
- finalno prosirivanje case study tekstova na osnovu materijala
