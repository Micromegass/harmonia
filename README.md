# Harmonia Baila — sitio web / website

Bilingual (ES/EN) marketing site for the Harmonia Baila dance studio in Medellín, Colombia.
Fully static — no backend, no database. Built with React Router v7+ (framework mode, prerendered), TypeScript, Tailwind CSS v4, and Framer Motion.

Instagram: [@harmonia.baila](https://www.instagram.com/harmonia.baila)

## Requirements

- Node.js ≥ 20 (developed on 24)
- npm

## Setup

```bash
npm install
cp .env.example .env   # then fill in the real values (see comments in the file)
```

| Env var | Purpose |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for floating button + fallbacks. Digits only, e.g. `573001234567` |
| `VITE_WEB3FORMS_KEY` | Web3Forms access key for the contact form (free at web3forms.com). Empty ⇒ form falls back to WhatsApp/mailto |
| `VITE_CONTACT_EMAIL` | Public contact email (contact page, legal pages) |
| `VITE_SITE_ORIGIN` | Production origin for canonical URLs / sitemap |

## Commands

```bash
npm run dev        # dev server at http://localhost:5173
npm run build      # static production build → build/client/
npm run preview    # serve the production build locally
npm run typecheck  # react-router typegen + tsc
npm run media      # (re)process media from media-raw/ → public/media/ (see MEDIA.md)
```

## Deploy to Vercel (free tier, zero config changes)

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** the repository.
3. Vercel reads `vercel.json` automatically — build command `npm run build`, output `build/client`. Change nothing.
4. Under **Environment Variables**, add the four `VITE_*` vars from the table above (Production + Preview).
5. Click **Deploy**. Done — the site is fully static and stays inside the free tier.
6. After the first deploy, set the production domain in Vercel → Settings → Domains, and update `VITE_SITE_ORIGIN` to match, then redeploy.

Put the production URL in the Instagram bio (`https://…/es` resolves automatically from `/`).

## Project docs

- `CLAUDE.md` — project context, architecture, conventions
- `STATE.md` — current status + next actions
- `DECISIONS.md` — every assumption and decision, incl. `TODO: confirm with client`
- `MEDIA.md` — how to add Instagram photos/videos to the site
- `LEGAL-NOTES.md` — Colombian legal research behind the legal pages (not legal advice)
