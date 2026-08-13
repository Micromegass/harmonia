import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { alternatePath, pathFor, resolvePath, LOCALE_STORAGE_KEY, type Locale, type PageKey } from "../i18n/routing";
import { BEAT, EASE_DANCE } from "./motion";

const NAV_PAGES: PageKey[] = ["about", "classes", "schedule", "gallery", "contact"];

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const locale = (resolvePath(location.pathname)?.locale ?? "es") as Locale;
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  // Close the menu on navigation; lock scroll while open.
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const persist = (l: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* storage unavailable — harmless */
    }
  };

  const otherLocale: Locale = locale === "es" ? "en" : "es";

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-8">
        <Link
          to={pathFor("home", locale)}
          className="flex items-center gap-2.5"
        >
          <img src="/media/logo-badge-360.webp" alt="" className="h-10 w-10 rounded-full" width="40" height="40" />
          <span className="display-mid text-base leading-none tracking-tight text-crudo sm:text-lg">
            Harmonia<span className="text-lima">·</span>Baila
          </span>
        </Link>

        <nav aria-label={t("nav.home")} className="hidden items-center gap-6 md:flex">
          {NAV_PAGES.map((page) => (
            <NavLink
              key={page}
              to={pathFor(page, locale)}
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-wide transition-colors hover:text-lima ${
                  isActive ? "text-lima" : "text-crudo"
                }`
              }
            >
              {t(`nav.${page === "about" ? "about" : page}`)}
            </NavLink>
          ))}
          <LangSwitch locale={locale} otherLocale={otherLocale} onSwitch={persist} pathname={location.pathname} />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <LangSwitch locale={locale} otherLocale={otherLocale} onSwitch={persist} pathname={location.pathname} />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-crudo/40 text-crudo"
          >
            <span className="sr-only">{open ? t("nav.menuClose") : t("nav.menuOpen")}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              ) : (
                <path d="M2 5.5h16M2 10h16M2 14.5h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-menu"
            aria-label={t("nav.menuOpen")}
            initial={reduced ? { opacity: 0 } : { clipPath: "circle(0% at 92% 5%)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "circle(150% at 92% 5%)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "circle(0% at 92% 5%)", transition: { duration: BEAT * 2 } }}
            transition={{ duration: BEAT * 4, ease: [...EASE_DANCE] }}
            className="field-petrol fixed inset-0 z-50 flex flex-col justify-center gap-1 px-8 md:hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border-2 border-noche/30 text-noche"
            >
              <span className="sr-only">{t("nav.menuClose")}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
            {(["home", ...NAV_PAGES] as PageKey[]).map((page, i) => (
              <m.div
                key={page}
                initial={reduced ? false : { opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: BEAT * (i + 1), duration: BEAT * 3, ease: [...EASE_DANCE] }}
              >
                <NavLink
                  to={pathFor(page, locale)}
                  className={({ isActive }) =>
                    `display block py-2 text-4xl ${isActive ? "text-crudo" : "text-noche"}`
                  }
                >
                  {t(`nav.${page}`)}
                </NavLink>
              </m.div>
            ))}
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function LangSwitch({
  locale,
  otherLocale,
  pathname,
  onSwitch,
}: {
  locale: Locale;
  otherLocale: Locale;
  pathname: string;
  onSwitch: (l: Locale) => void;
}) {
  const { t } = useTranslation();
  return (
    <Link
      to={alternatePath(pathname, otherLocale)}
      onClick={() => onSwitch(otherLocale)}
      className="rounded-full border-2 border-crudo/40 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-crudo transition-colors hover:border-lima hover:text-lima"
      aria-label={t("langSwitcher.switchTo")}
    >
      <span aria-hidden="true">{locale === "es" ? "EN" : "ES"}</span>
    </Link>
  );
}
