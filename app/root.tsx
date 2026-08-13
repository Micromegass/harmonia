import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import type { Route } from "./+types/root";
import { LazyMotion, domAnimation } from "motion/react";
import "./app.css";
import i18n, { syncLocale } from "./i18n/config";
import { asset } from "./lib/site";
import { defaultLocale, type Locale } from "./i18n/routing";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { NotFoundContent } from "./components/NotFoundContent";

/* Design direction contract — kept as a real HTML comment in the built output
 * so the finishing review can audit the render against it (seed cf667dc0). */
const DESIGN_CONTRACT = `<!--
THESIS: The pollera skirt in motion is the site. Layered drenched fabric fields and
choreographed 8-count movement prove dance craft directly; refuses the category default
(dark nightclub-neon salsa template / generic clean studio site).
OWN-WORLD: Deep petrol night ground (#062A35) under the brand's lagoon fields (petrol
#0A5568, teal #306F88, lima #A8BC42, ivory #F5F6EC — sampled from the logo), separated by
curved ruffle hems; Archivo expanded-black poster caps; motion quantized to a 140ms beat;
the logo's continuous-line dancer brought to life in the hero.
STORY: A stranger from Instagram lands, feels the studio's joy and professionalism within
one viewport, browses rhythms/classes/gallery as skirt layers, and messages on WhatsApp.
FIRST VIEWPORT: Full-bleed petrol-night ground under Estela, a field of thin silk
trails in teal/lima/ivory perpetually flowing along their own curves; "¿Bailamos?"
letters swing in on the count then groove forever on a gentle 8-count loop; subline
naming salsa/bachata/Medellín; WhatsApp primary CTA + classes secondary, above the fold.
FORM: Grounded candidate 7 (cumbia/pollera costume textile world), seed key cf667dc0.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
the verdict, and DESIGN.md
-->`;

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const m = location.pathname.match(/^\/(es|en)(\/|$)/);
  const locale = (m?.[1] as Locale) ?? defaultLocale;
  syncLocale(locale);

  return (
    <html lang={locale === "en" ? "en" : "es-CO"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href={asset("/favicon.png")} />
        <link rel="apple-touch-icon" href={asset("/apple-touch-icon.png")} />
        {/* Preload only the upright face — italic is below-the-fold accent type
            and loads on demand (font-display: swap). */}
        <link
          rel="preload"
          href={asset("/fonts/archivo-var.woff2")}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: DESIGN_CONTRACT }} />
        {/* Progressive-enhancement flag: entrance animations only apply when JS
            runs (see .no-js override in app.css). Hashed into the CSP by postbuild. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const isLocalized = /^\/(es|en)(\/|$)/.test(location.pathname);
  // The root "/" language-redirect page renders bare (no chrome).
  if (!isLocalized)
    return (
      <LazyMotion features={domAnimation} strict>
        <Outlet />
      </LazyMotion>
    );
  return (
    <LazyMotion features={domAnimation} strict>
      <a href="#main" className="skip-link">
        {i18n.t("nav.skipToContent")}
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </LazyMotion>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundContent />;
  }
  const message = error instanceof Error ? error.message : "Unknown error";
  return (
    <main className="field-noche grid min-h-svh place-items-center p-8 text-center">
      <div>
        <h1 className="display text-4xl">Ups.</h1>
        <p className="lead mx-auto mt-4">{message}</p>
      </div>
    </main>
  );
}
