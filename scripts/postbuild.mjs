#!/usr/bin/env node
/** Post-build:
 *  1. sitemap.xml with hreflang alternates for both locales
 *  2. robots.txt pointing at the sitemap
 *  3. 404.html at the output root (Vercel serves it with status 404 for unmatched paths)
 */
import { readFile, writeFile, copyFile, cp, rm, access } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "build", "client");
const ORIGIN = (process.env.VITE_SITE_ORIGIN ?? "https://harmonia-baila.vercel.app").replace(/\/$/, "");
const BASE = process.env.BASE_PATH ?? "/";
const SUBPATH_BUILD = BASE !== "/";

// Subpath builds: React Router prerenders pages under OUT/<basename>/ while
// public assets stay at OUT root. Flatten so the artifact root maps 1:1 to
// the hosted subpath (GitHub Pages serves the artifact at /<basename>/).
if (SUBPATH_BUILD) {
  const nested = path.join(OUT, BASE.replaceAll("/", ""));
  try {
    await access(nested);
    await cp(nested, OUT, { recursive: true, force: true });
    await rm(nested, { recursive: true });
    console.log(`✓ flattened ${path.relative(ROOT, nested)}/ into build/client/`);
  } catch {
    console.log("✓ no nested basename dir to flatten");
  }
}

// Mirror of app/i18n/routing.ts pageSlugs (kept in sync manually; the build
// fails loudly in verification if a prerendered page is missing from here).
const pageSlugs = {
  home: { es: "", en: "" },
  about: { es: "nosotros", en: "about" },
  classes: { es: "clases", en: "classes" },
  schedule: { es: "horarios", en: "schedule" },
  gallery: { es: "galeria", en: "gallery" },
  contact: { es: "contacto", en: "contact" },
  dataPolicy: { es: "legal/tratamiento-de-datos", en: "legal/data-processing" },
  privacyNotice: { es: "legal/aviso-de-privacidad", en: "legal/privacy-notice" },
  terms: { es: "legal/terminos-y-condiciones", en: "legal/terms" },
  cookies: { es: "legal/politica-de-cookies", en: "legal/cookie-policy" },
};

const url = (locale, slug) => `${ORIGIN}/${locale}${slug ? `/${slug}` : ""}`;
const today = new Date().toISOString().slice(0, 10);

const entries = Object.values(pageSlugs)
  .flatMap((slugs) =>
    ["es", "en"].map((locale) => {
      const alternates = [
        `    <xhtml:link rel="alternate" hreflang="es-CO" href="${url("es", slugs.es)}"/>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${url("en", slugs.en)}"/>`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url("es", slugs.es)}"/>`,
      ].join("\n");
      return `  <url>\n    <loc>${url(locale, slugs[locale])}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n  </url>`;
    }),
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;

await writeFile(path.join(OUT, "sitemap.xml"), sitemap);

const robots = `User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`;
await writeFile(path.join(OUT, "robots.txt"), robots);

// Vercel: a root-level 404.html is served (with 404 status) for unmatched paths.
await copyFile(path.join(OUT, "404", "index.html"), path.join(OUT, "404.html"));

/* ── CSP: hash every executable inline script the prerender emitted, and keep
 *  vercel.json's Content-Security-Policy in sync. Inline-script hashes are
 *  build-deterministic (verified), so the committed header always matches the
 *  committed code. On CI/Vercel a mismatch fails the build loudly instead of
 *  shipping a CSP that blocks hydration — fix by running `npm run build`
 *  locally and committing vercel.json. ld+json never executes → not hashed. */
import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith(".html")) yield p;
  }
}

const hashes = new Set();
for await (const file of htmlFiles(OUT)) {
  const html = await readFile(file, "utf8");
  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (m[1].includes("ld+json")) continue;
    hashes.add(`'sha256-${createHash("sha256").update(m[2]).digest("base64")}'`);
  }
}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(" ")}`,
  "style-src 'self' 'unsafe-inline'", // React/Framer Motion style attributes
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://api.web3forms.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const vercelPath = path.join(ROOT, "vercel.json");
if (SUBPATH_BUILD) {
  // Subpath preview build (GitHub Pages): headers don't apply there and the
  // inline-script hashes intentionally differ — leave vercel.json untouched.
  console.log("✓ subpath build: vercel.json headers left as committed (root build owns them)");
} else {
const vercelBefore = await readFile(vercelPath, "utf8");
const vercelJson = JSON.parse(vercelBefore);
vercelJson.headers = [
  {
    source: "/(.*)",
    headers: [
      { key: "Content-Security-Policy", value: csp },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ],
  },
  {
    source: "/(assets|fonts|media)/(.*)",
    headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
  },
];
const vercelAfter = JSON.stringify(vercelJson, null, 2) + "\n";
if (vercelAfter !== vercelBefore) {
  if (process.env.VERCEL || process.env.CI) {
    console.error("✗ vercel.json CSP hashes are stale for this build. Run `npm run build` locally and commit vercel.json.");
    process.exit(1);
  }
  await writeFile(vercelPath, vercelAfter);
  console.log(`✓ vercel.json headers refreshed (${hashes.size} inline-script hashes) — commit it`);
} else {
  console.log(`✓ vercel.json headers up to date (${hashes.size} inline-script hashes)`);
}
}

// Sanity: every sitemap URL must exist as prerendered HTML.
let missing = 0;
for (const slugs of Object.values(pageSlugs)) {
  for (const locale of ["es", "en"]) {
    const p = path.join(OUT, locale, slugs[locale], "index.html");
    try {
      await readFile(p);
    } catch {
      console.error(`✗ sitemap URL has no prerendered file: ${p}`);
      missing++;
    }
  }
}
if (missing) process.exit(1);
console.log(`✓ sitemap.xml (${Object.keys(pageSlugs).length * 2} URLs), robots.txt, 404.html`);
