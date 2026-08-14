import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { pathFor, type Locale } from "../i18n/routing";
import { metaFor, studioJsonLd } from "../lib/seo";
import { asset as assetUrl, waLink } from "../lib/site";
import { Reveal } from "../components/Reveal";
import { FlowField, sheafPaths, trailColor } from "../components/FlowField";
import { RuffleDivider } from "../components/RuffleDivider";
import { JsonLd } from "../components/JsonLd";
import { MediaTile, type MediaAsset } from "../components/MediaTile";
import manifest from "../content/media.manifest.json";

export const meta = metaFor("home");

const STYLE_KEYS = ["salsa", "bachata", "urbano", "tropical", "kids", "contemporaneo"] as const;

/** Benefit → photo medallion (asset id from the media manifest). */
const BENEFITS: [string, string][] = [
  ["confianza", "salsa-pareja-01"],
  ["alegria", "kids-clase-01"],
  ["disciplina", "contemporaneo-solo-01"],
  ["comunidad", "urbano-grupo-01"],
  ["expresion", "tropical-cumbia-01"],
];

export default function Home() {
  const { t } = useTranslation();
  const location = useLocation();
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";

  return (
    <>
      <JsonLd data={studioJsonLd(locale)} />
      <Hero locale={locale} />

      {/* ── Rhythms: petrol field ── */}
      <section className="field-petrol" aria-labelledby="styles-heading">
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
              className="inline-block rounded-full bg-noche px-7 py-3.5 font-bold text-crudo transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none"
            >
              {t("home.styles.cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Method: crudo field ── */}
      <section className="field-crudo" aria-labelledby="method-heading">
        <RuffleDivider from="petrol" />
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
                  <dt className="display-mid text-xl">
                    {t(`home.method.points.${key}.title`)}
                    <svg width="52" height="8" viewBox="0 0 52 8" aria-hidden="true" className="mt-1.5 block">
                      <path d="M1 6 Q 7.5 0 14 6 T 27 6 T 40 6 T 53 6" fill="none" stroke="var(--color-petrol)" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </dt>
                  <dd className="muted mt-2 leading-relaxed">{t(`home.method.points.${key}.body`)}</dd>
                </Reveal>
              ))}
            </dl>
          </div>

          {/* Benefits — what dance gives you (photo medallions) */}
          <div className="mt-16 sm:mt-20">
            <Reveal>
              <h3 className="display text-3xl sm:text-4xl">{t("home.benefits.heading")}</h3>
            </Reveal>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
              {BENEFITS.map(([key, assetId], i) => {
                const asset = (manifest.assets as MediaAsset[]).find((a) => a.id === assetId);
                return (
                  <Reveal as="li" key={key} beats={i} className="flex flex-col items-center text-center">
                    {asset && (
                      <div className="h-28 w-28 overflow-hidden rounded-full sm:h-36 sm:w-36 [&_img]:h-full [&_img]:w-full [&_img]:rounded-full [&_img]:object-cover [&>picture]:block [&>picture]:h-full [&>picture]:w-full">
                        <MediaTile asset={asset} locale={locale} sizes="9rem" className="!aspect-square" />
                      </div>
                    )}
                    <p className="display-mid mt-4 text-lg">{t(`home.benefits.items.${key}.title`)}</p>
                    <p className="muted mt-0.5 text-sm">{t(`home.benefits.items.${key}.line`)}</p>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Kids: lima field ── */}
      <section className="field-lima" aria-labelledby="kids-heading">
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
              className="inline-block rounded-full bg-noche px-7 py-3.5 font-bold text-lima transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none"
            >
              {t("home.kids.cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Gallery teaser: noche field ── */}
      <section className="field-noche" aria-labelledby="gallery-heading">
        <RuffleDivider from="lima" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="gallery-heading" className="display text-4xl sm:text-6xl">
              {t("home.gallery.heading")}
            </h2>
            <Link
              to={pathFor("gallery", locale)}
              className="font-semibold text-lima underline underline-offset-4 hover:text-crudo"
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

      {/* ── Final CTA: petrol field ── */}
      <section className="field-petrol" aria-labelledby="cta-heading">
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
              className="rounded-full bg-noche px-8 py-4 text-lg font-bold text-crudo transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none"
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
  const title = t("home.hero.title");
  // Words wrap; letters inside a word never do (letter spans are the groove unit).
  const words = title.split(" ").map((w) => Array.from(w));

  // Calm principle: hero text is ALWAYS visible — no entrance opacity, no
  // hydration swap. The only motion is the endless, gentle letter groove.
  return (
    <section className="field-noche relative flex min-h-svh flex-col justify-center overflow-hidden">
      <FlowField />
      {/* A window into the studio: a large soft-edged video card laid into the
          current — slightly rotated like a card in the stream, graded toward the
          lagoon palette, floating on the same slow pulse as the hems. Trails pass
          behind it (FlowField) AND in front of it (the overlay svg below), so the
          field weaves around it. Decorative: muted loop, still frame under
          reduced motion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-7%] top-[3%] z-[1] w-32 rotate-[-2.5deg] sm:right-[6%] sm:top-1/2 sm:w-[clamp(250px,26vw,370px)] sm:-translate-y-[56%]"
      >
        <div className="float-slow">
          <div className="relative aspect-[9/15] overflow-hidden rounded-[1.8rem] shadow-lift ring-1 ring-crudo/15 sm:rounded-[2.2rem]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              tabIndex={-1}
            >
              <source src={assetUrl("/media/showreel-01.mp4")} type="video/mp4" />
            </video>
            {/* lagoon grade + edge vignette sink it into the night */}
            <div className="absolute inset-0 bg-petrol/35 mix-blend-color" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgb(6_42_53/0.5)_100%)]" />
          </div>
        </div>
      </div>
      {/* front currents: three of the field's own lines re-drawn above the card */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 z-[2] hidden h-full w-full sm:block"
        focusable="false"
      >
        {sheafPaths(1)
          .filter((p) => [17, 20, 23].includes(p.id))
          .map((p) => (
            <path
              key={p.id}
              d={p.d}
              stroke={trailColor(p.id)}
              strokeWidth={p.width}
              strokeOpacity={p.opacity * 0.9}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        <path
          className="trail-runner"
          d={sheafPaths(1)[20].d}
          pathLength={1}
          fill="none"
          stroke="var(--color-crudo)"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ "--runner-o": 0.4, "--runner-dur": "27s", "--runner-delay": "-9s" } as React.CSSProperties}
        />
      </svg>
      {/* local scrim so hero copy stays readable where trails cross it */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/4 h-3/5 bg-[linear-gradient(100deg,rgb(6_42_53/0.85)_0%,rgb(6_42_53/0.55)_45%,transparent_72%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-24 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-lima">{t("home.hero.count")}</p>

        <h1
          className="display mt-5 text-[min(10.4vw,8rem)] leading-[0.92] md:text-[min(8.6vw,9.5rem)]"
          aria-label={title}
        >
          <span aria-hidden="true">
            {words.map((letters, w) => (
              <span key={w} className="inline-block whitespace-nowrap">
                {letters.map((ch, i) => (
                  <span
                    key={i}
                    className="groove"
                    style={{ "--groove-delay": `${((w * 6 + i) * 0.17).toFixed(2)}s` } as React.CSSProperties}
                  >
                    {ch}
                  </span>
                ))}
                {w < words.length - 1 && " "}
              </span>
            ))}
          </span>
        </h1>

        <p className="lead mt-7 max-w-xl text-crudo">{t("home.hero.subtitle")}</p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href={waLink(t("whatsapp.prefill"))}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-lima px-8 py-4 text-lg font-bold text-noche shadow-lift transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none"
          >
            {t("home.hero.ctaPrimary")}
          </a>
          <Link
            to={pathFor("classes", locale)}
            className="rounded-full border-2 border-crudo/40 px-7 py-3.5 font-bold text-crudo transition-colors hover:border-lima hover:text-lima"
          >
            {t("home.hero.ctaSecondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
