# Segment 4 — Tehnički SEO (status)

Status: ✅ Završeno (SEO baseline validacija)

## Šta je urađeno
- Dodat alat `tools/check_seo_basics.py` za automatski pregled osnovnih SEO elemenata po HTML fajlu:
  - `<title>`
  - `meta description`
  - `canonical`
  - `h1`
  - `hreflang` komplet (za lokalizovane stranice bez `noindex`)
- Pokrenuta validacija i generisan izvještaj `SEGMENT4_SEO_REPORT.txt`.

## Pokretanje
```bash
python tools/check_seo_basics.py
```

## Namjena
Ovaj check služi kao ponovljiv tehnički SEO gate prije završnog QA i merge procesa.
