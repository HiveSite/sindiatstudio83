import fs from "fs";
import path from "path";

const BASE = "https://www.sindikatstudio83.me";
const ROOT = path.resolve("Pages");

// Strane koje hoćemo da tretiramo kao “ključne” za sr-me
const LANG_FIX_PATHS = new Set([
  "/sr-me/usluge/",
  "/sr-me/poslovi/",
]);

function ensureSlash(u) {
  // ensure trailing slash on path URLs (ignore if ends with .xml/.png/.jpg etc.)
  try {
    const url = new URL(u);
    const p = url.pathname;
    if (!p.endsWith("/") && !p.includes(".")) url.pathname = p + "/";
    return url.toString();
  } catch {
    return u;
  }
}

function toCanonicalFromFile(fp) {
  // convert Pages/.../index.html -> https://www.../.../
  const rel = path.relative(ROOT, fp).replace(/\\/g, "/");
  if (rel.toLowerCase() === "index.html") return `${BASE}/`;
  if (rel.toLowerCase().endsWith("/index.html")) {
    const p = rel.slice(0, -"/index.html".length) + "/";
    return `${BASE}/${p}`.replace(/\/{2,}/g, "/").replace("https:/", "https://");
  }
  return `${BASE}/${rel}`;
}

function read(fp) {
  return fs.readFileSync(fp, "utf8");
}

function write(fp, content) {
  fs.writeFileSync(fp, content, "utf8");
}

function upsertTag(html, regex, newTag) {
  if (regex.test(html)) return html.replace(regex, newTag);
  // insert before </head>
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `  ${newTag}\n</head>`);
  return `${newTag}\n${html}`;
}

function upsertCanonical(html, canonical) {
  const tag = `<link rel="canonical" href="${canonical}" />`;
  return upsertTag(html, /<link\s+rel=["']canonical["'][^>]*>/i, tag);
}

function upsertOgUrl(html, canonical) {
  const tag = `<meta property="og:url" content="${canonical}" />`;
  return upsertTag(html, /<meta\s+property=["']og:url["'][^>]*>/i, tag);
}

function upsertTwitterCard(html) {
  const tag = `<meta name="twitter:card" content="summary_large_image" />`;
  return upsertTag(html, /<meta\s+name=["']twitter:card["'][^>]*>/i, tag);
}

function fixOgImage(html) {
  // If og:image exists and is non-www or relative, normalize to www absolute.
  const m = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["'][^>]*>/i);
  if (!m) return html;

  let img = m[1].trim();
  if (img.startsWith("/")) img = `${BASE}${img}`;
  if (img.startsWith("https://sindikatstudio83.me")) img = img.replace("https://sindikatstudio83.me", BASE);
  if (img.startsWith("http://sindikatstudio83.me")) img = img.replace("http://sindikatstudio83.me", BASE);

  const newTag = `<meta property="og:image" content="${img}" />`;
  return html.replace(/<meta\s+property=["']og:image["']\s+content=["'][^"']+["'][^>]*>/i, newTag);
}

function fixHtmlLang(html, canonicalPath) {
  if (!LANG_FIX_PATHS.has(canonicalPath)) return html;
  // change <html lang="sr"> to sr-ME (only if sr)
  return html.replace(/<html([^>]*?)\slang=["']sr["']([^>]*?)>/i, `<html$1 lang="sr-ME"$2>`);
}

function listIndexHtml(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listIndexHtml(full));
    else if (e.isFile() && e.name.toLowerCase() === "index.html") out.push(full);
  }
  return out;
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error("Pages folder not found:", ROOT);
    process.exit(1);
  }

  const files = listIndexHtml(ROOT);

  let changed = 0;
  for (const fp of files) {
    let html = read(fp);

    const canonical = ensureSlash(toCanonicalFromFile(fp));
    const canonicalPath = new URL(canonical).pathname;

    html = upsertCanonical(html, canonical);
    html = upsertOgUrl(html, canonical);
    html = upsertTwitterCard(html);
    html = fixOgImage(html);
    html = fixHtmlLang(html, canonicalPath);

    // also normalize any leftover non-www canonical/og:url occurrences
    html = html.replaceAll("https://sindikatstudio83.me", BASE).replaceAll("http://sindikatstudio83.me", BASE);

    write(fp, html);
    changed += 1;
  }

  console.log(`✅ Updated head meta in ${changed} index.html files`);
}

main();
