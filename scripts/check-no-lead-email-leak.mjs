#!/usr/bin/env node
// ZAM-1102: fails the build if LEAD_EMAIL (or RESEND_API_KEY) ever ends up
// inside the compiled client/server output. Runs as `postbuild`, after
// `next build` has written `.next/`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const NEXT_DIR = ".next";
const SECRETS = [
  ["LEAD_EMAIL", process.env.LEAD_EMAIL],
  ["RESEND_API_KEY", process.env.RESEND_API_KEY],
].filter(([, value]) => !!value);

if (SECRETS.length === 0) {
  console.warn(
    "[check-no-lead-email-leak] LEAD_EMAIL / RESEND_API_KEY not set in this environment — skipping the leak check. " +
      "Run with those env vars set (e.g. in CI) for this check to mean anything."
  );
  process.exit(0);
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

let files;
try {
  files = walk(NEXT_DIR);
} catch {
  console.error(`[check-no-lead-email-leak] could not read ${NEXT_DIR} — did the build run?`);
  process.exit(1);
}

let leaked = false;

for (const file of files) {
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue; // binary or unreadable file, not a text leak
  }
  for (const [name, value] of SECRETS) {
    if (content.includes(value)) {
      console.error(`[check-no-lead-email-leak] FOUND ${name} inside ${file}`);
      leaked = true;
    }
  }
}

if (leaked) {
  console.error(
    "[check-no-lead-email-leak] one or more secrets leaked into the build output. Failing the build."
  );
  process.exit(1);
}

console.log("[check-no-lead-email-leak] OK — no secret values found in .next/");
