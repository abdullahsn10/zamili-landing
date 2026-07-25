#!/usr/bin/env node
// ZAM-1102: runs Lighthouse (mobile + desktop presets) against an already
// running production server (see README "Lighthouse") and writes the
// scores to lighthouse-report.json for the README to quote.
import { writeFileSync } from "node:fs";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const BASE_URL = process.env.BASE_URL || "http://localhost:3210";

async function runOnce(url, formFactor) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });
  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        formFactor,
        screenEmulation:
          formFactor === "mobile"
            ? { mobile: true, width: 390, height: 844, deviceScaleFactor: 2 }
            : { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1 },
        // Lighthouse defaults to mobile-equivalent throttling regardless of
        // formFactor unless told otherwise — without this, "desktop" scores
        // come back artificially low (mobile CPU/network slowdown applied
        // to a desktop viewport).
        throttlingMethod: "devtools",
        throttling:
          formFactor === "mobile"
            ? undefined
            : { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 },
      },
      undefined
    );
    const { categories, audits } = result.lhr;
    const failedA11y = Object.values(audits)
      .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode === "binary")
      .map((a) => a.id);
    return {
      scores: Object.fromEntries(
        Object.entries(categories).map(([key, cat]) => [key, Math.round(cat.score * 100)])
      ),
      failedAudits: failedA11y,
    };
  } finally {
    await chrome.kill();
  }
}

async function run() {
  const mobile = await runOnce(BASE_URL, "mobile");
  const desktop = await runOnce(BASE_URL, "desktop");
  const results = {
    generatedAt: new Date().toISOString(),
    url: BASE_URL,
    mobile: mobile.scores,
    desktop: desktop.scores,
    failedAudits: { mobile: mobile.failedAudits, desktop: desktop.failedAudits },
  };
  writeFileSync("lighthouse-report.json", JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
