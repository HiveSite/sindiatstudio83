import fs from "fs";
import path from "path";

const BASE = "https://www.sindikatstudio83.me";
const ROOT = path.resolve("Pages");

// gađamo tačno ovu stranu
const TARGET = path.join(ROOT, "sr-me", "usluge", "index.html");

// Brand
const BRAND_NAME = "Sindikat Studio 83";
const BRAND_URL = `${BASE}/`;
const LOGO_URL = `${BASE}/studio83logo.png`;

// Lokalno targetiranje (neutralno, bez adrese/telefona)
const AREA_SERVED = ["Podgorica", "Crna Gora"];

/**
 * ✅ Ovdje je kompletna lista usluga — uključene i EVENT / AKTIVACIJE.
 * Slobodno mijenjaj tekstove (name/description) da budu 1:1 kao na stranici Usluge.
 */
const SERVICES = [
  // ===== EVENT / PRODUCTION / ACTIVATIONS =====
  {
    slug: "event-produkcija",
    name: "Organizacija i produkcija događaja",
    description:
      "Plan i realizacija događaja: koncept, budžet, logistika, koordinacija tima i isporuka na terenu.",
  },
  {
    slug: "brand-aktivacije",
    name: "Brend aktivacije i promotivne kampanje",
    description:
      "Aktivacije na terenu + digitalna podrška: promo tim, brending, sampling, fotke/video i reporting.",
  },
  {
    slug: "promo-timovi",
    name: "Promo timovi (hostese, promoteri)",
    description:
      "Angažman i vođenje promo osoblja: selekcija, obuka, smjene, komunikacija i kontrola kvaliteta.",
  },
  {
    slug: "tehnicka-produkcija",
    name: "Tehnička produkcija (audio/rasvjeta/tehnika)",
    description:
      "Tehnička podrška za event: ozvučenje, rasvjeta, setup, tehničari i koordinacija tokom programa.",
  },
  {
    slug: "program-booking",
    name: "Program i booking (DJ / sadržaj / tok događaja)",
    description:
      "Kreiranje programa i toka večeri: DJ/program, dinamika, vođenje i koordinacija izvođača.",
  },

  // ===== DIGITAL / PERFORMANCE =====
  {
    slug: "meta-oglasi",
    name: "Meta oglasi (Facebook & Instagram)",
    description:
      "Planiranje i vođenje Meta kampanja: kreativa, targetiranje, optimizacija budžeta i konverzija.",
  },
  {
    slug: "google-ads",
    name: "Google Ads (Search, Display, YouTube)",
    description:
      "Kampanje za upite i prodaju: ključne riječi, oglasi, landing struktura i optimizacija performansi.",
  },
  {
    slug: "seo-local-seo",
    name: "SEO & Local SEO",
    description:
      "On-page SEO, struktura sajta, sadržaj i lokalno rangiranje (Podgorica/Crna Gora).",
  },
  {
    slug: "landing-web",
    name: "Landing stranice & Web",
    description:
      "Stranice koje konvertuju: jasna ponuda, brza forma, praćenje i optimizacija.",
  },
  {
    slug: "sadrzaj-kreativa",
    name: "Sadržaj i kreativa (copy + oglasi)",
    description:
      "Copy i kreativa za oglase: hook, ponuda, varijacije, A/B testovi i optimizacija na osnovu rezultata.",
  },
  {
    slug: "analitika-mjerenje",
    name: "Analitika i mjerenje (GTM / GA4)",
    description:
      "Postavka praćenja i mjerenja: događaji, konverzije, izvještaji i optimizacija na osnovu podataka.",
  },
];

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

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeForClosingScript(s) {
  return String(s).replace(/<\/script>/gi, "<\\/script>");
}

function upsertSchemaBlock(head, schemaId, schemaObj) {
  const scriptTag =
    `<script type="application/ld+json" data-schema="${schemaId}">\n` +
    `${escapeForClosingScript(JSON.stringify(schemaObj, null, 2))}\n` +
    `</script>`;

  const re = new RegExp(
    `<script\\s+type=["']application\\/ld\\+json["'][^>]*data-schema=["']${escapeRegExp(schemaId)}["'][^>]*>[\\s\\S]*?<\\/script>`,
    "i"
  );

  if (re.test(head)) return head.replace(re, scriptTag);

  if (/<\/head>/i.test(head)) return head.replace(/<\/head>/i, `  ${scriptTag}\n</head>`);
  return `${scriptTag}\n${head}`;
}

function buildServicesSchema() {
  const servicesUrl = `${BASE}/sr-me/usluge/`;

  const org = {
    "@type": "Organization",
    "@id": `${BRAND_URL}#org`,
    name: BRAND_NAME,
    url: BRAND_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
  };

  // Svaka usluga dobija svoj anchor na /sr-me/usluge/#slug
  const items = SERVICES.map((s) => {
    const url = `${servicesUrl}#${s.slug}`;
    return {
      "@type": "Service",
      "@id": url,
      name: s.name,
      description: s.description,
      url,
      provider: { "@id": `${BRAND_URL}#org` },
      areaServed: AREA_SERVED,
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": servicesUrl,
    url: servicesUrl,
    name: "Usluge",
    about: org,
    hasPart: items,
  };
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error(`❌ TARGET not found: ${TARGET}`);
    process.exit(1);
  }

  let html = read(TARGET);

  html = withHead(html, (head) => {
    let h = head;
    h = upsertSchemaBlock(h, "services", buildServicesSchema());
    return h;
  });

  write(TARGET, html);
  console.log(`✅ Added/updated Service schema on: ${TARGET}`);
  console.log(`✅ Services count: ${SERVICES.length}`);
}

main();
