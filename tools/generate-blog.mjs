import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ PROMIJENI OVO:
const SHEET_API_URL = process.env.SHEET_API_URL; // npr https://script.google.com/macros/s/XXXX/exec?sheet=Posts

// ✅ SITE BASE (za canonical)
const SITE_BASE = "https://sindikatstudio83.me";

// ✅ paths u repou
const OUT_DIR = path.join(__dirname, "..", "sr-me", "blog");
const TEMPLATE_PATH = path.join(OUT_DIR, "_templates", "post.template.html");
const POSTS_JSON_PATH = path.join(OUT_DIR, "posts.json");

function assert(cond, msg){
  if(!cond) { console.error(msg); process.exit(1); }
}

function escapeHtmlAttr(s){
  return String(s || "")
    .replaceAll("&","&amp;")
    .replaceAll('"',"&quot;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function safeStr(v){ return String(v ?? "").trim(); }

function normCategory(v){ return safeStr(v).toLowerCase(); }

function parseTags(v){
  if (Array.isArray(v)) return v.filter(Boolean).map(x=>safeStr(x));
  const s = safeStr(v);
  if(!s) return [];
  return s.split(",").map(x=>x.trim()).filter(Boolean);
}

function pickCover(p){
  return safeStr(p.cover_image || "");
}

function canonicalForSlug(slug){
  return `${SITE_BASE}/sr-me/blog/${encodeURIComponent(slug)}/`;
}

function listingCanonical(){
  return `${SITE_BASE}/sr-me/blog`;
}

function ensureDir(dir){
  fs.mkdirSync(dir, { recursive: true });
}

async function fetchJson(url){
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if(!res.ok) throw new Error(`Fetch failed ${res.status} ${res.statusText}`);
  return await res.json();
}

function writeFile(fp, content){
  ensureDir(path.dirname(fp));
  fs.writeFileSync(fp, content, "utf8");
}

function loadTemplate(){
  return fs.readFileSync(TEMPLATE_PATH, "utf8");
}

function renderTemplate(template, data){
  return template
    .replaceAll("{{title}}", escapeHtmlAttr(data.title))
    .replaceAll("{{description}}", escapeHtmlAttr(data.description))
    .replaceAll("{{canonical}}", escapeHtmlAttr(data.canonical))
    .replaceAll("{{og_image}}", escapeHtmlAttr(data.og_image))
    .replaceAll("{{cover_image}}", escapeHtmlAttr(data.cover_image))
    .replaceAll("{{cover_alt}}", escapeHtmlAttr(data.cover_alt))
    .replaceAll("{{date}}", escapeHtmlAttr(data.date))
    .replaceAll("{{category}}", escapeHtmlAttr(data.category))
    .replaceAll("{{slug}}", escapeHtmlAttr(data.slug))
    .replaceAll("{{tags_json}}", data.tags_json)
    .replaceAll("{{content_html}}", data.content_html);
}

function normalizePost(p){
  const slug = safeStr(p.slug);
  const title = safeStr(p.title);
  const excerpt = safeStr(p.excerpt || p.description || "");
  const description = excerpt || title;

  const status = safeStr(p.status).toLowerCase() || "draft";
  const category = normCategory(p.category);
  const date = safeStr(p.date); // recommended ISO
  const cover_image = pickCover(p);
  const cover_alt = safeStr(p.cover_alt || title);
  const tags = parseTags(p.tags);

  const og_image = safeStr(p.og_image || cover_image || "");
  const content_html = safeStr(p.content_html || p.content || "");

  return {
    slug, title, excerpt, description,
    status, category, date,
    cover_image, cover_alt,
    tags,
    og_image,
    content_html
  };
}

function toPostsJson(posts){
  // keep fields you need on listing + single
  return posts.map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    description: p.description,
    status: p.status,
    category: p.category,
    date: p.date,
    cover_image: p.cover_image,
    cover_alt: p.cover_alt,
    tags: p.tags,
    og_image: p.og_image
  }));
}

async function main(){
  assert(SHEET_API_URL, "Missing env SHEET_API_URL");

  ensureDir(OUT_DIR);
  assert(fs.existsSync(TEMPLATE_PATH), `Missing template: ${TEMPLATE_PATH}`);

  const api = await fetchJson(SHEET_API_URL);
  const rows = Array.isArray(api.posts) ? api.posts : [];
  const normalized = rows.map(normalizePost);

  const published = normalized
    .filter(p => p.slug && p.title && p.status === "published");

  // sort newest first
  published.sort((a,b)=> String(b.date||"").localeCompare(String(a.date||"")));

  // write posts.json (listing)
  const postsJson = toPostsJson(published);
  writeFile(POSTS_JSON_PATH, JSON.stringify(postsJson, null, 2));

  // write each post page
  const template = loadTemplate();
  for (const p of published){
    const outPath = path.join(OUT_DIR, p.slug, "index.html");
    const html = renderTemplate(template, {
      slug: p.slug,
      title: p.title,
      description: p.description,
      canonical: canonicalForSlug(p.slug),
      og_image: p.og_image || `${SITE_BASE}/sr-me/assets/og-cover.jpg`,
      cover_image: p.cover_image || `${SITE_BASE}/sr-me/assets/og-cover.jpg`,
      cover_alt: p.cover_alt || p.title,
      date: p.date,
      category: p.category,
      tags_json: JSON.stringify(p.tags || []),
      content_html: p.content_html
    });
    writeFile(outPath, html);
  }

  console.log(`Generated: ${postsJson.length} posts -> ${POSTS_JSON_PATH}`);
}

main().catch(err=>{
  console.error(err);
  process.exit(1);
});
