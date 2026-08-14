# DESIGN.md — La Falda (the skirt in motion) · lagoon inks

<!-- Documented from the built world after the finish review; seed cf667dc0.
     Recolored 2026-08-13 to the client's real logo palette (petrol/teal/lima/ivory). -->

## World

The pollera skirt in motion, painted in the brand's own inks. Layered drenched fields separated by scalloped ruffle hems; movement choreographed to a musical 8-count; a perpetual silk-trail field (Estela) filling the hero night. Refuses the category defaults (neon-nightclub salsa template, generic clean studio site).

## Tokens (source of truth: `@theme` in [app/app.css](app/app.css))

| Token | Value | Role |
| --- | --- | --- |
| `--color-noche` | `#062A35` | deep petrol night — primary ground |
| `--color-noche-2` | `#0C3B4A` | raised layer on noche (cards, chips) |
| `--color-crudo` | `#F5F6EC` | ivory white — text on dark, paper field |
| `--color-crudo-2` | `#E9ECDA` | deeper paper for layering on crudo |
| `--color-petrol` | `#0A5568` | brand petrol (logo-2 ground) — deep field ink |
| `--color-petrol-deep` | `#063E4F` | pressed petrol (hover on light), links on crudo |
| `--color-teal` | `#306F88` | logo-circle teal — ribbons, tints, ghosts |
| `--color-lima` | `#A8BC42` | brand script green — primary CTAs (noche text), highlights |
| `--color-lima-deep` | `#86962F` | pressed lima (hover) |
| `--color-error` | `#B23A2E` | form errors only, deliberately outside the family |
| `--color-wa` | `#25D366` | WhatsApp brand green, the floating button only |
| `--beat` | `140ms` | one musical beat; all delays are multiples |
| `--ease-dance` | `cubic-bezier(0.16,1,0.3,1)` | the "land the step" entrance curve |

Secondary text is always tinted from its field (`.muted` per `.field-*`), never gray.

## Type

**Archivo variable** (Omnibus-Type, self-hosted latin subset, `public/fonts/`).
- `.display` — wdth 125, weight 900, uppercase, `line-height 0.92`, `text-wrap-style: balance`. Poster voice for H1/H2.
- `.display-mid` — wdth 118, weight 800, uppercase. Sub-headlines, wordmark, day cards.
- Body — Archivo normal width, 16px base, `line-height 1.6`, `.lead` for intros (max 38rem).
- Never introduce a second family. Emphasis = weight/width/italic of Archivo.

## Composition grammar

- **Fabric fields**: every section owns one full-bleed color (`.field-noche/petrol/crudo/lima`). Field order on a page alternates dark/saturated/light like skirt layers; two adjacent fields never share a color.
- **Flow divider** (`RuffleDivider`, name historical): a smooth wave seam in the color of the field above, traveling left→right in a seamless one-period loop (GPU-composited), with teal/lima echo lines and runner comets — the hero's current carried between sections. The only section divider.
- **Ribbon trails** (`Ribbons`): thick round-capped flowing paths in lima/teal/ivory — hero + 404 only; masked to fade before the hem.
- **Estela** (`FlowField.tsx`): the hero's silk-trail field — 52 static thin lines (never repaint → no Chrome AA shimmer) with ~14 runner comets drifting along every fourth line and one imperceptible GPU drift of the whole field. Headline letters groove endlessly on a gentle 3-bar CSS loop; no entrance animations, text is always visible.
- **Hero medallion**: a circular video window (echoing the round logo badge) floating at the trail convergence, ultra-slow 8-bar float; muted/looping/decorative, first-frame-only under reduced motion.
- **Logo assets**: `public/media/logo-badge{,-360}.webp` (circular badge, header/footer/contact/redirect), `logo-wide.webp` (about page), favicon + apple-touch-icon from the badge. Never recolor the logo files.
- Buttons are pills; media tiles and cards are `rounded-xl/2xl` — that two-tier radius system is fixed.
- Squiggle underline (small scalloped SVG path) marks `dt` titles; no colored side-borders, no kickers/eyebrows, no hard offset shadows, no gradient text.

## Motion (source: [app/components/motion.ts](app/components/motion.ts))

- Everything derives from `BEAT` (0.14s) and `EASE_DANCE`; springs (`SPRING`) only for the hero letter swing and playful moments.
- Entrances: `riseIn(beats)` via `Reveal` with `whileInView` (once). Hero: count pre-roll `5·6·7·8`, then letter-stagger swing at half-beats.
- The prerendered HTML always paints visible content: hero gates its animation on mount; `html:not(.js)` and `prefers-reduced-motion` CSS overrides force opacity/transform static. Every animation must keep a static fallback.

## Media

Manifest-driven (`app/content/media.manifest.json` → `MediaTile`). Placeholder art = deterministic ribbon strokes in the style's color pair on `noche-2` + style name label; replaced automatically when processed assets exist. Videos: muted, looping, `playsInline`, poster, never autoplaying audio.

## Voice

ES-CO: warm, personal, proud ("Sin pena: todos llegamos con dos pies izquierdos"). The brand motto is **"Bailar encanta"** (footer, OG, about). EN: native English, never translated Spanish; the motto stays in Spanish as a brand mark. No em-dashes anywhere in visible copy. WhatsApp is always the primary CTA; one label per intent per page.

## Open ceiling items (future polish)

- Subtle fabric grain/texture on fields once real photography sets the material tone.
- More per-section motion differentiation (currently: shared rise + hero swing + menu clip-reveal + gallery pop).
