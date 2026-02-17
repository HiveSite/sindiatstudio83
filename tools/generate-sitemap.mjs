import fs from "fs";
import path from "path";

const BASE_URL = "https://www.sindikatstudio83.me";
const ROOT_DIR = path.resolve("Pages");
const OUT_FILE = path.join(ROOT_DIR, "sitemap.xml");

// Fajlovi koje preskačemo
const SKIP_FILES = new Set([
  "404.html",
]);

// Folderi koje preskačemo
const SKIP_DIRS = new Set([
  ".git",
  ".github",
  "node_modules",
  "tools",
  "_templates",
]);

function isSkippableDir(dirName) {
  return SKIP_DIRS.has(dirName);
}

// Pravila za izbacivanje URL-ova koje ne želimo u sitemap
function shouldSkipUrl(url) {
  // 1) izbaci template placeholder za blog
  if (url.includes("/sr-me/blog/%3Cslug%3E/")) return true;
  if (url.includes("/sr-me/blog/<slug>/")) return true;

  // 2) izbaci sve legacy .html stranice u sr-me rootu (redirect stubovi)
  //    Primjeri: /sr-me/Pocetna.html, /sr-me/Usluge.html, /sr-me/Poslovi.html ...
  if (/\/sr-me\/[^\/]+\.html$/i.test(url)) return true;

  // 3) izbaci bilo šta što je “internal”
  if (url.includes("/_templates/")) return true;

  return false;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const e of entries) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      if (!isSkippableDir(e.name)) {
        files = files.concat(walk(full));
      }
      continue;
    }

    if (!e.isFile()) continue;
    if (!e.name.toLowerCase().endsWith(".html")) continue;
    if (SKIP_FILES.has(e.name)) continue;

    files.push(full);
  }

  return files;
}

function fileToUrl(filePath) {
  // relative path from Pages/
  let rel = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");

  // index.html -> folder url
  if (rel.toLowerCase().endsWith("/index.html")) {
    rel = rel.slice(0, -"/index.html".length) + "/";
  } else if (rel.toLowerCase() === "index.html") {
    rel = ""; // root
  } else {
    // svi ostali *.html ostaju kao *.html URL
    // ali mi ćemo ih kasnije filtrirati shouldSkipUrl()
  }

  // Normalizuj: ukloni duple slasheve
  const urlPath = ("/" + rel).replace(/\/{2,}/g, "/");

  return BASE_URL + urlPath;
}

function isoDateFromMtime(filePath) {
  const st = fs.statSync(filePath);
  return st.mtime.toISOString().slice(0, 10); // YYYY-MM-DD
}

function escapeXml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildSitemap(urlEntries) {
  const header =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const body = urlEntries
    .map(({ loc, lastmod }) => {
      return (
        `  <url>\n` +
        `    <loc>${escapeXml(loc)}</loc>\n` +
        (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : "") +
        `  </url>\n`
      );
    })
    .join("");

  return header + body + `</urlset>\n`;
}

function main() {
  if (!fs.existsSync(ROOT_DIR)) {
    console.error(`ERROR: Pages folder not found at: ${ROOT_DIR}`);
    process.exit(1);
  }

  const htmlFiles = walk(ROOT_DIR);

  const entries = htmlFiles
    .map((fp) => ({
      loc: fileToUrl(fp),
      lastmod: isoDateFromMtime(fp),
      file: fp,
    }))
    .filter((x) => !x.loc.includes("/test/"))
    .filter((x) => !shouldSkipUrl(x.loc));

  // ukloni duplikate (ako se ikad pojave)
  const seen = new Set();
  const unique = [];
  for (const e of entries) {
    if (seen.has(e.loc)) continue;
    seen.add(e.loc);
    unique.push(e);
  }

  unique.sort((a, b) => a.loc.localeCompare(b.loc));

  const xml = buildSitemap(unique);
  fs.writeFileSync(OUT_FILE, xml, "utf8");

  console.log(`✅ sitemap generated: ${OUT_FILE}`);
  console.log(`✅ URLs: ${unique.length}`);
}

main();
