#!/usr/bin/env node
/** Renders the designed OG cards (public/og-es.png, public/og-en.png) from
 *  scripts/og-card.html at exactly 1200×630 using headless Chromium.
 *  Run manually when the OG design or tagline changes: `node scripts/gen-og.mjs` */
import { chromium } from "playwright";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CARD = path.join(ROOT, "scripts", "og-card.html");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const lang of ["es", "en"]) {
  await page.goto(`file://${CARD}?${lang}`);
  await page.waitForTimeout(400); // let the embedded font decode
  await page.screenshot({ path: path.join(ROOT, "public", `og-${lang}.png`) });
  console.log(`✓ public/og-${lang}.png`);
}
await browser.close();
