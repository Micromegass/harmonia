import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { locales, pageSlugs, pathFor, type PageKey } from "./i18n/routing";

const pageModules: Record<PageKey, string> = {
  home: "routes/home.tsx",
  about: "routes/about.tsx",
  classes: "routes/classes.tsx",
  schedule: "routes/schedule.tsx",
  gallery: "routes/gallery.tsx",
  contact: "routes/contact.tsx",
  dataPolicy: "routes/legal-data-policy.tsx",
  privacyNotice: "routes/legal-privacy-notice.tsx",
  terms: "routes/legal-terms.tsx",
  cookies: "routes/legal-cookies.tsx",
};

export default [
  index("routes/language-redirect.tsx"),
  ...(Object.keys(pageSlugs) as PageKey[]).flatMap((page) =>
    locales.map((locale) =>
      route(pathFor(page, locale).slice(1), pageModules[page], { id: `${locale}-${page}` }),
    ),
  ),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
