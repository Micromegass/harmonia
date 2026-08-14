# DECISIONS.md — append-only log

Format: date · decision · rationale · verify.

## 2026-08-13 — Kickoff

- **2026-08-13 · Stack: React Router v7 framework mode (Vite) + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion (`motion`).** Rationale: brief requires React+Vite+TS *and* real pre-rendered HTML for every route in both locales (SEO phase explicitly authorizes switching the React setup to get SSG). RR7 `prerender` gives static HTML per route with zero-config Vercel deploys. Verify: nothing — structural.
- **2026-08-13 · i18n: route-based `/es/...` + `/en/...` with react-i18next; JSON files in `app/i18n/`.** Spanish (Colombian) default + SEO priority. Root `/` detects browser language, redirects, persists choice in localStorage. Verify: nothing.
- **2026-08-13 · Contact form endpoint: Web3Forms.** Rationale over Formspree: free tier has unlimited submissions (Formspree free caps at 50/mo), no Web3Forms branding requirement on free tier, access key is designed to be client-side public, simple JSON POST. Key still lives in `VITE_WEB3FORMS_KEY`. **Verify: client must create a free Web3Forms access key with her email and set it in Vercel env vars — until then the form falls back to WhatsApp/mailto.**
- **2026-08-13 · No analytics shipped.** Best outcome per brief: no third-party scripts → no consent banner needed beyond form consent; faster, more private. Verify: if she later wants stats, add a cookieless tool (e.g. Plausible) + cookie policy update.
- **2026-08-13 · WhatsApp number is a placeholder** (`VITE_WHATSAPP_NUMBER`, format `57XXXXXXXXXX`). **Verify: client must provide her real WhatsApp business number.**
- **2026-08-13 · Git identity set to repo-local micromegas/axelbraunschweiger@gmail.com** (global git identity was unset). Verify: fine unless she wants her own identity on history.

## 2026-08-13 — Phase 0.5: Instagram & media

- **2026-08-13 · Automated Instagram retrieval failed (expected).** Anonymous profile fetch returns the login shell; the `web_profile_info` API rejects anonymous calls; @harmonia.baila is not indexed anywhere else on the web (searched). Per brief: fell back immediately — full pipeline built (`scripts/process-media.mjs`, manifest, `npm run media`), branded placeholders ship, `MEDIA.md` documents the manual export route. Verify: client runs Instagram "Download your information" export and drops files per MEDIA.md.
- **2026-08-13 · No logo could be retrieved → designed a typographic wordmark ("Harmonia Baila") + palette from scratch,** aimed at warm Colombian dance energy. Verify: client may supply her real logo; swap in `app/components/` and re-derive tokens if she has one.
- **2026-08-13 · Style list assumed: salsa, bachata (confirmed by user prompt) + urbano, ritmos tropicales (cumbia/merengue), baile infantil, contemporáneo (plausible for a university-trained dancer in Medellín).** All marked as placeholder content. Verify: confirm exact styles taught.
- **2026-08-13 · ffmpeg not installed on this machine** — video branch of the pipeline copies uncompressed with a warning until `brew install ffmpeg`. Verify: install ffmpeg before processing real video.

## 2026-08-13 — Design direction (Phase 1)

- **2026-08-13 · Committed world: "La Falda" — the pollera skirt in motion** (impeccable concept roll, seed cf667dc0, assigned grounded candidate 7 of 7). Drenched fabric fields (noche/fucsia/crudo/sol) with scalloped ruffle hems, ribbon-trail hero, Archivo (Omnibus-Type) expanded-black poster type, all motion quantized to a 140ms 8-count. Challengers weighed and rejected on audience identification. Recorded in DESIGN.md + contract comment in built HTML. Verify: nothing — this is the site's identity now; don't relitigate per page.
- **2026-08-13 · impeccable's interview/decision-page steps substituted with brief-derived decisions** — the brief runs unattended and forbids questions. The visualize/comp-approval step was skipped because the only available image generation (Higgsfield) costs credits and the run may not spend money. Verify: if she dislikes the direction, a re-roll with her steer is cheap.
- **2026-08-13 · Finish review run inline (degraded mode)** — the impeccable finish-reviewer subagent type doesn't exist in this harness's agent registry; the skill's degraded in-thread pass was used instead. Disposition: **ship**; open ceiling items recorded in DESIGN.md.

## 2026-08-13 — Critique loop (Phase 6, three passes)

- **Pass 1 (home/hero):** found — mobile headline broke mid-word ("¿BAILA/MOS?"), hero subtitle unreadable over ribbons, ribbons clipped hard at hero edge + collided with scroll hint, prerendered HTML hid content for no-JS/pre-hydration visitors. Fixed: word-level wrap spans + fitted type scale (a `text-wrap: balance` vs `white-space: nowrap` cascade bug was the root cause), hero scrim + full-contrast subtitle, gradient mask fade on ribbons, `html:not(.js)` + reduced-motion CSS overrides forcing content visible.
- **Pass 2 (inner pages):** found — gallery placeholder labels overflowed on long style names, contemporáneo placeholder read washed-gray against the world, schedule's final CTA field was a bare button. Fixed all three; added 30-check Playwright functional sweep (redirects, switcher, direct loads, 404 status, form validation, honeypot, lightbox keyboard, reduced motion) — all pass.
- **Pass 3 (a11y/perf/taste):** found — `dl` structure invalid on home, logo link accessible-name mismatch, LCP waited for hydration, dual font preload contention; taste pre-flight flagged em-dashes throughout copy + hero scroll cue (banned tells). Fixed: a11y 100 both locales, hero mounts static then animates, single font preload, LazyMotion bundle, zero em-dashes in visible copy, scroll cue removed.
- **Lighthouse (local gzip server, both locales): desktop 100/100/100/100; mobile-emulated 87/100/100/100** (FCP 2.9s/LCP 3.3s on simulated slow-4G moto G). The remaining mobile-perf gap is the React runtime + font on a throttled connection; CLS 0, TBT 0. Production Vercel (brotli, CDN edge, immutable caching) should land slightly higher. Documented rather than chased further — the next real win would be dropping client-side hydration entirely, which the stack mandate (React SPA + Framer Motion) precludes. `npx impeccable detect`: zero findings.

## 2026-08-13 — Brand recolor + La Bailarina (client feedback round 1)

- **2026-08-13 · Client supplied the real logo** (white badge + petrol/teal/chartreuse; script "harmonia"; tagline "Bailar encanta"; the initial is a line-drawn dancer). Entire color system reworked to the sampled palette: petrol #035668→fields, teal #306F88→ribbons/tints, script green→lima #A8BC42 CTAs, ivory. The La Falda world (fields, ruffles, 8-count) is retained, re-inked. Old fucsia/sol tokens removed. Form errors use an out-of-family #B23A2E on purpose (usability beats palette purity). Verify: client approves the lagoon look.
- **2026-08-13 · Logo integrated as webp** (badge circle-cropped from logo-1; wide lockup cropped from the logo-2 screenshot; favicon + apple-touch-icon derived). logo-2 is a low-res phone screenshot — ask the client for the original vector/PNG logo files to replace `public/media/logo-*.webp` at higher quality. Verify: get original logo files.
- **2026-08-13 · Hero wow effect: La Bailarina** — the logo's dancer glyph brought to life as a continuous-line figure that draws herself in like a signature, then dances on the 8-count (pose-morphing paths, teal ghost echoes as motion trails, skirt strokes in lima/teal). Static under reduced motion. Naive line style is deliberate: it matches the logo glyph's own hand.
- **2026-08-13 · "Bailar encanta" adopted as the brand motto** across footer, OG cards and about; kept in Spanish on the EN site as a brand mark (translated in parentheses once in the footer).
- **2026-08-13 · GitHub remote added** (github.com/Micromegass/harmonia) per client instruction; push + deploy on completion.

## 2026-08-13 — Client feedback round 3 (hero rework + flow polish)

- **2026-08-13 · The figurative dancer is gone.** Client disliked the line-figure animation in both incarnations. Replaced with **Estela**: a silk-trail flow field (52 thin lines in two mirrored sheaves, teal/lima/ivory, perpetually drawing/releasing along their curves) inspired by the most-liked flowing-paths pattern on 21st.dev (client-provided inspiration link), recomposed for the brand palette and viewport framing. Bailarina.tsx deleted.
- **2026-08-13 · The headline is now the dancer**: after the count entrance, each letter of "¿Bailamos?" grooves on an endless, subtle 8-count loop with per-letter phase offset.
- **2026-08-13 · Section dividers visibly animate now**: the client couldn't perceive the previous subtle breathe, so hems roll sideways in a seamless travel loop (240px period) plus a stronger depth breathe; in-view gated, reduced-motion static.
- **2026-08-13 · Senior polish pass**: tactile press states (active:scale-95) on all pill CTAs and the WhatsApp button; desktop nav links get an underline that grows in on hover/focus and stays on the active page.

## 2026-08-14 — Client feedback round 4 (calm / harmony)

- **2026-08-14 · Design principle made explicit: HARMONY.** Everything moves slowly, in phase, nothing competes; animation periods are harmonic multiples of one musical bar (1.12s): letter groove 3 bars, divider breathe 4 bars, divider travel 8 bars, trails 26-44s.
- **2026-08-14 · Hero text never hides.** All entrance opacity animations removed from the hero (they caused the visible disappear/reappear at hydration). The headline is always visible; its only motion is the endless gentle per-letter groove, now pure CSS.
- **2026-08-14 · Flicker eliminated in Estela.** Root cause found and fixed: framer hijacks `pathLength` on m.path and rewrites dash styles (also causing a React hydration-mismatch warning), and the old pathOffset cycle made lines vanish at the end of each pass. Rewritten framer-free: each line is a long CSS dash (0.82/0.18) drifting by exactly one period per loop at constant opacity — a seamless current, nothing ever pops. 52 animations now cost zero main-thread work.
- **2026-08-14 · Hydration warning fixed** (`suppressHydrationWarning` scoped to <html>, whose class the progressive-enhancement script mutates pre-hydration). Console is clean again.
- **2026-08-14 · Inline code review** (the /code-review subagents hit the session usage limit): pruned dead exports (swingIn/countIn/SPRING), verified reduced-motion freezes, hydration-stable deterministic jitter, seamless divider period under preserveAspectRatio=none, no var-name collisions with the no-JS opacity overrides.

## 2026-08-14 — Client references adopted (claudiacadena.com, beacademy.com.co)

- **2026-08-14 · Reference analysis** (both are Wix sites; we keep our concept). Adopted three patterns: (1) **"Agenda tu clase de prueba" trial-class CTA** (Claudia Cadena) replaces the generic WhatsApp label on home hero + final CTA and in the WhatsApp prefill — concrete offers convert; (2) **benefits section** (Be Academy's "beneficios que transforman vidas"): five photo medallions on home — Confianza/Alegría/Disciplina/Comunidad/Expresión; (3) **real photography everywhere** — see below. NOT adopted: testimonials (we never invent them), blog, multi-sede structure (single studio).
- **2026-08-14 · Placeholder photos/videos installed through the real pipeline** so the client sees the final look: 10 photos + 2 SD videos from **Pexels (free license, no attribution required)**, downloaded to media-raw/ under the manifest filenames and processed via `npm run media` (AVIF/WebP variants + blur-ups). **These are temporary stand-ins: every one should be replaced by her real class photos/videos via the exact same drop-in flow (MEDIA.md).** Files: salsa-pareja-01, salsa-giro-02, bachata-clase-01, bachata-sensual-02, urbano-grupo-01, urbano-solo-02, tropical-cumbia-01, kids-clase-01, contemporaneo-solo-01, profesora-01, showreel-01/02.
- **2026-08-14 · About page portrait slot now uses profesora-01** (stock stand-in for her real portrait). Video pipeline still copies uncompressed (no ffmpeg) — SD sources are ~2MB each so acceptable; install ffmpeg when her real videos arrive.

## TODO: confirm with client

- WhatsApp number (env var `VITE_WHATSAPP_NUMBER`).
- Web3Forms access key created under her email (env var `VITE_WEB3FORMS_KEY`).
- Exact class schedule (Horarios page ships clearly-marked placeholder times).
- Exact address / neighborhood (JSON-LD geo + local SEO use approximate Medellín center until confirmed).
- Full list of styles taught (site ships: salsa, bachata + others gathered from Instagram; confirm).
- Prices — **not published anywhere** (never invented); site says "contact for pricing".
- **Trial-class offer**: the site now invites visitors to "agendar una clase de prueba" — confirm she offers one (free or paid) and adjust wording if needed.
- **All Pexels placeholder photos/videos must be replaced with her real media before/at launch** (they are generic stock, not her studio).
- Legal identity fields: razón social, NIT, domicilio, contact email (placeholders in legal pages).
- **Image rights: she must confirm she has consent for any identifiable students in photos/videos, especially minors, before launch.**
