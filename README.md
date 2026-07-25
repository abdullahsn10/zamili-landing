# zamili-landing

Zamili's Arabic-first public marketing site and demo-request lead capture (ZAM-1102). Next.js (App Router) + TypeScript + Tailwind, static-first. All product demos on the page are staged/mock front-end animations — there is no live backend or real chat widget here (per architecture decision: a live demo ships only once the trust evals are green).

See `IDENTITY.md` for the brand palette/type/motion rationale.

## Stack

- Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS
- Self-hosted fonts via `next/font/google` (IBM Plex Sans Arabic + IBM Plex Sans) — fetched once at build time and served from the app's own origin, never from Google at runtime
- Resend for the book-a-demo lead email
- Zod for server-side form validation
- No animation library — every animation is CSS keyframes / Web Animations / `IntersectionObserver`, gated behind `prefers-reduced-motion`

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY / LEAD_EMAIL to test the form
npm run dev
```

Open http://localhost:3000. The site defaults to Arabic (`dir="rtl"`); the "English" pill in the header toggles the whole page to a fully-translated English/LTR version (client-side, persisted in `localStorage` — see `src/i18n/`).

## Environment variables

See `.env.example`. All three are read only in `src/app/api/lead/route.ts` (a server-only route handler) and are never referenced from client code:

| Var | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key used to send the lead email |
| `RESEND_FROM_EMAIL` | Verified Resend sender identity (falls back to Resend's sandbox sender) |
| `LEAD_EMAIL` | Where book-a-demo submissions are emailed |

`npm run build` runs `scripts/check-no-lead-email-leak.mjs` as a `postbuild` step, which greps the built `.next/` output for the literal `LEAD_EMAIL` / `RESEND_API_KEY` values and fails the build if either ever leaks into the client bundle. Run it with those env vars set (as CI should) for the check to mean anything — it warns and skips otherwise.

## The book-a-demo form

`POST /api/lead` (`src/app/api/lead/route.ts`): validates the payload with Zod, checks a hidden honeypot field, applies an in-memory per-IP rate limit (5 requests / 10 minutes — see `src/lib/rateLimit.ts`; fine for V1 volume on a single instance, swap for Upstash/Redis if that ever stops being true), then emails the lead via Resend. Fields: name, organization, business type (a stable slug, not the localized label — see `src/lib/leadTypes.ts`), phone-or-email, and an optional "what problem do you want Zamili to solve" textarea.

## Scripts

```bash
npm run build          # production build (+ postbuild leak check)
npm run start           # serve the production build
npm run lint            # next lint
npm run typecheck       # tsc --noEmit
npm run screenshots     # Playwright screenshots -> screenshots/ (server must already be running)
npm run lighthouse      # Lighthouse (mobile + desktop) -> lighthouse-report.json (server must already be running)
```

`screenshots` and `lighthouse` both target `BASE_URL` (default `http://localhost:3210`) — run `npm run build && npm run start -- -p 3210` first, in another terminal.

## Security

A pass was done specifically to get this production-ready. What's in place:

- **No secrets in the repo or the client bundle.** `.env`/`.env.local` are gitignored; only `.env.example` (placeholder values) is committed. `RESEND_API_KEY`/`LEAD_EMAIL`/`RESEND_FROM_EMAIL` are read exclusively in `src/app/api/lead/route.ts`, a server-only route handler — they never reach client-side JS. `scripts/check-no-lead-email-leak.mjs` runs on every build and greps the compiled `.next/` output for the literal env values, failing the build if either ever leaks in.
- **Lead form abuse protection:** Zod validation on every field, a hidden honeypot (`src/lib/leadTypes.ts` → `HONEYPOT_FIELD`) that returns a fake success to bots instead of a tell-tale validation error, and an in-memory per-IP rate limit (5 requests / 10 minutes, `src/lib/rateLimit.ts`). All three were exercised directly against the built server during this pass (invalid payload → 400, honeypot filled → fake 200 with no email sent, 6th rapid request from one IP → 429) and behaved correctly. The rate limiter is in-memory/per-instance — correct call for V1 traffic on a single Vercel function; swap for Upstash/Redis if volume or targeted abuse ever demands cross-instance limits.
- **HTTP security headers** (`next.config.mjs`): `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (site can't be framed/clickjacked), `Referrer-Policy: strict-origin-when-cross-origin`, a locked-down `Permissions-Policy` (no camera/mic/geolocation — this page needs none of them), and `Strict-Transport-Security` (meaningful once served over HTTPS, which Vercel provides automatically).
- **No CORS headers on `/api/lead`**, which is deliberate: without them, browsers block cross-origin JS from calling the endpoint at all (the `Content-Type: application/json` body makes it a non-"simple" request, so it requires a preflight that we never approve). Direct server-to-server calls aren't stopped by CORS (nothing is, that's not what CORS is for) — the rate limiter + honeypot + validation are the actual defense there, and that's an intentional, standard split of responsibilities.
- **Dependency audit:** upgraded off Next.js 14.2.35 (no further stable 14.x patches are being cut) to the latest stable **Next.js 15.5.22**, which resolved a long list of Next-specific high-severity advisories (Server Actions/Middleware/RSC-cache DoS and SSRF issues — none of which this app's surface actually used, since there's no Middleware, no Server Actions, no i18n routing config here, but better not to carry them regardless). Also bumped `resend` (4.0.1 → 6.18.0) and the root `postcss` devDependency, which resolved every fixable advisory in `npm audit` bar two: `next/node_modules/{postcss,sharp}` — Next's **own internal, vendored** copies (used for Next's own build-time CSS processing and the `next/image` optimizer), not something this repo's `package.json` can pin around. Practical exploitability for this app is effectively nil: the vendored postcss only ever processes this repo's own Tailwind output at build time (never attacker-supplied CSS), and the vendored sharp only ever processes the handful of first-party images in `public/images/` (never a user upload or an attacker-controlled URL — this site never accepts either). Re-run `npm audit` occasionally and take a matching Next.js patch release when one ships.
- **Type/lint clean, no `any`-laden escape hatches.** `npm run typecheck` and `npm run lint` are both clean; nothing here silences a real error.

## Deploying

Static-first and built for exactly this: push to `main`/`develop`, connect the repo on [vercel.com](https://vercel.com), done. Concretely:

1. **Push this repo to GitHub** (already done — `abdullahsn10/zamili-landing`). Vercel deploys straight from a GitHub repo; no separate upload step.
2. **Create a Vercel account** (or use an existing one) at vercel.com, sign in with GitHub.
3. **"Add New… → Project"**, pick `zamili-landing` from the repo list. Vercel auto-detects Next.js — framework preset, build command (`next build`), and output are all filled in automatically. No configuration needed.
4. **Environment variables** — before the first deploy (or right after, then redeploy), add these three in the Vercel project's **Settings → Environment Variables** (not in a committed file):
   - `RESEND_API_KEY` — from your Resend account (resend.com → API Keys). Paste it directly into Vercel's dashboard, not into a chat, a doc, or a commit — Vercel encrypts it and it's the only place it needs to live besides your own password manager.
   - `LEAD_EMAIL` — the inbox that should receive book-a-demo leads.
   - `RESEND_FROM_EMAIL` — a sender identity on a domain you've verified in Resend (Resend → Domains → Add Domain, then add the DNS records it gives you). Until a domain is verified, omit this and the app falls back to Resend's shared sandbox sender (fine for testing, not for real outbound deliverability/branding).
5. **Deploy.** Vercel gives you a free `*.vercel.app` preview URL immediately — this is a fully working, publicly reachable HTTPS URL, good enough to share right away while a custom domain is still being set up.
6. **Custom domain** (e.g. `zamili.com` or `www.zamili.com`):
   - If Zamili doesn't already own a domain: buy one through any registrar (Namecheap, Cloudflare Registrar, Google Domains successor Squarespace Domains, or directly through Vercel's own domain registration in the project's **Domains** tab — all comparable, pick whichever you already have billing set up with). This is a real purchase — do it from your own account, not through me.
   - In the Vercel project → **Settings → Domains**, add the domain. Vercel shows the exact DNS records to add (usually an `A`/`ALIAS` record for the apex domain and a `CNAME` for `www`) — add those at your registrar (or point the domain's nameservers at Vercel if you'd rather manage DNS there). Propagation is usually minutes, sometimes a few hours.
   - Vercel issues and renews the TLS certificate automatically once DNS resolves — no manual certificate work.
7. **Every subsequent `git push` to the connected branch redeploys automatically**, and every PR gets its own preview URL for free — useful for the founder-review workflow this repo already follows.

This repo has not been deployed from this session — no Vercel account/credentials were available here. Whoever holds (or creates) the Zamili Vercel account should do steps 2–6 and drop the resulting URL (and the domain, once connected) into `zamili-board/output/ZAM-1102-landing.md`.

## Demo images

`public/images/*.jpg` (used in the WhatsApp order demo and the Retail Pack's sample conversation — one agent-sent photo, one customer-sent photo, and a 2-photo gallery reply — resized/cropped with `sharp`) are all CC0/public-domain photos, sourced via Openverse:
- `pizza-veggie.jpg`: ["Pizza Margherita San Marzano tomatoes"](https://www.rawpixel.com/image/448258/authentic-italian-pizza-pieces) by Jakub Kapusnak, CC0.
- `shirts-rack.jpg`: ["Blank t-shirts hanging wooden hangers"](https://www.rawpixel.com/image/11524162/blank-t-shirts-hanging-wooden-hangers), CC0.
- `shirts-folded.jpg`: ["Stack of folded t-shirts"](https://www.rawpixel.com/image/11515802/stack-folded-t-shirts), CC0.

No attribution is legally required for any of these; credited here anyway.

## Screenshots

`screenshots/` (generated by `npm run screenshots`, Playwright): `{desktop,mobile}-{ar,en}-{hero,demo,full}.png` — a mid-animation hero shot, a mid-animation demo-canvas shot, and a full-page composition reference, for each viewport × language. The looping demo animations intentionally reset when scrolled off-screen (per the brief), so the "full" shots show a settled state rather than mid-animation — that's expected, not a bug.

## Lighthouse

Measured locally against `next start` (no CDN/edge caching) on a loaded dev machine, mobile preset (Moto G power emulation, simulated slow-4G, 4x CPU throttle) and desktop preset (no throttle):

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Desktop | 98–100 across repeated local runs | 100 | 100 | 100 |
| Mobile | 56–88 across repeated local runs (see caveat below) | 100 | 100 | 100 |

Full machine-readable output: `lighthouse-report.json` (regenerate with `npm run lighthouse`).

**Caveat on the mobile performance number:** run locally 10+ times across several sessions (including after adding more demo photos and cards), it's landed anywhere from 59 to 88 — desktop stayed at 98–100 on the identical build every time. Lighthouse's mobile preset applies a 4x CPU slowdown on top of whatever the host machine is already doing, so on a dev machine running a browser, an editor, and other tooling simultaneously, that throttle amplifies ordinary host jitter into large score swings; it is not a signal that the page's real-world mobile performance is unstable — see the "known gotcha" below, where the same variance once turned out to be dozens of orphaned `node` processes from repeated background builds, not a real regression. LCP/FCP are the two metrics dragging the score below the ≥90 target locally. **This should be re-measured against the deployed Vercel URL** once one exists — Vercel's edge network, HTTP/2, and proper cache headers reliably outperform an unthrottled-at-the-edge `next start` on localhost, and that number is the one to hold against the ≥90 target, not this one.

**Known gotcha — check for orphaned node processes before trusting a bad score.** Running `npm run build`/`npm run start` repeatedly in the same shell session (e.g. while iterating) can leave old server/build processes running in the background on Windows. A pile of these starves the CPU and single-handedly explains mobile scores in the 50s–60s, or even a demo animation that looks "stuck" (the phone conversation never advancing). Before treating a bad Lighthouse run or a frozen-looking animation as a real bug, run `tasklist //FI "IMAGENAME eq node.exe"` and kill anything you don't recognize (`taskkill //F //IM node.exe`, then restart just the one server you need) — this fixed both symptoms outright during this build.

Contrast note: the initial `ink-3` tertiary-text color (`#82838F`) measured ~3.76:1 on white and failed WCAG AA (4.5:1) for normal-size text — caught by this same Lighthouse run. Darkened to `#6E6F7A` (4.97:1); accessibility now scores 100/100 on both presets. See `IDENTITY.md` §2.

## What's not done here

- **No deployment.** No Vercel account/credentials were available in this session. Someone with access needs to run the first deploy and record the preview URL — see "Deploying" above for the exact steps.
- **No real end-to-end email test.** The route's request handling (validation, honeypot, rate limiting, the "misconfigured" failure path) was verified directly against the built server and behaves correctly — but sending an actual email needs a real `RESEND_API_KEY` and `LEAD_EMAIL`, which weren't available in this session. Once those are set (locally in `.env.local`, or as real Vercel project env vars), submit the form once for real and confirm the email arrives.
- **The mobile Lighthouse performance number above is a local measurement**, not a deployed one — see the caveat above.
