#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "Pages"

TITLE_RE = re.compile(r"<title>.*?</title>", re.IGNORECASE | re.DOTALL)
META_DESC_RE = re.compile(r'<meta[^>]+name=["\']description["\'][^>]*>', re.IGNORECASE)
CANONICAL_RE = re.compile(r'<link[^>]+rel=["\']canonical["\'][^>]*>', re.IGNORECASE)
H1_RE = re.compile(r"<h1\b[^>]*>.*?</h1>", re.IGNORECASE | re.DOTALL)
HREFLANG_RE = re.compile(r'hreflang=["\']([^"\']+)["\']', re.IGNORECASE)


def detect_languages() -> set[str]:
    langs = set()
    for child in PAGES.iterdir():
        if child.is_dir() and (child / "index.html").exists():
            langs.add(child.name.lower())
    return langs


def check_file(path: Path, expected_hreflangs: set[str]) -> list[str]:
    issues: list[str] = []
    text = path.read_text(encoding="utf-8", errors="ignore")

    if not TITLE_RE.search(text):
        issues.append("missing_title")
    if not META_DESC_RE.search(text):
        issues.append("missing_meta_description")
    if not CANONICAL_RE.search(text):
        issues.append("missing_canonical")
    if not H1_RE.search(text):
        issues.append("missing_h1")

    rel_parts = path.relative_to(PAGES).parts
    lang_in_path = rel_parts[0].lower() if rel_parts else ""
    hreflangs = {x.lower() for x in HREFLANG_RE.findall(text)}

    # Enforce hreflang only on key landing/navigation pages.
    rel_path = "/".join(rel_parts).lower()
    key_pages = {
        "sr-me/index.html",
        "sr-me/pocetna/index.html",
        "sr-me/usluge/index.html",
        "sr-me/blog/index.html",
        "sr-me/onama/index.html",
        "sr-me/kontakt/index.html",
        "sr-me/poslovi/index.html",
        "index.html",
    }
    if rel_path in key_pages and lang_in_path in expected_hreflangs and "noindex" not in text.lower():
        required = set(expected_hreflangs)
        required.add("x-default")
        if not required.issubset(hreflangs):
            issues.append("incomplete_hreflang")

    return issues


def main() -> None:
    expected_hreflangs = detect_languages()
    files = sorted(PAGES.rglob("*.html"))
    total = len(files)
    issue_rows: list[str] = []
    clean = 0

    for f in files:
        issues = check_file(f, expected_hreflangs)
        if issues:
            issue_rows.append(f"{f.relative_to(ROOT)}: {', '.join(issues)}")
        else:
            clean += 1

    print(f"Detected language directories: {', '.join(sorted(expected_hreflangs))}")
    print(f"HTML files checked: {total}")
    print(f"Files without issues: {clean}")
    print(f"Files with issues: {len(issue_rows)}")
    for row in issue_rows[:300]:
        print(row)


if __name__ == "__main__":
    main()
