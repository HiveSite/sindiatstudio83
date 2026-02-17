import fs from "fs";
import path from "path";

const SITE_BASE = "https://www.sindikatstudio83.me";

// gdje ti je sajt u repo-u
const PAGES_DIR = path.resolve("Pages");
const SR_DIR = path.join(PAGES_DIR, "sr-me");

// šta preskačemo
const SKIP_FILES = new Set(["404.html"]);
const SKIP_NAMES = new Set(["index"]); // index.html ne pretvaramo u /index/

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeRead(fp) {
  return fs.readFileSync(fp, "utf8");
}

function safeWrite(fp, content) {
  ensureDir(path.dirname(fp));
  fs.writeFileSync(fp, content, "utf8");
}

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    // latinize basic (optional)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function relFromSr(absPath) {
  return path.relative(SR_DIR, absPath).replace(/\\/g, "/");
}

function cleanUrlForSrHtml(relHtml) {
  // relHtml example: "Usluge.html" or "folder/StaGod.html"
  const dir = path.posix.dirname(relHtml);
  const base = path.posix.basename(relHtml, ".html");
  const slug = slugify(base);

  // /sr-me/<slug>/
  const parts = [];
  if (dir && dir !== ".") parts.push(dir);
  parts.push(slug);

  return `/sr-me/${parts.join("/")}/`;
}

function canonicalTag(canonicalUrl) {
  return `<link rel="canonical" href="${canonicalUrl}" />`;
}

function upsertCanonical(html, canonicalUrl) {
  const tag = canonicalTag(canonicalUrl);

  // replace existing canonical
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, tag);
  }

  // insert before </head>
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
  }

  // fallback: prepend
  return `${tag}\n${html}`;
}

function buildMapping() {
  // map: "Usluge.html" => "/sr-me/usluge/"
  // only for root sr-me/*.html files (not blog)
  const mapping = new Map();

  const entries = fs.readdirSync(SR_DIR, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!e.name.toLowerCase().endsWith(".html")) continue;
    if (SKIP_FILES.has(e.name)) continue;

    const nameNoExt = e.name.slice(0, -5);
    if (SKIP_NAMES.has(nameNoExt.toLowerCase())) continue;

    const rel = e.name; // e.g. Usluge.html
    const clean = cleanUrlForSrHtml(rel);
    mapping.set(rel, clean);
  }

  // add explicit common ones (in case of case differences)
  // You can extend this if needed.

  return mapping;
}

function replaceInternalLinks(html, mapping) {
  // Replace href/src occurrences for known local html files
  // Handles:
  //  href="Usluge.html"
  //  href="/sr-me/Usluge.html"
  //  href="./Usluge.html"
  //  href="../sr-me/Usluge.html" (keeps simple patterns)
  let out = html;

  for (const [fileName, cleanPath] of mapping.entries()) {
    // 1) absolute /sr-me/Usluge.html
    out = out.replaceAll(`/sr-me/${fileName}`, cleanPath);

    // 2) relative "Usluge.html" or "./Usluge.html"
    out = out.replaceAll(`"${fileName}"`, `"${cleanPath}"`);
    out = out.replaceAll(`'${fileName}'`, `'${cleanPath}'`);
    out = out.replaceAll(`"./${fileName}"`, `"${cleanPath}"`);
    out = out.replaceAll(`'./${fileName}'`, `'${cleanPath}'`);
  }

  return out;
}

function listSrRootHtmlFiles() {
  const files = fs
    .readdirSync(SR_DIR, { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((n) => n.toLowerCase().endsWith(".html"))
    .filter((n) => !SKIP_FILES.has(n));

  return files.map((n) => path.join(SR_DIR, n));
}

function main() {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`ERROR: Pages folder not found: ${PAGES_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(SR_DIR)) {
    console.error(`ERROR: sr-me folder not found: ${SR_DIR}`);
    process.exit(1);
  }

  const mapping = buildMapping();
  console.log("Clean URL mapping:");
  for (const [k, v] of mapping.entries()) console.log(`  ${k} -> ${v}`);

  const htmlFiles = listSrRootHtmlFiles();

  let created = 0;
  for (const abs of htmlFiles) {
    const rel = relFromSr(abs); // e.g. "Usluge.html"
    const baseName = path.posix.basename(rel);

    if (SKIP_FILES.has(baseName)) continue;

    const nameNoExt = baseName.slice(0, -5);
    if (SKIP_NAMES.has(nameNoExt.toLowerCase())) continue;

    const cleanPath = cleanUrlForSrHtml(rel); // /sr-me/usluge/
    const canonicalUrl = `${SITE_BASE}${cleanPath}`;

    let html = safeRead(abs);

    // update links inside the page (so navbar becomes clean)
    html = replaceInternalLinks(html, mapping);

    // upsert canonical
    html = upsertCanonical(html, canonicalUrl);

    // write to clean folder
    const outDir = path.join(PAGES_DIR, cleanPath.replace(/^\/+/, "")); // remove leading /
    const outFile = path.join(outDir, "index.html");
    safeWrite(outFile, html);

    created += 1;
  }

  console.log(`✅ Created/updated clean pages: ${created}`);

  // Also update existing sr-me root html files to point to clean links (optional but recommended)
  // (This does NOT change their canonical unless you want it; it just updates navbar links.)
  let updatedRoot = 0;
  for (const abs of htmlFiles) {
    const baseName = path.posix.basename(relFromSr(abs));
    if (SKIP_FILES.has(baseName)) continue;

    let html = safeRead(abs);
    const newHtml = replaceInternalLinks(html, mapping);
    if (newHtml !== html) {
      safeWrite(abs, newHtml);
      updatedRoot += 1;
    }
  }
  console.log(`✅ Updated internal links in sr-me root html files: ${updatedRoot}`);

  console.log("DONE.");
}

main();
