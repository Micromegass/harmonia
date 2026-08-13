/** SEO helpers: localized meta arrays (title/description/canonical/hreflang/OG)
 *  and JSON-LD builders. Used by every route's `meta` export. */
import es from "../i18n/es.json";
import en from "../i18n/en.json";
import { locales, pathFor, type Locale, type PageKey } from "../i18n/routing";
import { INSTAGRAM_URL, SITE_ORIGIN } from "./site";

type MetaPage = keyof typeof es.meta extends infer K ? Exclude<K, "siteName"> : never;

/** Route `meta` export factory: derives locale from the URL. */
export function metaFor(page: PageKey, metaKey?: MetaPage) {
  return ({ location }: { location: { pathname: string } }) => {
    const resolved = resolvePathForMeta(location.pathname);
    return localizedMeta(page, resolved, metaKey);
  };
}

function resolvePathForMeta(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "es";
}

const dicts = { es, en } as const;

export function localizedMeta(page: PageKey, locale: Locale, metaKey?: MetaPage) {
  const key = (metaKey ?? page) as MetaPage;
  const dict = dicts[locale].meta as unknown as Record<string, { title: string; description: string }>;
  const entry = dict[key] ?? dict.home;
  return buildMeta({
    title: entry.title,
    description: entry.description,
    path: pathFor(page, locale),
    locale,
    alternates: Object.fromEntries(locales.map((l) => [l, pathFor(page, l)])) as Record<Locale, string>,
  });
}

export function buildMeta(args: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  alternates?: Record<Locale, string>;
  noindex?: boolean;
}) {
  const url = `${SITE_ORIGIN}${args.path}`;
  const ogLocale = args.locale === "es" ? "es_CO" : "en_US";
  const tags: Record<string, unknown>[] = [
    { title: args.title },
    { name: "description", content: args.description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:site_name", content: "Harmonia Baila" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: args.title },
    { property: "og:description", content: args.description },
    { property: "og:url", content: url },
    { property: "og:image", content: `${SITE_ORIGIN}/og-${args.locale}.png` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: ogLocale },
    { property: "og:locale:alternate", content: args.locale === "es" ? "en_US" : "es_CO" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: args.title },
    { name: "twitter:description", content: args.description },
    { name: "twitter:image", content: `${SITE_ORIGIN}/og-${args.locale}.png` },
  ];
  if (args.noindex) tags.push({ name: "robots", content: "noindex" });
  if (args.alternates) {
    for (const l of locales) {
      tags.push({ tagName: "link", rel: "alternate", hrefLang: l === "es" ? "es-CO" : "en", href: `${SITE_ORIGIN}${args.alternates[l]}` });
    }
    // Spanish is the x-default: primary market and legally governing version.
    tags.push({ tagName: "link", rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}${args.alternates.es}` });
  }
  return tags;
}

/* ─── JSON-LD ─── */

/** LocalBusiness for the studio. NOTE: schema.org has no DanceSchool type;
 *  LocalBusiness + EducationalOrganization is the validated combination.
 *  Geo is Medellín city center (approximate) until the client confirms the
 *  exact address — see DECISIONS.md. */
export function studioJsonLd(locale: Locale) {
  const d = dicts[locale];
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization"],
    "@id": `${SITE_ORIGIN}/#studio`,
    name: "Harmonia Baila",
    description: d.meta.home.description,
    url: `${SITE_ORIGIN}${pathFor("home", locale)}`,
    sameAs: [INSTAGRAM_URL],
    image: `${SITE_ORIGIN}/og-${locale}.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    geo: { "@type": "GeoCoordinates", latitude: 6.2442, longitude: -75.5812 },
    areaServed: "Medellín",
    knowsAbout: ["Salsa", "Bachata", "Cumbia", "Merengue", "Urban dance", "Contemporary dance"],
    knowsLanguage: ["es", "en"],
  };
}

/** Course entries for the classes page. */
export function coursesJsonLd(locale: Locale) {
  const d = dicts[locale];
  const styleEntries = Object.entries(d.styles) as [string, { name: string; description: string }][];
  return styleEntries.map(([key, s]) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_ORIGIN}${pathFor("classes", locale)}#${key}`,
    name: s.name,
    description: s.description,
    inLanguage: locale === "es" ? "es-CO" : "en",
    provider: { "@id": `${SITE_ORIGIN}/#studio` },
    offers: { "@type": "Offer", category: "Paid", availability: "https://schema.org/InStock" },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      location: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Medellín", addressCountry: "CO" } },
    },
  }));
}

export function breadcrumbJsonLd(locale: Locale, crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_ORIGIN}${c.path}`,
    })),
  };
}
