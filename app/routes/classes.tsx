import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { pathFor, type Locale } from "../i18n/routing";
import { breadcrumbJsonLd, coursesJsonLd, metaFor } from "../lib/seo";
import { waLink } from "../lib/site";
import { Reveal } from "../components/Reveal";
import { RuffleDivider } from "../components/RuffleDivider";
import { JsonLd } from "../components/JsonLd";
import { MediaTile, type MediaAsset } from "../components/MediaTile";
import manifest from "../content/media.manifest.json";

export const meta = metaFor("classes");

const STYLE_KEYS = ["salsa", "bachata", "urbano", "tropical", "kids", "contemporaneo"] as const;

export default function Classes() {
  const { t } = useTranslation();
  const location = useLocation();
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";
  const assets = manifest.assets as MediaAsset[];

  return (
    <>
      <JsonLd
        data={[
          ...coursesJsonLd(locale),
          breadcrumbJsonLd(locale, [
            { name: t("nav.home"), path: pathFor("home", locale) },
            { name: t("nav.classes"), path: pathFor("classes", locale) },
          ]),
        ]}
      />

      <section className="field-noche pt-32 sm:pt-36">
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
          <Reveal>
            <h1 className="display text-5xl sm:text-7xl">{t("classes.heading")}</h1>
            <p className="lead muted mt-6 max-w-2xl">{t("classes.intro")}</p>
          </Reveal>
        </div>
      </section>

      {/* Formats */}
      <section className="field-fucsia" aria-labelledby="formats-heading">
        <RuffleDivider from="noche" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <h2 id="formats-heading" className="display text-4xl sm:text-5xl">
              {t("classes.formats.heading")}
            </h2>
          </Reveal>
          <dl className="mt-10 grid gap-10 md:grid-cols-3">
            {(["group", "private", "kidsAdults"] as const).map((key, i) => (
              <Reveal key={key} beats={i * 2}>
                <dt className="display-mid text-2xl">{t(`classes.formats.${key}.title`)}</dt>
                <dd className="muted mt-3 leading-relaxed">{t(`classes.formats.${key}.body`)}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Levels */}
      <section className="field-crudo" aria-labelledby="levels-heading">
        <RuffleDivider from="fucsia" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <h2 id="levels-heading" className="display text-4xl sm:text-5xl">
              {t("classes.levels.heading")}
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {(["beginner", "intermediate", "advanced"] as const).map((key, i) => (
              <Reveal as="li" key={key} beats={i * 2}>
                <div className="h-full rounded-2xl bg-crudo-2 p-6">
                  <h3 className="display-mid text-xl">{t(`classes.levels.${key}.title`)}</h3>
                  <p className="muted mt-2 leading-relaxed">{t(`classes.levels.${key}.body`)}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Styles in depth */}
      <section className="field-noche" aria-labelledby="styles-heading">
        <RuffleDivider from="crudo" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <h2 id="styles-heading" className="display text-4xl sm:text-6xl">
              {t("classes.stylesHeading")}
            </h2>
          </Reveal>
          <div className="mt-12 space-y-16">
            {STYLE_KEYS.map((key, i) => {
              const asset = assets.find((a) => a.styleTag === key && a.type === "image");
              const flip = i % 2 === 1;
              return (
                <Reveal key={key}>
                  <article className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
                    <div>
                      <h3 className="display-mid text-3xl sm:text-4xl">{t(`styles.${key}.name`)}</h3>
                      <p className="mt-1 text-lg font-medium italic text-sol">{t(`styles.${key}.tagline`)}</p>
                      <p className="muted mt-4 max-w-lg leading-relaxed">{t(`styles.${key}.description`)}</p>
                    </div>
                    {asset && <MediaTile asset={asset} locale={locale} sizes="(min-width: 768px) 45vw, 90vw" />}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing honesty */}
      <section className="field-sol" aria-labelledby="pricing-heading">
        <RuffleDivider from="noche" />
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <Reveal>
            <h2 id="pricing-heading" className="display text-4xl sm:text-5xl">
              {t("classes.pricing.heading")}
            </h2>
            <p className="lead mx-auto mt-5">{t("classes.pricing.body")}</p>
          </Reveal>
          <Reveal beats={2} className="mt-8">
            <a
              href={waLink(t("whatsapp.prefill"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-noche px-8 py-4 text-lg font-bold text-sol transition-transform hover:scale-105 motion-reduce:transition-none"
            >
              {t("classes.pricing.cta")}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
