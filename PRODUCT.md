# Product

<!-- impeccable:product-schema 1 -->

> Interview substitution: the client brief explicitly runs this build unattended ("do not ask me any questions; I will not be at the computer"), so all facts below come from the written brief; items marked *(inferred)* are reasonable inferences logged in DECISIONS.md for later confirmation.

## Platform

web

## Stack

delegated: React Router v8 framework mode (Vite) + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion, fully prerendered static output — brief mandated React+Vite+TS+Tailwind+Framer Motion and separately mandated crawlable static HTML per locale; RR framework mode satisfies both on the Vercel free tier.

## Users

- Primary: people in Medellín (mostly arriving from Instagram, on phones) considering dance classes — adults from beginner to advanced, and parents choosing classes for their kids. Spanish-speaking, Colombian.
- Secondary: expats, tourists, and international visitors in Medellín searching in English for salsa/bachata classes — smaller but far less competitive market; served as a first-class audience, not an afterthought.

## Product Purpose

Marketing site for **Harmonia Baila**, a dance studio in Medellín owned and led by a university-graduated professional dancer. The site exists to attract new students and to make the studio dramatically more visible and credible on the open web than its Instagram profile alone. Success = a stranger stops scrolling, believes in the studio, and books/contacts via WhatsApp or the form.

## Positioning

A studio led by a *degreed professional dancer* — pedagogy and artistry, not just a party class. Teaches salsa and bachata (confirmed) plus a broad range of styles *(exact list inferred, pending confirmation)*, for children and adults, beginners through advanced, in group and private formats. Warm, personal, single-teacher-led identity — the owner *is* the brand.

## Operating Context

- Discovery is Instagram-first: visitors land from the bio link on mid-range Android phones. Mobile is the primary stage.
- Contact happens on WhatsApp (Colombian norm); the floating WhatsApp button is the primary conversion path, contact form second.
- Fully bilingual ES-CO (default, SEO priority) / EN with route-based locales.

## Capabilities and Constraints

- Frontend-only: no backend, no database, no server functions; Vercel free tier with committed vercel.json.
- Contact form via Web3Forms; fallback WhatsApp + mailto. No analytics, no third-party scripts, self-hosted media and fonts only. No Instagram embeds.
- Undecided product facts (placeholders, never invented): prices, exact schedule, address/neighborhood, full style list, legal identity (razón social, NIT), WhatsApp number, contact email.
- Never publish invented prices, certifications, or testimonials.

## Brand Commitments

- Name: **Harmonia Baila** (Instagram @harmonia.baila). No logo asset could be retrieved — typographic wordmark designed in-project *(inferred; replace if client supplies real logo)*.
- Voice: Colombian Spanish — warm, personal, proud, never neutral-corporate; English reads as native English, not translation.

## Evidence on Hand

- None retrievable: Instagram is login-walled and the studio is not indexed elsewhere. All imagery ships as branded placeholders; `app/content/media.manifest.json` + `MEDIA.md` define the drop-in pipeline for her real photos/videos.
- Absences future work must not fabricate: testimonials, student counts, certifications, press.

## Product Principles

1. Mobile-first, Instagram-handoff-first: the first viewport on a mid-range Android decides everything.
2. Movement is the message: motion design is choreographed evidence of dance craft, never decoration.
3. Two languages, one warmth: every string native in both; Spanish is the legal and SEO source of truth.
4. Credibility without fabrication: the degreed-professional story carries trust; placeholders stay visibly honest until real content lands.
5. WhatsApp is the finish line: every page ends within one thumb-reach of starting a conversation.

## Accessibility & Inclusion

WCAG 2.2 AA target: real headings, keyboard navigable, visible focus, AA contrast, bilingual alt text, `prefers-reduced-motion` static fallbacks for every animation.
