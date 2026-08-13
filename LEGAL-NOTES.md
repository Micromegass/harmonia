# LEGAL-NOTES.md — research behind the legal pages

> **Disclaimer:** the legal pages in this site are a good-faith implementation based on the research summarized below. They are **not legal advice**. Before launch, a Colombian abogado/a should review them — especially the identity placeholders and the image-rights consent process for minors.

## What the site implements

| Requirement | Source | Implementation |
| --- | --- | --- |
| Política de Tratamiento de Datos Personales (full policy: controller identity, purposes, rights, procedures, validity) | Ley 1581/2012; Decreto 1377/2013 art. 13 (compiled in Decreto 1074/2015) | `/es/legal/tratamiento-de-datos` + EN translation |
| Aviso de Privacidad (short notice pointing to the policy) | Decreto 1377/2013 arts. 14–15 | `/es/legal/aviso-de-privacidad` + EN |
| Prior, express, informed **authorization** at collection | Ley 1581/2012 art. 9; Decreto 1377/2013 arts. 5–7 | Contact-form checkbox, **unchecked by default**, linking to the policy; submission blocked without it |
| Data-subject rights + response timelines | Ley 1581/2012 arts. 8, 14, 15 | Policy §6–7: consultas 10 días hábiles (+5), reclamos 15 días hábiles (+8), desistimiento 2 meses |
| Contact channel for data rights | Ley 1581/2012 art. 17 | `VITE_CONTACT_EMAIL` surfaced in all legal pages |
| Minors' data & best-interest rule | Ley 1581/2012 art. 7; Decreto 1377/2013 art. 12 | Policy §10; image-consent language in Terms §6 |
| **RNBD registration** | Decreto 090/2018 | **Not required**: obligation applies only to companies/non-profits with assets > 100,000 UVT (~COP 3.3+ bn) and public entities. A single-owner dance studio is far below the threshold. Conclusion recorded in policy §11 and DECISIONS.md. Still fully subject to Ley 1581. |
| Consumer disclosures for services advertised online | Ley 1480/2011 (Estatuto del Consumidor) | Terms §3–4: truthful info, prices informed before payment, PQR channel with 15-business-day responses, SIC as authority |
| Cookies | No dedicated Colombian cookie law; Ley 1581 applies if personal data is processed | Site ships **no analytics, no tracking cookies**; only two technical localStorage keys, documented in the cookie policy. No consent banner needed. |
| International data transfers | Ley 1581/2012 art. 26; Decreto 1377/2013 | Policy §8 discloses Vercel (hosting, US), Web3Forms (form relay), WhatsApp/Meta |
| Governing language | — | English pages state explicitly that the Spanish version prevails |

## Placeholders pending client input (also in DECISIONS.md)

`{{razonSocial}}`, `{{nit}}`, `{{domicilio}}` (currently "Medellín, Antioquia, Colombia"), contact email (`VITE_CONTACT_EMAIL`). They are interpolated by `app/components/LegalPage.tsx` — update the env var and the `fill()` function (or replace tokens in `app/content/legal.*.json`) once confirmed.

## High-risk areas flagged for human-lawyer review

1. **Minors' images**: the site's placeholder art currently shows no real people, but as soon as real class photos/videos are added, written consent from guardians is mandatory (Ley 1098/2006 Código de Infancia + habeas data). Keep signed forms on file.
2. **Whether the studio operates as persona natural or sociedad** changes the razón social/NIT block and tax-side obligations — confirm before launch.
3. If the studio ever adds online payments, enrollment contracts, or analytics, the Terms, the policy, and the cookie page must be revised (retracto/Ley 1480 e-commerce rules would kick in).

## Sources consulted (2026-08-13)

- [Ley 1581 de 2012 — Función Pública, texto vigente](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981)
- [Decreto 1377 de 2013 — Función Pública, texto vigente](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53646)
- [SIC — Registro Nacional de Bases de Datos](https://www.sic.gov.co/registro-nacional-de-bases-de-datos)
- [SIC — Preguntas frecuentes RNBD](https://sic.gov.co/preguntas-frecuentes-rnbd)
- [SIC — Gobierno reduce universo de obligados RNBD (Decreto 090/2018)](https://www.sic.gov.co/gobierno-nacional-reduce-universo-de-obligados-a-cumplir-el-registro-de-bases-de-datos-ante-superintendencia-de-industria-y-comercio)
- [Decreto 090 de 2018 — Actualícese](https://actualicese.com/decreto-090-de-18-01-2018)
- [MinCIT — Protección de datos personales: Ley 1581/2012 y Decreto 1377/2013 (guía)](https://www.mincit.gov.co/CMSPages/GetFile.aspx?guid=79523bfd-58a5-4292-9bad-9d47701284e4)
