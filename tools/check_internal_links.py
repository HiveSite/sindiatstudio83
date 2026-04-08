#!/usr/bin/env python3
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "Pages"


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs):
        if tag.lower() != "a":
            return
        for k, v in attrs:
            if k.lower() == "href" and v:
                self.links.append(v)


def is_internal(href: str) -> bool:
    if href.startswith(("mailto:", "tel:", "javascript:", "#")):
        return False
    parsed = urlparse(href)
    if parsed.scheme in {"http", "https"}:
        return parsed.netloc in {"www.sindikatstudio83.me", "sindikatstudio83.me", ""}
    return True


def to_path(href: str, source: Path) -> Path | None:
    parsed = urlparse(href)
    path = parsed.path

    if parsed.scheme in {"http", "https"} and parsed.netloc not in {"www.sindikatstudio83.me", "sindikatstudio83.me", ""}:
        return None

    if not path:
        return None

    if path.startswith("/"):
        target = PAGES / path.lstrip("/")
    else:
        target = (source.parent / path).resolve()

    if target.suffix == ".html":
        return target

    if target.is_dir() or str(path).endswith("/"):
        return target / "index.html"

    return target / "index.html"


def main() -> None:
    html_files = sorted(PAGES.rglob("*.html"))
    broken: list[tuple[str, str]] = []
    checked = 0

    for file in html_files:
        parser = LinkParser()
        parser.feed(file.read_text(encoding="utf-8", errors="ignore"))
        for href in parser.links:
            if not is_internal(href):
                continue
            target = to_path(href, file)
            if target is None:
                continue
            checked += 1
            if not target.exists():
                broken.append((str(file.relative_to(ROOT)), href))

    print(f"HTML files scanned: {len(html_files)}")
    print(f"Internal links checked: {checked}")
    print(f"Broken links: {len(broken)}")
    for src, href in broken[:300]:
        print(f"{src}: {href}")


if __name__ == "__main__":
    main()
