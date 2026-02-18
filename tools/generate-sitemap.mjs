import fs from "fs";
import path from "path";

const BASE_URL = "https://www.sindikatstudio83.me";
const ROOT_DIR = path.resolve("Pages");
const OUT_FILE = path.join(ROOT_DIR, "sitemap.xml");

// Fajlovi koje preskačemo
const SKIP_FILES = new Set(["404.html"]);

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

function normalizePathSlashes(p) {
  return ("/" + p).replace(/\/{2,}/g, "/");
}

// ✅ Samo clean URL-ovi: index.html -> folder URL
// ❌ Bilo koji drugi .html (legacy ili stub) -> null (ne ulazi u sitemap)
function fileToUrl(filePath) {
  let rel = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
  const lower = rel.toLowerCase();

  // ⛔️ Safety: ako se .html provuče kao dio foldera (npr. /usluge.html/index.html), izbaci
  if (lower.includes(".html/")) return null;

  // DOZVOLI SAMO index.html
  const isRootIndex = lower === "index.html";
  const isFolderIndex = lower.endsWith("/index.html");
  if (!isRootIndex && !isFolderIndex) return null;

  if (isRootIndex) rel = ""; // root
  else rel = rel.slice(0, -"/index.html".length) + "/";

  let finalPath = normalizePathSlashes(rel);

  // osiguraj trailing slash na folder rutama (osim root-a koji je "/")
  if (finalPath !== "/" && !finalPath.endsWith("/")) finalPath += "/";

  return BASE_URL + finalPath;
}

// Pravila za izbacivanje URL-ova koje ne želimo u sitemap (safety net)
function shouldSkipUrl(url) {
  if (!url) return true;

  const lower = url.toLowerCase();

  // 1) izbaci blog template placeholder
  if (lower.includes("/sr-me/blog/<slug>/")) return true;
  if (lower.includes("/sr-me/blog/%3cslug%3e/")) return true;

  // 2) izbaci internal/template putanje
  if (lower.includes("/_templates/")) return true;

  // 3) izbaci test rute (ako ih ima)
  if (lower.includes("/test/")) return true;

  // 4) zaštita: ako se ikad provuče ".html" BILO GDJE u putanji, izbaci ga
  // hvata i ".../neko.html/" i ".../neko.html"
  if (/\.html(\/|$)/i.test(url)) return true;

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

  // napravi entries samo iz index.html fajlova
  const entries = htmlFiles
    .map((fp) => {
      const loc = fileToUrl(fp);
      if (!loc) return null;
      return {
        loc,
        lastmod: isoDateFromMtime(fp),
        file: fp,
      };
    })
    .filter(Boolean)
    .filter((x) => !shouldSkipUrl(x.loc));

  // ukloni duplikate
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
