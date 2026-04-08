#!/usr/bin/env python3
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import re
from xml.dom import minidom
from xml.etree.ElementTree import Element, SubElement, tostring

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "Pages"
BASE_URL = "https://www.sindikatstudio83.me"

EXCLUDE_PARTS = {"<slug>", "_templates", "assets"}


def to_url(path: Path) -> str:
    rel = path.relative_to(PAGES).as_posix()
    if rel == "index.html":
        return BASE_URL + "/"
    if rel.endswith("/index.html"):
        rel = rel[:-10]
    rel = "/" + rel.lstrip("/")
    rel = re.sub(r"/+", "/", rel)
    if not rel.endswith(".html") and not rel.endswith("/"):
        rel += "/"
    return f"{BASE_URL}{rel}"


def priority_for(url: str) -> str:
    explicit = {
        f"{BASE_URL}/": "1.0",
        f"{BASE_URL}/sr-me/": "0.9",
        f"{BASE_URL}/sr-me/pocetna/": "0.9",
        f"{BASE_URL}/sr-me/usluge/": "0.9",
        f"{BASE_URL}/sr-me/blog/": "0.9",
        f"{BASE_URL}/sr-me/onama/": "0.8",
        f"{BASE_URL}/sr-me/kontakt/": "0.8",
        f"{BASE_URL}/sr-me/poslovi/": "0.8",
    }
    if url in explicit:
        return explicit[url]
    if "/blog/p" in url:
        return "0.7"
    if "/usluge/" in url:
        return "0.8"
    if "/onama/cn.html" in url:
        return "0.5"
    return "0.8"


def changefreq_for(url: str) -> str:
    if "/blog/p" in url:
        return "monthly"
    if "/blog/" in url:
        return "daily"
    if "/onama/cn.html" in url:
        return "yearly"
    if url in {f"{BASE_URL}/", f"{BASE_URL}/sr-me/", f"{BASE_URL}/sr-me/pocetna/", f"{BASE_URL}/sr-me/usluge/", f"{BASE_URL}/sr-me/poslovi/"}:
        return "weekly"
    return "monthly"


def should_include(file: Path) -> bool:
    parts = set(file.parts)
    if EXCLUDE_PARTS & parts:
        return False
    text = file.read_text(encoding="utf-8", errors="ignore").lower()
    if 'name="robots" content="noindex' in text:
        return False
    return True


def iso_lastmod(file: Path) -> str:
    ts = file.stat().st_mtime
    return datetime.fromtimestamp(ts, tz=timezone.utc).date().isoformat()


def main() -> None:
    html_files = sorted(p for p in PAGES.rglob("*.html") if should_include(p))
    urlset = Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    for file in html_files:
        url = to_url(file)
        u = SubElement(urlset, "url")
        SubElement(u, "loc").text = url
        SubElement(u, "lastmod").text = iso_lastmod(file)
        SubElement(u, "changefreq").text = changefreq_for(url)
        SubElement(u, "priority").text = priority_for(url)

    rough = tostring(urlset, encoding="utf-8")
    pretty = minidom.parseString(rough).toprettyxml(indent="  ", encoding="utf-8").decode("utf-8")
    pretty = "\n".join(line for line in pretty.splitlines() if line.strip()) + "\n"

    out = PAGES / "sitemap.xml"
    out.write_text(pretty, encoding="utf-8")
    print(f"Generated {out.relative_to(ROOT)} with {len(html_files)} URLs")


if __name__ == "__main__":
    main()
