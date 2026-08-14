import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { pathFor, type Locale } from "../i18n/routing";
import { breadcrumbJsonLd, metaFor, studioJsonLd } from "../lib/seo";
import { asset } from "../lib/site";
import { Reveal } from "../components/Reveal";
import { RuffleDivider } from "../components/RuffleDivider";
import { JsonLd } from "../components/JsonLd";
import { MediaTile, type MediaAsset } from "../components/MediaTile";
import manifest from "../content/media.manifest.json";

export const meta = metaFor("about");

export default function About() {
  const { t } = useTranslation();
  const location = useLocation();
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";
  const portrait = (manifest.assets as MediaAsset[]).find((a) => a.id === "profesora-01");

  return (
    <>
      <JsonLd
        data={[
          studioJsonLd(locale),
          breadcrumbJsonLd(locale, [
            { name: t("nav.home"), path: pathFor("home", locale) },
            { name: t("nav.about"), path: pathFor("about", locale) },
          ]),
        ]}
      />
      <section className="field-noche pt-32 sm:pt-36">
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <Reveal>
            <h1 className="display max-w-3xl text-5xl sm:text-7xl">{t("about.heading")}</h1>
            <p className="lead muted mt-6 max-w-2xl text-xl">{t("about.intro")}</p>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <div className="space-y-6 text-lg leading-relaxed">
              {(["p1", "p2", "p3"] as const).map((p, i) => (
                <Reveal as="p" key={p} beats={i}>
                  {t(`about.story.${p}`)}
                </Reveal>
              ))}
            </div>
            <Reveal beats={2} className="self-start md:sticky md:top-24">
              <img
                src={asset("/media/logo-wide.webp")}
                alt={t("brand.logoAlt")}
                className="w-full rounded-2xl"
                width="1143"
                height="630"
                loading="lazy"
              />
              {portrait && (
                <div className="mt-5">
                  <MediaTile asset={portrait} locale={locale} sizes="(min-width: 768px) 40vw, 90vw" />
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="field-crudo" aria-labelledby="values-heading">
        <RuffleDivider from="noche" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <h2 id="values-heading" className="display text-4xl sm:text-5xl">
              {t("about.values.heading")}
            </h2>
          </Reveal>
          <dl className="mt-12 grid gap-10 md:grid-cols-3">
            {(["technique", "joy", "community"] as const).map((key, i) => (
              <Reveal key={key} beats={i * 2}>
                <dt className="display-mid text-2xl">
                  {t(`about.values.${key}.title`)}
                  <svg width="52" height="8" viewBox="0 0 52 8" aria-hidden="true" className="mt-2 block">
                    <path d="M1 6 Q 7.5 0 14 6 T 27 6 T 40 6 T 53 6" fill="none" stroke="var(--color-petrol)" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </dt>
                <dd className="muted mt-3 leading-relaxed">{t(`about.values.${key}.body`)}</dd>
              </Reveal>
            ))}
          </dl>
          <Reveal beats={2} className="mt-14">
            <Link
              to={pathFor("contact", locale)}
              className="inline-block rounded-full bg-lima px-8 py-4 text-lg font-bold text-noche transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none"
            >
              {t("about.cta")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
