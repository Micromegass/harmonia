import type { Config } from "@react-router/dev/config";
import { allPaths } from "./app/i18n/routing";

export default {
  // Fully static site: no server rendering at runtime, every route prerendered
  // to real HTML at build time (SEO requirement + Vercel free tier).
  ssr: false,
  prerender: allPaths(),
  // Subpath hosting (GitHub Pages preview); "/" for Vercel/root.
  basename: process.env.BASE_PATH ?? "/",
} satisfies Config;
