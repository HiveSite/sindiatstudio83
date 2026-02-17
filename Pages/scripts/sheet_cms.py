import os, csv, json, urllib.request
from pathlib import Path

SHEET_CSV_URL = os.getenv("SHEET_CSV_URL", "").strip()
if not SHEET_CSV_URL:
    raise SystemExit("Missing SHEET_CSV_URL")

SITE_BASE = os.getenv("SITE_BASE", "https://sindikatstudio83.me").rstrip("/")
OUT_DIR = Path("sr-me") / "blog"
TEMPLATE_PATH = Path("templates") / "blog-post-template.html"

def fetch_csv(url: str):
    with urllib.request.urlopen(url) as r:
        raw = r.read().decode("utf-8", errors="replace")
    return list(csv.DictReader(raw.splitlines()))

def esc(s: str) -> str:
    return (s or "").replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace('"',"&quot;")

def parse_tags(raw: str):
    raw = (raw or "").strip()
    if not raw:
        return []
    return [p.strip() for p in raw.split(",") if p.strip()]

rows = fetch_csv(SHEET_CSV_URL)

template = TEMPLATE_PATH.read_text(encoding="utf-8")

posts = []
for row in rows:
    status = (row.get("status") or "").strip().lower()
    if status != "published":
        continue

    post_id = (row.get("id") or "").strip()
    if not post_id:
        continue

    category = (row.get("category") or "").strip().lower() or "blog"
    badge = (row.get("badge") or "").strip() or category.title()

    title = (row.get("title") or "").strip() or post_id
    excerpt = (row.get("excerpt") or "").strip() or "Blog — Sindikat Studio 83"
    tags = parse_tags(row.get("tags") or "")

    img = (row.get("img") or "").strip() or f"{SITE_BASE}/sr-me/assets/og-cover.jpg"
    alt = (row.get("alt") or "").strip() or title

    popup_img = (row.get("popupImg") or "").strip() or img
    popup_alt = (row.get("popupAlt") or "").strip() or alt

    body_html = (row.get("body") or "").strip() or "<p>(Sadržaj uskoro.)</p>"

    url_rel = f"/sr-me/blog/{post_id}/"
    url_abs = f"{SITE_BASE}{url_rel}"

    html = template
    html = html.replace("{{TITLE}}", esc(title))
    html = html.replace("{{H1}}", esc(title))
    html = html.replace("{{DESCRIPTION}}", esc(excerpt))
    html = html.replace("{{CANONICAL}}", esc(url_abs))
    html = html.replace("{{OG_IMAGE}}", esc(popup_img))
    html = html.replace("{{HERO_IMAGE}}", esc(popup_img))
    html = html.replace("{{HERO_ALT}}", esc(popup_alt))
    html = html.replace("{{BADGE}}", esc(badge))
    html = html.replace("{{POST_ID}}", esc(post_id))
    html = html.replace("{{CONTENT}}", body_html)

    # tags chips (max 3)
    chips = "\n".join([f'<span class="chip">{esc(t)}</span>' for t in tags[:3]])
    html = html.replace("{{TAGS_CHIPS}}", chips)

    out_path = OUT_DIR / post_id / "index.html"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, encoding="utf-8")

    posts.append({
        "id": post_id,
        "category": category,
        "badge": badge,
        "title": title,
        "excerpt": excerpt,
        "tags": tags,
        "img": img,
        "alt": alt,
        "popupImg": popup_img,
        "popupAlt": popup_alt,
        "url": url_rel
    })

# snimi posts.json (listing će ovo čitati)
OUT_DIR.mkdir(parents=True, exist_ok=True)
(OUT_DIR / "posts.json").write_text(json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Generated: {len(posts)} posts")
