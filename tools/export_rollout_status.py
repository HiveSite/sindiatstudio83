#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "Pages"
OUT = ROOT / "SEGMENT_E_FINAL_QA.md"

LANGS = ["sr-me", "en", "zh-cn", "tr", "ru"]


def count_html(path: Path) -> int:
    if not path.exists():
        return 0
    return len(list(path.rglob("*.html")))


def count_blog_posts(path: Path) -> int:
    blog = path / "blog"
    if not blog.exists():
        return 0
    count = 0
    for p in blog.iterdir():
        if p.is_dir() and re.fullmatch(r"p\d+", p.name):
            if (p / "index.html").exists():
                count += 1
    return count


def main() -> None:
    lines = [
        "# Segment E — Final QA Snapshot",
        "",
        "## Coverage by language",
        "",
        "| Language | HTML files | Blog posts |",
        "|---|---:|---:|",
    ]

    for lang in LANGS:
        lang_dir = PAGES / lang
        lines.append(f"| `{lang}` | {count_html(lang_dir)} | {count_blog_posts(lang_dir)} |")

    sitemap = (PAGES / "sitemap.xml").read_text(encoding="utf-8", errors="ignore")
    url_count = len(re.findall(r"<url>", sitemap))
    lines.extend([
        "",
        "## Global",
        "",
        f"- Sitemap URL count: **{url_count}**",
        "- SEO basic checks: run `python tools/check_seo_basics.py`",
        "- Internal links checks: run `python tools/check_internal_links.py`",
        "- Sitemap regeneration: run `python tools/generate_sitemap.py`",
    ])

    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
