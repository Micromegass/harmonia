# DECISIONS.md — append-only log

Format: date · decision · rationale · verify.

## 2026-08-13 — Kickoff

- **2026-08-13 · Stack: React Router v7 framework mode (Vite) + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion (`motion`).** Rationale: brief requires React+Vite+TS *and* real pre-rendered HTML for every route in both locales (SEO phase explicitly authorizes switching the React setup to get SSG). RR7 `prerender` gives static HTML per route with zero-config Vercel deploys. Verify: nothing — structural.
- **2026-08-13 · i18n: route-based `/es/...` + `/en/...` with react-i18next; JSON files in `app/i18n/`.** Spanish (Colombian) default + SEO priority. Root `/` detects browser language, redirects, persists choice in localStorage. Verify: nothing.
- **2026-08-13 · Contact form endpoint: Web3Forms.** Rationale over Formspree: free tier has unlimited submissions (Formspree free caps at 50/mo), no Web3Forms branding requirement on free tier, access key is designed to be client-side public, simple JSON POST. Key still lives in `VITE_WEB3FORMS_KEY`. **Verify: client must create a free Web3Forms access key with her email and set it in Vercel env vars — until then the form falls back to WhatsApp/mailto.**
- **2026-08-13 · No analytics shipped.** Best outcome per brief: no third-party scripts → no consent banner needed beyond form consent; faster, more private. Verify: if she later wants stats, add a cookieless tool (e.g. Plausible) + cookie policy update.
- **2026-08-13 · WhatsApp number is a placeholder** (`VITE_WHATSAPP_NUMBER`, format `57XXXXXXXXXX`). **Verify: client must provide her real WhatsApp business number.**
- **2026-08-13 · Git identity set to repo-local micromegas/axelbraunschweiger@gmail.com** (global git identity was unset). Verify: fine unless she wants her own identity on history.

## TODO: confirm with client

- WhatsApp number (env var `VITE_WHATSAPP_NUMBER`).
- Web3Forms access key created under her email (env var `VITE_WEB3FORMS_KEY`).
- Exact class schedule (Horarios page ships clearly-marked placeholder times).
- Exact address / neighborhood (JSON-LD geo + local SEO use approximate Medellín center until confirmed).
- Full list of styles taught (site ships: salsa, bachata + others gathered from Instagram; confirm).
- Prices — **not published anywhere** (never invented); site says "contact for pricing".
- Legal identity fields: razón social, NIT, domicilio, contact email (placeholders in legal pages).
- **Image rights: she must confirm she has consent for any identifiable students in photos/videos, especially minors, before launch.**
