import fs from "fs";
import path from "path";

const BASE = "https://www.sindikatstudio83.me";
const ROOT = path.resolve("Pages");

// Brand detalji (slobodno promijeni ako želiš)
const BRAND_NAME = "Sindikat Studio 83";
const BRAND_URL = `${BASE}/`;
const LOGO_URL = `${BASE}/studio83logo.png`;

// LocalBusiness detalji (minimalno, bez adrese/telefona dok ne želiš)
const LOCAL = {
  city: "Podgorica",
  region: "Crna Gora",
  countryCode: "ME",
};

// Koje stranice su blog postovi (p01, p02, ...)
const BLOG_POST_PATH_RE = /^\/sr-me\/blog\/p\d{2}\/$/i;

function shouldSkipFile(fp) {
  const rel = path.relative(ROOT, fp).replace(/\\/g, "/");
  return rel.includes("<slug>") || rel.includes("_templates");
}

function read(fp) {
  return fs.readFileSync(fp, "utf8");
}
function write(fp, content) {
  fs.writeFileSync(fp, content, "utf8");
}

function ensureSlash(u) {
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
  // Pages/.../index.html -> https://www.../.../
  const rel = path.relative(ROOT, fp).replace(/\\/g, "/");
  if (rel.toLowerCase() === "index.html") return `${BASE}/`;
  if (rel.toLowerCase().endsWith("/index.html")) {
    const p = rel.slice(0, -"/index.html".length) + "/";
    return `${BASE}/${p}`.replace(/\/{2,}/g, "/").replace("https:/", "https://");
  }
  return `${BASE}/${rel}`;
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

function withHead(html, fn) {
  const m = html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i);
  if (!m) return fn(html);
  const head = m[0];
  const updated = fn(head);
  return html.replace(head, updated);
}

function getTitle(head) {
  const m = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim().replace(/\s+/g, " ") : "";
}

function getMetaDescription(head) {
  const m =
    head.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    head.match(/<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  return m ? m[1].trim().replace(/\s+/g, " ") : "";
}

function getOgImage(head) {
  const m =
    head.match(/<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
    head.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
  return m ? m[1].trim() : "";
}

function normalizeToAbsolute(u) {
  let url = (u || "").trim();
  if (!url) return "";
  if (url.startsWith("/")) url = `${BASE}${url}`;
  url = url.replace(/^https:\/\/sindikatstudio83\.me/i, BASE);
  url = url.replace(/^http:\/\/sindikatstudio83\.me/i, BASE);
  return url;
}

function isoDateFromMtime(filePath) {
  const st = fs.statSync(filePath);
  return st.mtime.toISOString(); // full ISO (good for schema)
}

function escapeForClosingScript(s) {
  // prevent accidental </script> termination
  return String(s).replace(/<\/script>/gi, "<\\/script>");
}

function buildOrgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BRAND_URL}#org`,
    "name": BRAND_NAME,
    "url": BRAND_URL,
    "logo": {
      "@type": "ImageObject",
      "url": LOGO_URL
    }
  };
}

function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BRAND_URL}#localbusiness`,
    "name": BRAND_NAME,
    "url": BRAND_URL,
    "image": LOGO_URL,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": LOCAL.city,
      "addressRegion": LOCAL.region,
      "addressCountry": LOCAL.countryCode
    }
  };
}

function buildBlogPostingSchema({ canonical, title, desc, image, dateModified }) {
  const img = normalizeToAbsolute(image) || LOGO_URL;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#blogposting`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical
    },
    "headline": title || "Blog",
    "description": desc || "",
    "image": [img],
    "author": {
      "@type": "Organization",
      "@id": `${BRAND_URL}#org`,
      "name": BRAND_NAME
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${BRAND_URL}#org`,
      "name": BRAND_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
      }
    },
    // Nemamo datePublished pouzdano iz HTML-a, pa stavljamo dateModified iz mtime.
    // Ako hoćeš datePublished iz Sheet-a, mogu da proširim skriptu.
    "dateModified": dateModified
  };
}

function upsertSchemaBlock(head, schemaId, schemaObj) {
  // U head ubacujemo jedan <script type="application/ld+json" data-schema="...">
  const scriptTag =
    `<script type="application/ld+json" data-schema="${schemaId}">\n` +
    `${escapeForClosingScript(JSON.stringify(schemaObj, null, 2))}\n` +
    `</script>`;

  const re = new RegExp(
    `<script\\s+type=["']application\\/ld\\+json["'][^>]*data-schema=["']${escapeRegExp(schemaId)}["'][^>]*>[\\s\\S]*?<\\/script>`,
    "i"
  );

  if (re.test(head)) {
    return head.replace(re, scriptTag);
  }

  // insert before </head>
  if (/<\/head>/i.test(head)) return head.replace(/<\/head>/i, `  ${scriptTag}\n</head>`);
  return `${scriptTag}\n${head}`;
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

    const dateModified = isoDateFromMtime(fp);

    html = withHead(html, (head) => {
      let h = head;

      // 1) Organization + LocalBusiness svuda
      h = upsertSchemaBlock(h, "org", buildOrgSchema());
      h = upsertSchemaBlock(h, "localbusiness", buildLocalBusinessSchema());

      // 2) BlogPosting samo na blog postovima /sr-me/blog/pXX/
      if (BLOG_POST_PATH_RE.test(canonicalPath)) {
        const title = getTitle(h);
        const desc = getMetaDescription(h);
        const ogImg = getOgImage(h);

        const blogSchema = buildBlogPostingSchema({
          canonical,
          title,
          desc,
          image: ogImg,
          dateModified
        });

        h = upsertSchemaBlock(h, "blogposting", blogSchema);
      }

      return h;
    });

    write(fp, html);
    changed += 1;
  }

  console.log(`✅ Added/updated JSON-LD schema in ${changed} index.html files`);
  if (skipped) console.log(`↩️ Skipped ${skipped} template index.html files (<slug>/_templates)`);
}

main();
