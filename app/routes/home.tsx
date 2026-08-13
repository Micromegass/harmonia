import { Link, useLocation } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { pathFor, type Locale } from "../i18n/routing";
import { metaFor, studioJsonLd } from "../lib/seo";
import { waLink } from "../lib/site";
import { BEAT, countIn, EASE_DANCE, swingIn } from "../components/motion";
import { Reveal } from "../components/Reveal";
import { Ribbons } from "../components/Ribbons";
import { RuffleDivider } from "../components/RuffleDivider";
import { JsonLd } from "../components/JsonLd";
import { MediaTile, type MediaAsset } from "../components/MediaTile";
import manifest from "../content/media.manifest.json";

export const meta = metaFor("home");

const STYLE_KEYS = ["salsa", "bachata", "urbano", "tropical", "kids", "contemporaneo"] as const;

export default function Home() {
  const { t } = useTranslation();
  const location = useLocation();
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";

  return (
    <>
      <JsonLd data={studioJsonLd(locale)} />
      <Hero locale={locale} />

      {/* ── Rhythms: fucsia field ── */}
      <section className="field-fucsia" aria-labelledby="styles-heading">
        <RuffleDivider from="noche" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <h2 id="styles-heading" className="display text-4xl sm:text-6xl">
              {t("home.styles.heading")}
            </h2>
            <p className="lead muted mt-4">{t("home.styles.intro")}</p>
          </Reveal>
          <ul className="mt-10 divide-y divide-noche/15 border-y border-noche/15">
            {STYLE_KEYS.map((key, i) => (
              <Reveal as="li" key={key} beats={i}>
                <Link
                  to={pathFor("classes", locale)}
                  className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 transition-colors hover:bg-noche/5 sm:py-6"
                >
                  <span className="display-mid text-2xl transition-transform group-hover:translate-x-2 motion-reduce:transition-none sm:text-4xl">
                    {t(`styles.${key}.name`)}
                  </span>
                  <span className="muted text-sm font-medium italic sm:text-base">{t(`styles.${key}.tagline`)}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8">
            <Link
              to={pathFor("classes", locale)}
              className="inline-block rounded-full bg-noche px-7 py-3.5 font-bold text-crudo transition-transform hover:scale-105 motion-reduce:transition-none"
            >
              {t("home.styles.cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Method: crudo field ── */}
      <section className="field-crudo" aria-labelledby="method-heading">
        <RuffleDivider from="fucsia" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
            <Reveal>
              <h2 id="method-heading" className="display text-4xl sm:text-5xl">
                {t("home.method.heading")}
              </h2>
              <p className="lead mt-6">{t("home.method.body")}</p>
            </Reveal>
            <dl className="space-y-8 self-center">
              {(["pro", "levels", "formats"] as const).map((key, i) => (
                <Reveal key={key} beats={i * 2}>
                  <div>
                    <dt className="display-mid text-xl">
                      {t(`home.method.points.${key}.title`)}
                      <svg width="52" height="8" viewBox="0 0 52 8" aria-hidden="true" className="mt-1.5 block">
                        <path d="M1 6 Q 7.5 0 14 6 T 27 6 T 40 6 T 53 6" fill="none" stroke="var(--color-fucsia)" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </dt>
                    <dd className="muted mt-2 leading-relaxed">{t(`home.method.points.${key}.body`)}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Kids: sol field ── */}
      <section className="field-sol" aria-labelledby="kids-heading">
        <RuffleDivider from="crudo" />
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-5 py-14 sm:px-8 sm:py-20">
          <Reveal className="max-w-xl">
            <h2 id="kids-heading" className="display text-4xl sm:text-5xl">
              {t("home.kids.heading")}
            </h2>
            <p className="lead mt-4">{t("home.kids.body")}</p>
          </Reveal>
          <Reveal beats={2}>
            <Link
              to={pathFor("classes", locale)}
              className="inline-block rounded-full bg-noche px-7 py-3.5 font-bold text-sol transition-transform hover:scale-105 motion-reduce:transition-none"
            >
              {t("home.kids.cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Gallery teaser: noche field ── */}
      <section className="field-noche" aria-labelledby="gallery-heading">
        <RuffleDivider from="sol" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="gallery-heading" className="display text-4xl sm:text-6xl">
              {t("home.gallery.heading")}
            </h2>
            <Link
              to={pathFor("gallery", locale)}
              className="font-semibold text-sol underline underline-offset-4 hover:text-crudo"
            >
              {t("home.gallery.cta")}
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {(manifest.assets as MediaAsset[])
              .filter((a) => a.type === "image")
              .slice(0, 4)
              .map((asset, i) => (
                <Reveal key={asset.id} beats={i}>
                  <MediaTile asset={asset} locale={locale} sizes="(min-width: 768px) 25vw, 50vw" />
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA: fucsia field ── */}
      <section className="field-fucsia" aria-labelledby="cta-heading">
        <RuffleDivider from="noche" />
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <Reveal>
            <h2 id="cta-heading" className="display text-4xl sm:text-6xl">
              {t("home.finalCta.heading")}
            </h2>
            <p className="lead muted mx-auto mt-5">{t("home.finalCta.body")}</p>
          </Reveal>
          <Reveal beats={2} className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waLink(t("whatsapp.prefill"))}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-noche px-8 py-4 text-lg font-bold text-crudo transition-transform hover:scale-105 motion-reduce:transition-none"
            >
              {t("home.finalCta.ctaPrimary")}
            </a>
            <Link
              to={pathFor("contact", locale)}
              className="font-semibold text-noche underline underline-offset-4 hover:text-crudo"
            >
              {t("home.finalCta.ctaSecondary")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Hero({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const title = t("home.hero.title");
  // Words wrap; letters inside a word never do (letter spans are the stagger unit).
  const words = title.split(" ").map((w) => Array.from(w));

  return (
    <section className="field-noche relative flex min-h-svh flex-col justify-center overflow-hidden">
      <Ribbons />
      {/* local scrim so hero copy stays readable where ribbons cross it */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/4 h-3/5 bg-[linear-gradient(100deg,rgb(34_16_34/0.82)_0%,rgb(34_16_34/0.55)_45%,transparent_75%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-24 sm:px-8">
        {reduced ? (
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-sol">{t("home.hero.count")}</p>
        ) : (
          <motion.p
            className="text-sm font-bold uppercase tracking-[0.35em] text-sol"
            initial="hidden"
            animate="visible"
            variants={countIn}
            aria-hidden="true"
          >
            {t("home.hero.count")
              .split(" ")
              .map((token, i) => (
                <motion.span
                  key={i}
                  className="inline-block whitespace-pre"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: BEAT * 2, ease: [...EASE_DANCE] } },
                  }}
                >
                  {token}{" "}
                </motion.span>
              ))}
          </motion.p>
        )}

        <h1
          className="display mt-5 text-[min(10.4vw,8rem)] leading-[0.92] md:text-[min(8.6vw,9.5rem)]"
          aria-label={title}
        >
          {reduced ? (
            <span>{title}</span>
          ) : (
            <motion.span
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: BEAT / 2, delayChildren: BEAT * 4 }}
              aria-hidden="true"
            >
              {words.map((letters, w) => (
                <span key={w} className="inline-block whitespace-nowrap">
                  {letters.map((ch, i) => (
                    <motion.span key={i} className="inline-block" variants={swingIn()}>
                      {ch}
                    </motion.span>
                  ))}
                  {w < words.length - 1 && " "}
                </span>
              ))}
            </motion.span>
          )}
        </h1>

        <motion.p
          className="lead mt-7 max-w-xl text-crudo"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BEAT * 8, duration: BEAT * 4, ease: [...EASE_DANCE] }}
        >
          {t("home.hero.subtitle")}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-4"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BEAT * 10, duration: BEAT * 4, ease: [...EASE_DANCE] }}
        >
          <a
            href={waLink(t("whatsapp.prefill"))}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-fucsia px-8 py-4 text-lg font-bold text-crudo shadow-lift transition-transform hover:scale-105 motion-reduce:transition-none"
          >
            {t("home.hero.ctaPrimary")}
          </a>
          <Link
            to={pathFor("classes", locale)}
            className="rounded-full border-2 border-crudo/40 px-7 py-3.5 font-bold text-crudo transition-colors hover:border-sol hover:text-sol"
          >
            {t("home.hero.ctaSecondary")}
          </Link>
        </motion.div>
      </div>
      <p className="muted absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest" aria-hidden="true">
        ↓ {t("home.hero.scrollHint")}
      </p>
    </section>
  );
}
