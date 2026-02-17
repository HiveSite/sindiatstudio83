import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG ---
const DEFAULT_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzn8mswJ8woL7oGgUyaS79kxS8UR5tFHjY0t4hNA2KptQxtz_-eaBiYrGCJ60wSY4-V/exec";

let SHEET_API_URL = process.env.SHEET_API_URL || DEFAULT_SHEET_URL;

// canonical base
const SITE_BASE = "https://sindikatstudio83.me";

// output paths
const OUT_DIR = path.join(__dirname, "..", "Pages", "sr-me", "blog");
const TEMPLATE_PATH = path.join(OUT_DIR, "_templates", "post.template.html");
const POSTS_JSON_PATH = path.join(OUT_DIR, "posts.json");

// expected column order if API returns arrays (or TSV/CSV without headers)
const COLUMN_ORDER = [
  "slug",
  "status",
  "category",
  "category_label", // optional
  "title",
  "excerpt",
  "tags",
  "cover_image",
  "cover_alt",
  "og_image",
  "og_alt", // optional
  "content_html",
];

function assert(cond, msg) {
  if (!cond) {
    console.error(msg);
    process.exit(1);
  }
}

function safeStr(v) {
  return String(v ?? "").trim();
}

function escapeHtmlAttr(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(fp, content) {
  ensureDir(path.dirname(fp));
  fs.writeFileSync(fp, content, "utf8");
}

function ensureSheetParam(url, sheetName = "Posts") {
  const u = new URL(url);
  if (!u.searchParams.get("sheet")) u.searchParams.set("sheet", sheetName);
  return u.toString();
}

function slugify(input) {
  const s = safeStr(input)
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s;
}

function normCategory(v) {
  return safeStr(v).toLowerCase();
}

function parseTags(v) {
  if (Array.isArray(v)) return v.filter(Boolean).map((x) => safeStr(x));
  const s = safeStr(v);
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function normalizeStatus(v) {
  const s = safeStr(v).toLowerCase();
  if (!s) return "draft";
  if (["published", "publish", "live", "public"].includes(s)) return "published";
  return s;
}

function canonicalForSlug(slug) {
  return `${SITE_BASE}/sr-me/blog/${encodeURIComponent(slug)}/`;
}

async function fetchJson(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json,text/plain,*/*" },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Fetch failed ${res.status} ${res.statusText}`);

    const ct = (res.headers.get("content-type") || "").toLowerCase();

    // Sometimes Apps Script returns text/plain
    if (ct.includes("application/json")) return await res.json();
    const txt = await res.text();

    // try parse JSON from text
    try {
      return JSON.parse(txt);
    } catch {
      return txt; // fallback to raw string (TSV/CSV)
    }
  } finally {
    clearTimeout(t);
  }
}

function extractRows(api) {
  // supports many shapes
  if (Array.isArray(api)) return api;
  if (api && Array.isArray(api.posts)) return api.posts;
  if (api && Array.isArray(api.data)) return api.data;
  if (api && Array.isArray(api.rows)) return api.rows;
  return [];
}

function tsvToRows(txt) {
  const s = safeStr(txt);
  if (!s) return [];
  const lines = s.split(/\r?\n/).filter((l) => l.trim().length);
  if (!lines.length) return [];

  // if first line has tabs, treat as TSV; if commas, treat as CSV
  const sep = lines[0].includes("\t") ? "\t" : (lines[0].includes(",") ? "," : "\t");
  const rows = lines.map((l) => l.split(sep).map((x) => safeStr(x)));
  return rows;
}

function arrayRowToObject(arr) {
  const obj = {};
  for (let i = 0; i < COLUMN_ORDER.length; i++) {
    obj[COLUMN_ORDER[i]] = arr[i] ?? "";
  }
  return obj;
}

function normalizePost(raw) {
  // raw can be object OR array
  const p = Array.isArray(raw) ? arrayRowToObject(raw) : (raw || {});

  const slug = slugify(p.slug);
  const title = safeStr(p.title);
  const excerpt = safeStr(p.excerpt || p.description || "");
  const description = excerpt || title;

  const status = normalizeStatus(p.status);
  const category = normCategory(p.category);
  const date = safeStr(p.date); // optional
  const cover_image = safeStr(p.cover_image || "");
  const cover_alt = safeStr(p.cover_alt || title);
  const tags = parseTags(p.tags);

  const og_image = safeStr(p.og_image || cover_image || "");
  const content_html = safeStr(p.content_html || p.content || "");

  return {
    slug,
    title,
    excerpt,
    description,
    status,
    category,
    date,
    cover_image,
    cover_alt,
    tags,
    og_image,
    content_html,
  };
}

function toPostsJson(posts) {
  return posts.map((p) => ({
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
    og_image: p.og_image,
  }));
}

function loadTemplateOrFallback() {
  if (fs.existsSync(TEMPLATE_PATH)) {
    return fs.readFileSync(TEMPLATE_PATH, "utf8");
  }

  // hard fallback so you don't get empty files
  return `<!doctype html>
<html lang="sr-ME">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>{{title}}</title>
<meta name="description" content="{{description}}" />
<link rel="canonical" href="{{canonical}}" />
<meta property="og:title" content="{{title}}" />
<meta property="og:description" content="{{description}}" />
<meta property="og:image" content="{{og_image}}" />
</head>
<body>
<article>
  <h1>{{title}}</h1>
  <div>{{content_html}}</div>
</article>
</body>
</html>`;
}

function renderTemplate(template, data) {
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

async function main() {
  // ensure ?sheet=Posts exists
  SHEET_API_URL = ensureSheetParam(SHEET_API_URL, "Posts");

  ensureDir(OUT_DIR);

  console.log("SHEET_API_URL:", SHEET_API_URL);
  console.log("OUT_DIR:", OUT_DIR);
  console.log("TEMPLATE_PATH exists:", fs.existsSync(TEMPLATE_PATH));

  const api = await fetchJson(SHEET_API_URL);

  let rows = extractRows(api);

  // if not rows and api is string => parse TSV/CSV
  if (!rows.length && typeof api === "string") {
    rows = tsvToRows(api);
  }

  console.log("API type:", typeof api);
  if (api && typeof api === "object" && !Array.isArray(api)) {
    console.log("API keys:", Object.keys(api));
  }
  console.log("Rows length:", rows.length);
  console.log("First row preview:", rows[0]);

  const normalized = rows.map(normalizePost);

  const published = normalized.filter(
    (p) => p.slug && p.title && p.status === "published"
  );

  console.log("Published length:", published.length);

  // sort newest first (if date exists)
  published.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  // write posts.json (listing)
  const postsJson = toPostsJson(published);
  writeFile(POSTS_JSON_PATH, JSON.stringify(postsJson, null, 2));

  // write each post page
  const template = loadTemplateOrFallback();
  for (const p of published) {
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
      content_html: p.content_html,
    });
    writeFile(outPath, html);
  }

  console.log(`Generated: ${postsJson.length} posts -> ${POSTS_JSON_PATH}`);
}

main().catch((err) => {
  console.error(err?.stack || err);
  process.exit(1);
});
