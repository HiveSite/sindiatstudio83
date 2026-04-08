# Segment 5 — Sitemap i robots (status)

Status: ✅ Završeno

## Šta je urađeno
- `tools/generate_sitemap.py` je unaprijeđen da:
  - generiše `lastmod` po stvarnom mtime fajla,
  - koristi eksplicitna SEO pravila za `priority` i `changefreq` za ključne rute,
  - izbacuje noindex/template fajlove,
  - emituje validan XML sa deklaracijom i UTF-8 encoding-om.
- `Pages/sitemap.xml` je regenerisan iz stvarnog sadržaja sajta.
- `Pages/robots.txt` je očišćen i usklađen sa trenutnom arhitekturom.

## Pravila koja važe
- Jedini javni sitemap je `https://www.sindikatstudio83.me/sitemap.xml`.
- Template i pomoćne rute nijesu uključene u sitemap.
