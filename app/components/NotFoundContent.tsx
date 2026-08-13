import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { pathFor, resolvePath, type Locale } from "../i18n/routing";
import i18n, { syncLocale } from "../i18n/config";

/** Localized 404 body — used by the catch-all route and the root ErrorBoundary. */
export function NotFoundContent() {
  const location = useLocation();
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";
  syncLocale(locale);
  const { t } = useTranslation();
  const otherLocale: Locale = locale === "es" ? "en" : "es";

  return (
    <div className="field-noche relative grid min-h-svh place-items-center overflow-hidden px-6 text-center">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full opacity-40" focusable="false">
          <path d="M-100,600 C300,480 600,720 1000,580 C1240,500 1400,620 1560,540" fill="none" stroke="var(--color-fucsia)" strokeWidth="70" strokeLinecap="round" />
          <path d="M-100,500 C350,400 650,600 1100,470 C1300,410 1440,500 1560,440" fill="none" stroke="var(--color-sol)" strokeWidth="26" strokeLinecap="round" />
        </svg>
      </div>
      <div className="relative">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-sol">{t("notFound.count")}</p>
        <h1 className="display mt-4 text-5xl sm:text-7xl">{t("notFound.heading")}</h1>
        <p className="lead muted mx-auto mt-6">{t("notFound.body")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={pathFor("home", locale)}
            className="rounded-full bg-fucsia px-7 py-3.5 font-bold text-crudo transition-colors hover:bg-fucsia-deep"
          >
            {t("notFound.cta")}
          </Link>
          <Link to={pathFor("home", otherLocale)} className="font-semibold text-crudo underline underline-offset-4 hover:text-sol">
            {otherLocale === "en" ? "English version" : "Versión en español"}
          </Link>
        </div>
      </div>
    </div>
  );
}
