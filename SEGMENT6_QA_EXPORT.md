# Segment 6 — Final QA Export

## Key route checks

| Route | Exists | Title | Meta description | Canonical | H1 |
|---|---|---|---|---|---|
| `/` | PASS | PASS | PASS | PASS | PASS |
| `/sr-me/` | PASS | PASS | PASS | PASS | PASS |
| `/sr-me/pocetna/` | PASS | PASS | PASS | PASS | PASS |
| `/sr-me/usluge/` | PASS | PASS | PASS | PASS | PASS |
| `/sr-me/blog/` | PASS | PASS | PASS | PASS | PASS |
| `/sr-me/onama/` | PASS | PASS | PASS | PASS | PASS |
| `/sr-me/kontakt/` | PASS | PASS | PASS | PASS | PASS |
| `/sr-me/poslovi/` | PASS | PASS | PASS | PASS | PASS |

## Operational commands

```bash
python tools/check_seo_basics.py
python tools/generate_sitemap.py
python tools/export_seo_qa.py
```

## Notes
- This report is generated from repository files (not live production crawl).
- Use it as pre-merge QA evidence for SEO baseline and release readiness.
