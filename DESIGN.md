# DESIGN.md — La Falda (the skirt in motion)

<!-- Documented from the built world after the finish review; seed cf667dc0. -->

## World

The pollera skirt in motion. The page is built as layered, drenched fabric fields separated by scalloped ruffle hems; movement is choreographed to a musical 8-count. Refuses the category defaults (neon-nightclub salsa template, generic clean studio site).

## Tokens (source of truth: `@theme` in [app/app.css](app/app.css))

| Token | Value | Role |
| --- | --- | --- |
| `--color-noche` | `#221022` | deep plum night — primary ground |
| `--color-noche-2` | `#2E1530` | raised layer on noche (cards, chips) |
| `--color-crudo` | `#FFF3E4` | raw-cotton light — text on dark, paper field |
| `--color-crudo-2` | `#F7E7D3` | deeper paper for layering on crudo |
| `--color-fucsia` | `#E83D7C` | pollera fuchsia — brand ink, primary CTA |
| `--color-fucsia-deep` | `#C21F5E` | pressed fuchsia (hover, emphasis on light) |
| `--color-coral` | `#FF6B3D` | hot coral — ribbon trails, gradients only |
| `--color-sol` | `#FFC53D` | golden sun — kids field, highlights, focus ring on dark |
| `--color-mar` | `#35C4B5` | caribbean counterpoint — small accents only |
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

- **Fabric fields**: every section owns one full-bleed color (`.field-noche/fucsia/crudo/sol`). Field order on a page alternates dark/saturated/light like skirt layers; two adjacent fields never share a color.
- **Ruffle hem** (`RuffleDivider`): scalloped SVG in the color of the field above, laid over the next field. The only section divider.
- **Ribbon trails** (`Ribbons`): thick round-capped flowing paths in fucsia/coral/sol — hero + 404 only; masked to fade before the hem.
- Buttons are pills; media tiles and cards are `rounded-xl/2xl` — that two-tier radius system is fixed.
- Squiggle underline (small scalloped SVG path) marks `dt` titles; no colored side-borders, no kickers/eyebrows, no hard offset shadows, no gradient text.

## Motion (source: [app/components/motion.ts](app/components/motion.ts))

- Everything derives from `BEAT` (0.14s) and `EASE_DANCE`; springs (`SPRING`) only for the hero letter swing and playful moments.
- Entrances: `riseIn(beats)` via `Reveal` with `whileInView` (once). Hero: count pre-roll `5·6·7·8`, then letter-stagger swing at half-beats.
- The prerendered HTML always paints visible content: hero gates its animation on mount; `html:not(.js)` and `prefers-reduced-motion` CSS overrides force opacity/transform static. Every animation must keep a static fallback.

## Media

Manifest-driven (`app/content/media.manifest.json` → `MediaTile`). Placeholder art = deterministic ribbon strokes in the style's color pair on `noche-2` + style name label; replaced automatically when processed assets exist. Videos: muted, looping, `playsInline`, poster, never autoplaying audio.

## Voice

ES-CO: warm, personal, proud ("Sin pena: todos llegamos con dos pies izquierdos"). EN: native English, never translated Spanish. No em-dashes anywhere in visible copy. WhatsApp is always the primary CTA; one label per intent per page.

## Open ceiling items (future polish)

- Subtle fabric grain/texture on fields once real photography sets the material tone.
- More per-section motion differentiation (currently: shared rise + hero swing + menu clip-reveal + gallery pop).
