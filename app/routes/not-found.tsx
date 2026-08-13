import { NotFoundContent } from "../components/NotFoundContent";
import { SITE_ORIGIN } from "../lib/site";

export function meta({ location }: { location: { pathname: string } }) {
  const en = location.pathname.startsWith("/en");
  return [
    { title: en ? "Page not found — Harmonia Baila" : "Página no encontrada — Harmonia Baila" },
    { name: "robots", content: "noindex" },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/es` },
  ];
}

export default function NotFound() {
  return <NotFoundContent />;
}
