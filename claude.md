# CLAUDE.md — Harmonia Baila

## Project
Frontend-only marketing site for **Harmonia Baila**, a dance studio in Medellín, Colombia, owned by a professional (university-graduated) dancer. Instagram: **@harmonia.baila**. Teaches salsa, bachata + more styles; kids & adults; beginner→advanced; group & private. Site goal: attract students, be more credible/visible than Instagram alone. Bilingual: **Spanish (Colombian, default, SEO priority)** + English (expats/tourists).

## Stack & key decisions (don't relitigate — see DECISIONS.md for rationale)
- **React Router v8 framework mode** (Vite-based) + React 19 + TypeScript. `ssr: false` + `prerender` = fully static HTML per route in both locales → SEO + Vercel free tier, zero servers.
- **Tailwind CSS v4** (CSS-first config in `app/app.css` via `@theme`), **Framer Motion** (`motion` package) for all animation.
- **No backend, no database, no analytics.** Contact form posts to **Web3Forms**; fallback = WhatsApp + mailto.
- Route-based locales `/es/...` + `/en/...` with **localized slugs** (`/es/clases` ↔ `/en/classes`). Root `/` = prerendered chooser page that client-redirects (localStorage choice → navigator.language → `/es`). NOTE: `scripts/postbuild.mjs` mirrors the slug map — keep in sync with `app/i18n/routing.ts` (build fails loudly if a page is missing).
- i18n via **react-i18next**, strings in `app/i18n/es.json` + `app/i18n/en.json`. **Zero hardcoded strings in components.**

## Directory map
- `app/root.tsx` — document shell, WhatsApp button mount, i18n init
- `app/routes.ts` — all routes; same component file registered once per locale with distinct `id`
- `app/routes/` — page components (one file serves both locales; locale derived from URL)
- `app/components/` — shared UI (header, footer, WhatsApp button, media components…)
- `app/i18n/` — `es.json`, `en.json`, `config.ts`, `routing.ts` (slug maps, locale helpers)
- `app/content/media.manifest.json` — media metadata (see below)
- `public/media/` — processed self-hosted images/video; `media-raw/` (gitignored) — originals
- `scripts/` — `process-media.mjs` (sharp pipeline), other build helpers
- Legal pages live as normal routes under `/es/legal/*` + `/en/legal/*`
- Docs: `STATE.md` (handoff), `DECISIONS.md` (append-only log), `LEGAL-NOTES.md`, `MEDIA.md`

## Content model (bilingual copy)
- Every user-visible string lives in `app/i18n/{es,en}.json`, nested by page/section (e.g. `home.hero.title`).
- To add/edit a string: add the key to **both** files, use `t('key')` in the component. Missing keys fail loudly in dev (i18next `saveMissing` warn). Alt text and meta tags are also i18n keys.
- Slugs per locale are mapped in `app/i18n/routing.ts`; the language switcher uses that map to preserve the current page.

## Media pipeline
- Drop originals into `media-raw/` (gitignored), add an entry to `app/content/media.manifest.json`:
  `{ id, file, type: "image"|"video", styleTag, orientation, alt: {es, en}, caption?: {es, en} }`
- Run `npm run media` → sharp/ffmpeg generate AVIF/WebP srcset variants (+ blur placeholder) into `public/media/`, videos → compressed MP4 + poster.
- Naming: `<styleTag>-<slug>-<width>.<ext>`. Gallery + showreel read the manifest; nothing is hardcoded.
- Full instructions incl. Instagram bulk export: `MEDIA.md`.

## Commands
`npm run dev` · `npm run build` (static → `build/client/`) · `npm run preview` · `npm run typecheck` · `npm run media`

## Env vars (see `.env.example` for details)
`VITE_WHATSAPP_NUMBER` (57…, digits only) · `VITE_WEB3FORMS_KEY` (empty ⇒ form falls back) · `VITE_CONTACT_EMAIL` · `VITE_SITE_ORIGIN` (canonicals/sitemap)

## Conventions
- Components PascalCase, one component per file; route files kebab-case.
- Animation: use shared easing/duration tokens from `app/components/motion.ts`; scroll reveals via `whileInView`; **every** animation has a `prefers-reduced-motion` static fallback (`useReducedMotion`).
- Tailwind: design tokens (colors/fonts/spacing) defined once in `@theme` in `app/app.css`; no arbitrary hex values in components.
- External links: `target="_blank" rel="noopener noreferrer"`.
- SEO per route: `meta` export with localized title/description, canonical, hreflang (es/en/x-default), OG tags; JSON-LD via shared helper in `app/components/seo.ts`.

## Hard constraints
- Frontend-only. No backend, no DB, no server functions. Must stay deployable on **Vercel free tier** with the committed `vercel.json` untouched.
- No Instagram embeds — all media self-hosted. No third-party scripts (no analytics, no CDN fonts at runtime — fonts self-hosted).
- Never publish invented prices, certifications, or testimonials. Placeholders are marked and listed in DECISIONS.md.
- Secrets never committed; only `.env.example` ships.

## Pointers
Status & next steps → **STATE.md** · assumptions & client TODOs → **DECISIONS.md** · design system → **DESIGN.md** (+ PRODUCT.md) · legal research → **LEGAL-NOTES.md** · media workflow → **MEDIA.md**
