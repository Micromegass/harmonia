import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { pathFor, resolvePath, type Locale, type PageKey } from "../i18n/routing";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../lib/site";

const NAV_PAGES: PageKey[] = ["home", "about", "classes", "schedule", "gallery", "contact"];
const LEGAL_PAGES: { page: PageKey; key: string }[] = [
  { page: "dataPolicy", key: "dataPolicy" },
  { page: "privacyNotice", key: "privacyNotice" },
  { page: "terms", key: "terms" },
  { page: "cookies", key: "cookies" },
];

export function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const locale = (resolvePath(location.pathname)?.locale ?? "es") as Locale;

  return (
    <footer className="field-noche border-t border-crudo/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <img src="/media/logo-badge-360.webp" alt={t("brand.logoAlt")} className="h-16 w-16 rounded-full" width="64" height="64" />
          <p className="display-mid mt-4 text-xl text-crudo">
            Harmonia<span className="text-lima">·</span>Baila
          </p>
          <p className="muted mt-3 max-w-xs text-sm leading-relaxed">{t("footer.tagline")}</p>
        </div>
        <nav aria-label={t("footer.navHeading")}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-lima">{t("footer.navHeading")}</h2>
          <ul className="mt-4 space-y-2">
            {NAV_PAGES.map((page) => (
              <li key={page}>
                <Link to={pathFor(page, locale)} className="text-sm text-crudo transition-colors hover:text-lima">
                  {t(`nav.${page}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t("footer.legalHeading")}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-lima">{t("footer.legalHeading")}</h2>
          <ul className="mt-4 space-y-2">
            {LEGAL_PAGES.map(({ page, key }) => (
              <li key={page}>
                <Link to={pathFor(page, locale)} className="text-sm text-crudo transition-colors hover:text-lima">
                  {t(`footer.legal.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-lima">{t("footer.followHeading")}</h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-crudo transition-colors hover:text-lima"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.3" cy="6.7" r="1.3" fill="currentColor" />
            </svg>
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
      <div className="border-t border-crudo/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-xs sm:px-8">
          <p className="muted">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p className="muted">{t("footer.madeIn")}</p>
        </div>
      </div>
    </footer>
  );
}
