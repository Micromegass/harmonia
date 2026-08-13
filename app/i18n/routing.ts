/** Route-based locales with localized slugs. Single source of truth for
 *  routes.ts, the language switcher, sitemap generation, and hreflang tags. */

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export type PageKey =
  | "home"
  | "about"
  | "classes"
  | "schedule"
  | "gallery"
  | "contact"
  | "dataPolicy"
  | "privacyNotice"
  | "terms"
  | "cookies";

/** Localized slug per page (no leading slash; "" = locale root). */
export const pageSlugs: Record<PageKey, Record<Locale, string>> = {
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

export function pathFor(page: PageKey, locale: Locale): string {
  const slug = pageSlugs[page][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

/** Resolve locale + page from a pathname; null when it is not a site page. */
export function resolvePath(pathname: string): { locale: Locale; page: PageKey } | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const m = clean.match(/^\/(es|en)(?:\/(.*))?$/);
  if (!m) return null;
  const locale = m[1] as Locale;
  const slug = m[2] ?? "";
  const entry = (Object.entries(pageSlugs) as [PageKey, Record<Locale, string>][]).find(
    ([, slugs]) => slugs[locale] === slug,
  );
  return entry ? { locale, page: entry[0] } : null;
}

/** The same page in the other locale (used by the language switcher). */
export function alternatePath(pathname: string, target: Locale): string {
  const resolved = resolvePath(pathname);
  return resolved ? pathFor(resolved.page, target) : `/${target}`;
}

/** All concrete paths, for prerender + sitemap. */
export function allPaths(): string[] {
  const paths: string[] = ["/", "/404"];
  for (const page of Object.keys(pageSlugs) as PageKey[]) {
    for (const locale of locales) paths.push(pathFor(page, locale));
  }
  return paths;
}

export const LOCALE_STORAGE_KEY = "hb-locale";
