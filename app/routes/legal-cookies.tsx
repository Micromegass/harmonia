import { LegalPage, getLegalDoc } from "../components/LegalPage";
import { buildMeta } from "../lib/seo";
import { locales, pathFor } from "../i18n/routing";
import type { Locale } from "../i18n/routing";

export function meta({ location }: { location: { pathname: string } }) {
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";
  const doc = getLegalDoc("cookies", locale);
  return buildMeta({
    title: doc.metaTitle,
    description: doc.metaDescription,
    path: pathFor("cookies", locale),
    locale,
    alternates: Object.fromEntries(locales.map((l) => [l, pathFor("cookies", l)])) as Record<Locale, string>,
  });
}

export default function Page() {
  return <LegalPage pageKey="cookies" />;
}
