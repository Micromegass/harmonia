import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { defaultLocale, LOCALE_STORAGE_KEY, locales, type Locale } from "../i18n/routing";
import { SITE_ORIGIN } from "../lib/site";

export function meta() {
  return [
    { title: "Harmonia Baila — Medellín" },
    { name: "robots", content: "noindex" },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/es` },
  ];
}

/** Root "/": detect the visitor's language once, persist it, redirect.
 *  Static-host friendly (client-side), CSP-safe (no inline script), and the
 *  <noscript>/prerender fallback shows both language doors. */
export default function LanguageRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    let target: Locale = defaultLocale;
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === "es" || stored === "en") {
        target = stored;
      } else {
        const nav = navigator.languages?.[0] ?? navigator.language ?? "";
        target = nav.toLowerCase().startsWith("en") ? "en" : "es";
        localStorage.setItem(LOCALE_STORAGE_KEY, target);
      }
    } catch {
      /* storage unavailable → default locale */
    }
    navigate(`/${target}`, { replace: true });
  }, [navigate]);

  return (
    <main className="field-noche grid min-h-svh place-items-center px-6 text-center">
      <div>
        <img src="/media/logo-badge-360.webp" alt="Harmonia" className="mx-auto h-24 w-24 rounded-full" width="96" height="96" />
        <p className="display-mid mt-5 text-2xl text-crudo">
          Harmonia<span className="text-lima">·</span>Baila
        </p>
        <nav aria-label="Idioma / Language" className="mt-8 flex items-center justify-center gap-6">
          {locales.map((l) => (
            <Link
              key={l}
              to={`/${l}`}
              className="rounded-full border-2 border-crudo/40 px-6 py-3 font-bold uppercase tracking-widest text-crudo hover:border-lima hover:text-lima"
            >
              {l === "es" ? "Español" : "English"}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
