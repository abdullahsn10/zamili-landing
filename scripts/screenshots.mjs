#!/usr/bin/env node
// ZAM-1102: captures the desktop + mobile, Arabic + English screenshots
// checked into screenshots/. Requires the production server already running
// at BASE_URL (default http://localhost:3210) — see README "Screenshots".
//
// Three shots per device/locale:
//  - hero: top of page, while the hero's live WhatsApp demo is mid-animation
//  - demo: the animated demo canvas section, mid-animation
//  - full: a full-page composition reference (settled state — the looping
//    demos intentionally reset when scrolled away, per the brief, so a
//    full-page capture is a layout reference, not an animation showcase)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3210";
const OUT_DIR = "screenshots";

mkdirSync(OUT_DIR, { recursive: true });

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

async function revealAll(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => window.innerHeight);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(250);
  }
}

async function capture(page, device, locale) {
  // Hero — mid-animation.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT_DIR}/${device}-${locale}-hero.png` });
  console.log(`saved ${OUT_DIR}/${device}-${locale}-hero.png`);

  // Demo canvas — scroll it into view and let the typing animation progress.
  await page.evaluate(() => {
    document.getElementById("demo")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT_DIR}/${device}-${locale}-demo.png` });
  console.log(`saved ${OUT_DIR}/${device}-${locale}-demo.png`);

  // Full-page composition reference.
  await revealAll(page);
  await page.screenshot({ path: `${OUT_DIR}/${device}-${locale}-full.png`, fullPage: true });
  console.log(`saved ${OUT_DIR}/${device}-${locale}-full.png`);
}

async function run() {
  const browser = await chromium.launch();

  for (const [device, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await capture(page, device, "ar");

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("button", { name: "English" }).click();
    await page.waitForTimeout(400);
    await capture(page, device, "en");

    await context.close();
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
