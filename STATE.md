# STATE.md — session handoff

_Last updated: 2026-08-13, end of build. All phases complete; site is deploy-ready pending client inputs._

## DONE
- Full bilingual static site (React Router v8 prerender, 22 routes, /es + /en localized slugs)
- Design system "La Falda" (DESIGN.md; contract in built HTML, seed cf667dc0)
- Home, Nosotros/About, Clases, Horarios, Galería (filters + lightbox + showreel), Contacto (Web3Forms + honeypot + throttle + consent checkbox), localized 404
- Media pipeline (`npm run media`, manifest, branded placeholders) + MEDIA.md client instructions
- SEO: hreflang/canonicals/JSON-LD (LocalBusiness+EducationalOrganization, Course, BreadcrumbList), designed OG per locale, sitemap+robots+404.html postbuild
- Legal: 4 bilingual Colombian pages (Ley 1581, D.1377, D.090 RNBD exemption, Ley 1480) + LEGAL-NOTES.md
- Security: strict CSP (hashed inline scripts, no unsafe-inline for scripts), full headers, npm audit clean, audit recorded in .claude/security-audit.json
- Critique loop ×3 + degraded impeccable finish review (disposition: ship) + taste pre-flight
- Verification: 30/30 Playwright functional checks; Lighthouse desktop 100×4, mobile 87/100/100/100 both locales; impeccable detect clean; i18n key parity exact

## IN PROGRESS
- Nothing.

## NOT STARTED
- Deploy to Vercel (needs the client's GitHub/Vercel account — see README.md steps)
- Real media ingestion (waiting on her Instagram export — MEDIA.md)

## Known bugs / hacks / deliberate shortcuts
- `scripts/postbuild.mjs` mirrors the slug map from `app/i18n/routing.ts` manually (build fails loudly if they drift)
- Placeholder art everywhere until real photos land; schedule times are marked reference-only
- Legal identity fields interpolated as visible placeholders until confirmed (LegalPage `fill()`)
- Video pipeline copies uncompressed until ffmpeg is installed

## Next 3 actions
1. Client fills env vars (WhatsApp number, Web3Forms key, contact email) → push to GitHub → import in Vercel (README.md has exact steps)
2. Client runs Instagram "Download your information" export → drop files per MEDIA.md → `npm run media` → commit
3. Confirm legal identity fields (razón social, NIT, domicilio) and swap into legal pages; abogado review before launch

## Blocked on client input
See "TODO: confirm with client" in DECISIONS.md — WhatsApp number, Web3Forms key, schedule, address, style list, owner's name/story facts, legal identity, image-rights consents.
