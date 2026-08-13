import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { pathFor, type Locale } from "../i18n/routing";
import { breadcrumbJsonLd, metaFor } from "../lib/seo";
import { INSTAGRAM_URL } from "../lib/site";
import { BEAT, EASE_DANCE } from "../components/motion";
import { Reveal } from "../components/Reveal";
import { RuffleDivider } from "../components/RuffleDivider";
import { JsonLd } from "../components/JsonLd";
import { MediaTile, type MediaAsset } from "../components/MediaTile";
import manifest from "../content/media.manifest.json";

export const meta = metaFor("gallery");

export default function Gallery() {
  const { t } = useTranslation();
  const location = useLocation();
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";
  const reduced = useReducedMotion();

  const assets = manifest.assets as MediaAsset[];
  const images = assets.filter((a) => a.type === "image");
  const videos = assets.filter((a) => a.type === "video");
  const styleTags = manifest.styles.filter((s) => images.some((a) => a.styleTag === s));

  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? images : images.filter((a) => a.styleTag === filter);

  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) => (cur === null ? null : (cur + dir + filtered.length) % filtered.length));
    },
    [filtered.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [lightbox, step]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t("nav.home"), path: pathFor("home", locale) },
          { name: t("nav.gallery"), path: pathFor("gallery", locale) },
        ])}
      />
      <section className="field-noche pt-32 sm:pt-36">
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <Reveal>
            <h1 className="display text-5xl sm:text-7xl">{t("gallery.heading")}</h1>
            <p className="lead muted mt-6 max-w-2xl">{t("gallery.intro")}</p>
          </Reveal>

          {images.some((a) => a.placeholder) && (
            <Reveal className="mt-6">
              <p className="inline-flex flex-wrap items-center gap-3 rounded-full bg-noche-2 px-5 py-3 text-sm">
                <span className="muted">{t("gallery.placeholderNote")}</span>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-sol underline underline-offset-4">
                  {t("gallery.igCta")}
                </a>
              </p>
            </Reveal>
          )}

          {/* Filters */}
          <div role="group" aria-label={t("gallery.filterLabel")} className="mt-10 flex flex-wrap gap-2.5">
            {["all", ...styleTags].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFilter(tag)}
                aria-pressed={filter === tag}
                className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                  filter === tag ? "bg-fucsia text-crudo" : "bg-noche-2 text-crudo hover:bg-fucsia/30"
                }`}
              >
                {tag === "all" ? t("gallery.filterAll") : t(`styles.${tag}.name`)}
              </button>
            ))}
          </div>

          {/* Grid */}
          <m.ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((asset, i) => (
                <m.li
                  key={asset.id}
                  initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                  transition={{ duration: BEAT * 2, ease: [...EASE_DANCE] }}
                >
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    className="block w-full cursor-zoom-in transition-transform hover:scale-[1.02] motion-reduce:transition-none"
                    aria-label={asset.alt[locale]}
                  >
                    <MediaTile asset={asset} locale={locale} sizes="(min-width: 768px) 33vw, 50vw" />
                  </button>
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>
        </div>
      </section>

      {/* Showreel */}
      <section className="field-fucsia" aria-labelledby="showreel-heading">
        <RuffleDivider from="noche" />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <h2 id="showreel-heading" className="display text-4xl sm:text-6xl">
              {t("gallery.showreelHeading")}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {videos.map((asset, i) => (
              <Reveal key={asset.id} beats={i * 2}>
                <MediaTile asset={asset} locale={locale} sizes="(min-width: 640px) 50vw, 100vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={filtered[lightbox].alt[locale]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: BEAT * 2 }}
            className="fixed inset-0 z-50 grid place-items-center bg-noche/95 p-4"
            onClick={() => setLightbox(null)}
          >
            <div className="relative max-h-[85svh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <MediaTile asset={filtered[lightbox]} locale={locale} sizes="90vw" className="max-h-[80svh]" />
              <p className="muted mt-3 text-center text-sm">{filtered[lightbox].alt[locale]}</p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-noche-2 text-crudo hover:bg-fucsia"
            >
              <span className="sr-only">{t("gallery.lightboxClose")}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-noche-2 text-crudo hover:bg-fucsia"
            >
              <span className="sr-only">{t("gallery.lightboxPrev")}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12.5 3.5 6 10l6.5 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-noche-2 text-crudo hover:bg-fucsia"
            >
              <span className="sr-only">{t("gallery.lightboxNext")}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7.5 3.5 14 10l-6.5 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
