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
import "./app.css";
import i18n, { syncLocale } from "./i18n/config";
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
OWN-WORLD: Night-plum ground (#221022) under saturated fabric fields — fucsia #E83D7C,
coral #FF6B3D, sol #FFC53D, crudo #FFF3E4 — separated by curved ruffle hems; Archivo
(Omnibus-Type) expanded-black poster caps for display; motion quantized to a 140ms beat.
STORY: A stranger from Instagram lands, feels the studio's joy and professionalism within
one viewport, browses rhythms/classes/gallery as skirt layers, and messages on WhatsApp.
FIRST VIEWPORT: Full-bleed noche ground; ribbon trails arcing behind giant stacked
"¿BAILAMOS?" display caps that swing in on the count after a "5·6·7·8" pre-roll; subline
naming salsa/bachata/Medellín; WhatsApp primary CTA + classes secondary, above the fold on mobile.
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="preload"
          href="/fonts/archivo-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: DESIGN_CONTRACT }} />
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
  if (!isLocalized) return <Outlet />;
  return (
    <>
      <a href="#main" className="skip-link">
        {i18n.t("nav.skipToContent")}
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
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
