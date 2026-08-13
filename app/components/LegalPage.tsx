import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import type { Locale, PageKey } from "../i18n/routing";
import { pathFor } from "../i18n/routing";
import { breadcrumbJsonLd } from "../lib/seo";
import { JsonLd } from "../components/JsonLd";
import { CONTACT_EMAIL } from "../lib/site";
import legalEs from "../content/legal.es.json";
import legalEn from "../content/legal.en.json";

export type LegalDoc = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updated: string;
  prevails?: string;
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[];
};

export type LegalKey = "dataPolicy" | "privacyNotice" | "terms" | "cookies";

export function getLegalDoc(key: LegalKey, locale: Locale): LegalDoc {
  const source = (locale === "es" ? legalEs : legalEn) as Record<LegalKey, LegalDoc>;
  return source[key];
}

/** Placeholder interpolation: legal identity fields pending client input are
 *  written as {{razonSocial}} etc. in the JSON (listed in DECISIONS.md). */
function fill(text: string): string {
  return text
    .replace(/\{\{email\}\}/g, CONTACT_EMAIL || "[correo de contacto pendiente]")
    .replace(/\{\{razonSocial\}\}/g, "[Razón social pendiente de confirmar]")
    .replace(/\{\{nit\}\}/g, "[NIT pendiente de confirmar]")
    .replace(/\{\{domicilio\}\}/g, "Medellín, Antioquia, Colombia");
}

export function LegalPage({ pageKey }: { pageKey: LegalKey }) {
  const { t } = useTranslation();
  const location = useLocation();
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";
  const doc = getLegalDoc(pageKey, locale);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t("nav.home"), path: pathFor("home", locale) },
          { name: doc.title, path: pathFor(pageKey as PageKey, locale) },
        ])}
      />
      <article className="field-crudo min-h-svh pt-32 sm:pt-36">
        <div className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
          <h1 className="display text-4xl sm:text-5xl">{doc.title}</h1>
          <p className="muted mt-4 text-sm font-semibold">{doc.updated}</p>
          {doc.prevails && (
            <p className="mt-4 rounded-xl bg-lima/25 px-4 py-3 text-sm font-medium leading-relaxed">{doc.prevails}</p>
          )}
          <div className="mt-10 space-y-10">
            {doc.sections.map((section, i) => (
              <section key={i}>
                <h2 className="display-mid text-2xl">{section.heading}</h2>
                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="mt-4 leading-relaxed">
                    {fill(p)}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed">
                    {section.list.map((item, j) => (
                      <li key={j}>{fill(item)}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
