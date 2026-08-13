#!/usr/bin/env node
/** Post-build:
 *  1. sitemap.xml with hreflang alternates for both locales
 *  2. robots.txt pointing at the sitemap
 *  3. 404.html at the output root (Vercel serves it with status 404 for unmatched paths)
 */
import { readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "build", "client");
const ORIGIN = (process.env.VITE_SITE_ORIGIN ?? "https://harmonia-baila.vercel.app").replace(/\/$/, "");

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
