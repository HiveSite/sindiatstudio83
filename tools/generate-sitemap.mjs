import fs from "fs";
import path from "path";

const BASE_URL = "https://www.sindikatstudio83.me";
const ROOT_DIR = path.resolve("Pages");
const OUT_FILE = path.join(ROOT_DIR, "sitemap.xml");

// Fajlovi koje preskačemo (dodaj po potrebi)
const SKIP_FILES = new Set([
  "404.html",
]);

// Folderi koje preskačemo (dodaj po potrebi)
const SKIP_DIRS = new Set([
  ".git",
  ".github",
  "node_modules",
  "tools",
]);

function isSkippableDir(dirName) {
  return SKIP_DIRS.has(dirName);
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
    // Pocetna.html -> /sr-me/Pocetna.html (ostaje kako jeste)
    // Ako želiš “clean URLs” bez .html, možemo u fazi 2.
  }

  // Normalizuj: ukloni duple slasheve
  const urlPath = ("/" + rel).replace(/\/{2,}/g, "/");

  return BASE_URL + urlPath;
}

function isoDateFromMtime(filePath) {
  const st = fs.statSync(filePath);
  const d = st.mtime;
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

function escapeXml(s) {
  return s
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

  const footer = `</urlset>\n`;
  return header + body + footer;
}

function main() {
  if (!fs.existsSync(ROOT_DIR)) {
    console.error(`ERROR: Pages folder not found at: ${ROOT_DIR}`);
    process.exit(1);
  }

  const htmlFiles = walk(ROOT_DIR);

  // napravi entries
  const entries = htmlFiles
    .map((fp) => ({
      loc: fileToUrl(fp),
      lastmod: isoDateFromMtime(fp),
      file: fp,
    }))
    // (Opcionalno) preskoči dev/test stranice po putanji:
    .filter((x) => !x.loc.includes("/test/"));

  // sortiraj stabilno
  entries.sort((a, b) => a.loc.localeCompare(b.loc));

  const xml = buildSitemap(entries);

  fs.writeFileSync(OUT_FILE, xml, "utf8");

  console.log(`✅ sitemap generated: ${OUT_FILE}`);
  console.log(`✅ URLs: ${entries.length}`);
}

main();
