#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "Pages"
OUT = ROOT / "SEGMENT6_QA_EXPORT.md"

KEY_ROUTES = [
    ("/", PAGES / "index.html"),
    ("/sr-me/", PAGES / "sr-me/index.html"),
    ("/sr-me/pocetna/", PAGES / "sr-me/pocetna/index.html"),
    ("/sr-me/usluge/", PAGES / "sr-me/usluge/index.html"),
    ("/sr-me/blog/", PAGES / "sr-me/blog/index.html"),
    ("/sr-me/onama/", PAGES / "sr-me/onama/index.html"),
    ("/sr-me/kontakt/", PAGES / "sr-me/kontakt/index.html"),
    ("/sr-me/poslovi/", PAGES / "sr-me/poslovi/index.html"),
]


def has(pattern: str, text: str) -> bool:
    return re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL) is not None


def check_file(path: Path) -> dict[str, str]:
    txt = path.read_text(encoding="utf-8", errors="ignore") if path.exists() else ""
    status = {
        "exists": "PASS" if path.exists() else "FAIL",
        "title": "PASS" if has(r"<title>.*?</title>", txt) else "FAIL",
        "meta_description": "PASS" if has(r'name=["\']description["\']', txt) else "FAIL",
        "canonical": "PASS" if has(r'rel=["\']canonical["\']', txt) else "FAIL",
        "h1": "PASS" if has(r"<h1\b[^>]*>.*?</h1>", txt) else "FAIL",
    }
    return status


def main() -> None:
    lines = [
        "# Segment 6 — Final QA Export",
        "",
        "## Key route checks",
        "",
        "| Route | Exists | Title | Meta description | Canonical | H1 |",
        "|---|---|---|---|---|---|",
    ]

    for route, file in KEY_ROUTES:
        r = check_file(file)
        lines.append(f"| `{route}` | {r['exists']} | {r['title']} | {r['meta_description']} | {r['canonical']} | {r['h1']} |")

    lines += [
        "",
        "## Operational commands",
        "",
        "```bash",
        "python tools/check_seo_basics.py",
        "python tools/generate_sitemap.py",
        "python tools/export_seo_qa.py",
        "```",
        "",
        "## Notes",
        "- This report is generated from repository files (not live production crawl).",
        "- Use it as pre-merge QA evidence for SEO baseline and release readiness.",
    ]

    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Generated {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
