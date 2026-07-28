# Plan zamjene placeholdera fotografijama

Slike se kasnije pripremaju kao WebP, maksimalne sirine 1600 px.
Preporucena tezina:
- glavna slika: 150-250 KB
- ostale fotografije: 100-180 KB
- screenshot sa sitnim tekstom: PNG ili WebP visokog kvaliteta

## Predlozena struktura

public/images/cases/
├── imaposla/
│   ├── naslovna-desktop.webp
│   ├── oglasi-detalj.webp
│   ├── radnici-brzi-poslovi.webp
│   └── mobilni-prikaz.webp
├── battlebots/
│   ├── finalna-arena.webp
│   ├── radionica.webp
│   ├── izrada-robota.webp
│   ├── timovi.webp
│   └── finalisti-partneri.webp
├── mini-sajtovi/
│   ├── zajednicki-prikaz.webp
│   ├── miqelly-desktop.webp
│   ├── miqelly-mobile.webp
│   ├── stan-na-dan-desktop.webp
│   ├── stan-na-dan-mobile.webp
│   ├── mape-desktop.webp
│   └── mape-mobile.webp
├── promo-timovi/
│   ├── tim.webp
│   ├── briefing.webp
│   ├── realizacija.webp
│   └── logistika.webp
├── regulisane-aktivacije/
│   ├── postavka.webp
│   ├── tim.webp
│   ├── realizacija.webp
│   └── detalj.webp
└── dogadjaji/
    ├── postavka.webp
    ├── program-tehnika.webp
    ├── atmosfera.webp
    └── backstage.webp

Ukupno pripremljenih mjesta: 28.

Trenutni placeholderi su CSS elementi i ne ucitavaju dodatne slike, pa ne usporavaju sajt.
Kada se fotografije dodaju, komponenta case-media.tsx se dopunjava image putanjom.
