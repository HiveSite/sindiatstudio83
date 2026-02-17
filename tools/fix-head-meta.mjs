import fs from "fs";
import path from "path";

const BASE = "https://www.sindikatstudio83.me";
const ROOT = path.resolve("Pages");

// Tvoj postojeći logo fajl (pošto kažeš da je dostupan)
const DEFAULT_OG_IMAGE = `${BASE}/studio83logo.png`;

// Strane koje hoćemo da tretiramo kao “ključne” za sr-me
const LANG_FIX_PATHS = new Set([
  "/sr-me/usluge/",
  "/sr-me/poslovi/",
]);

function shouldSkipFile(fp) {
  const rel = path.relative(ROOT, fp).replace(/\\/g, "/");
  return rel.includes("<slug>") || rel.includes("_templates");
}

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

// Operiši samo nad <head>...</head>
function withHead(html, fn) {
  const m = html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i);
  if (!m) return fn(html);
  const head = m[0];
  const updated = fn(head);
  return html.replace(head, updated);
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

function normalizeToWwwAbsolute(u) {
  let url = (u || "").trim();
  if (!url) return "";
  if (url.startsWith("/")) url = `${BASE}${url}`;
  url = url.replace(/^https:\/\/sindikatstudio83\.me/i, BASE);
  url = url.replace(/^http:\/\/sindikatstudio83\.me/i, BASE);
  return url;
}

function fixOrAddOgImage(head) {
  // supports both attribute orders:
  // <meta property="og:image" content="...">
  // <meta content="..." property="og:image">
  const re1 = /<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i;
  const re2 = /<meta\b[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i;

  let existing = "";
  const m1 = head.match(re1);
  const m2 = head.match(re2);
  if (m1) existing = m1[1];
  else if (m2) existing = m2[1];

  const img = normalizeToWwwAbsolute(existing || DEFAULT_OG_IMAGE);
  const newTag = `<meta property="og:image" content="${img}" />`;

  if (m1) return head.replace(re1, newTag);
  if (m2) return head.replace(re2, newTag);

  // doesn't exist → insert
  return upsertTag(head, /<meta\s+property=["']og:image["'][^>]*>/i, newTag);
}

function fixHtmlLang(html, canonicalPath) {
  if (!LANG_FIX_PATHS.has(canonicalPath)) return html;
  // change <html lang="sr"> to sr-ME (only if sr)
  return html.replace(/<html([^>]*?)\slang=["']sr["']([^>]*?)>/i, `<html$1 lang="sr-ME"$2>`);
}

function normalizeDomainsInHead(head) {
  // normalize any leftover non-www canonical/og:url occurrences (HEAD only)
  return head
    .replaceAll("https://sindikatstudio83.me", BASE)
    .replaceAll("http://sindikatstudio83.me", BASE);
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
  let skipped = 0;

  for (const fp of files) {
    if (shouldSkipFile(fp)) {
      skipped += 1;
      continue;
    }

    let html = read(fp);

    const canonical = ensureSlash(toCanonicalFromFile(fp));
    const canonicalPath = new URL(canonical).pathname;

    // Fix lang on full HTML (html tag is outside head)
    html = fixHtmlLang(html, canonicalPath);

    // Operiši samo u HEAD-u
    html = withHead(html, (head) => {
      let h = head;

      h = normalizeDomainsInHead(h);

      h = upsertCanonical(h, canonical);
      h = upsertOgUrl(h, canonical);
      h = upsertTwitterCard(h);
      h = fixOrAddOgImage(h);

      return h;
    });

    write(fp, html);
    changed += 1;
  }

  console.log(`✅ Updated head meta in ${changed} index.html files`);
  if (skipped) console.log(`↩️ Skipped ${skipped} template index.html files (<slug>/_templates)`);
  console.log(`🖼️ Default og:image used (when missing): ${DEFAULT_OG_IMAGE}`);
}

main();
