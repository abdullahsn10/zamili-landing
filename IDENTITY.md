# Zamili — Visual Identity (derived for ZAM-1102)

No `brand/IDENTITY.md` existed yet from ZAM-1101 at the time this task started, so this
identity is derived directly from the canonical logo assets in `zamili-ui/`
(`zamili-logo-icon.svg`, `zamili-logo-wordmark.svg`) and documented here so ZAM-1101
(Facebook kit) and any future brand work can adopt it rather than diverge from it.

## 1. Logo source of truth

```
zamili-logo-icon.svg      → 128×128 rounded-square tile, #4C3BCF fill,
                             white "Z" glyph stroke (an arrow/chevron path),
                             #FF8A4C accent dot (top-right, r=9.2)
zamili-logo-wordmark.svg  → icon + "Zamili" wordmark, Latin, weight 800,
                             ink #15161B, tight tracking (-2)
```

Rules inherited sitewide:
- **"Zamili" is always set in Latin script** — never transliterated into Arabic
  letters, even mid-Arabic-sentence copy.
- The accent dot (#FF8A4C) is a **punctuation mark**, not a fill color — use it for
  a single focal point per composition (a live-status dot, a toast accent, a badge),
  never as a background or large surface.

## 2. Color

Primary — **Zamili Indigo** (from the icon fill `#4C3BCF`), a 50→950 ramp generated
around that hue (kept as CSS custom properties, `--brand-*`, so the ramp can be
regenerated later exactly like `zamili-ui/src/lib/brand.ts` does for white-labeling):

| Token | Hex | Use |
|---|---|---|
| brand-50 | #F1EEFC | tint backgrounds, hover washes |
| brand-100 | #E3DDF9 | chip backgrounds |
| brand-200 | #C6BBF2 | borders on tinted surfaces |
| brand-300 | #A395E8 | disabled/quiet accents |
| brand-400 | #7C69DC | secondary icons |
| brand-500 | #5C46D2 | interactive accents, links |
| brand-600 | **#4C3BCF** | **primary — logo fill, primary buttons, focal gradient stop** |
| brand-700 | #3D2FA6 | button hover/active |
| brand-800 | #2F2480 | deep gradient stop (hero mesh) |
| brand-900 | #211960 | near-black gradient stop |
| brand-950 | #14103D | hero background floor |

Accent — **Zamili Ember** (from the icon's dot, `#FF8A4C`): reserved for single focal
moments — a live dot, a toast, a price highlight, a "success" beat in the order-capture
animation. Never used as a large fill.

| Token | Hex | Use |
|---|---|---|
| ember-400 | #FFB37E | soft highlight / glow |
| ember-500 | **#FF8A4C** | **the accent dot, toast border, price emphasis** |
| ember-600 | #E96F2E | hover state on ember elements |

Neutrals — warm, not clinical (paired with the ink from the wordmark, `#15161B`):

| Token | Hex | Use |
|---|---|---|
| ink | #15161B | body text (light surfaces) |
| ink-2 | #4A4B57 | secondary text |
| ink-3 | #6E6F7A | tertiary / placeholder text — darkened from the initial #82838F, which measured ~3.76:1 on white and failed WCAG AA's 4.5:1 for normal-size text (caught by the Lighthouse accessibility run) |
| paper | #FCFBFA | page background (light sections) |
| paper-2 | #F3F1EE | card background |
| line | #E7E4E0 | hairline borders |
| midnight | #0D0B1F | hero / demo-canvas dark floor (mesh background lives here) |

A supporting **teal** (#1FB5A6) is used strictly inside the staged demo animations for
"confirmed / live" states (record saved, order registered) so it never competes with
the ember accent for attention.

## 3. Typography

**IBM Plex Sans Arabic** (Arabic) paired with **IBM Plex Sans** (Latin/English) — one
type family, two scripts, matched x-height and weight axis, so switching the language
toggle never causes a jarring rhythm change. Both are loaded via `next/font/google`,
which fetches and self-hosts the woff2 files at build time under the app's own origin
— the browser never requests fonts.googleapis.com at runtime, satisfying the
self-hosted-Arabic-webfont requirement without vendoring binaries by hand.

- Arabic weights: 400 (body), 500 (UI labels), 600 (subheads), 700 (headlines).
- Latin weights: 400, 500, 600, 700 (IBM Plex Sans tops out at 700 via
  `next/font/google`; the "Zamili" lockup uses 700 + tight tracking rather
  than the wordmark's exact 800, which is close enough at body/heading sizes).
- Numerals: Western digits (٠-٩ are avoided) for prices/counts even in Arabic copy —
  matches how Palestinian retail/commerce Arabic is actually written and keeps price
  tags legible in the records/order demo animations.
- Scale: a fluid type scale (`clamp()`) from a 16px body to a ~64px hero headline,
  tighter tracking on Latin display text (mirrors the wordmark's -2 tracking), normal
  tracking on Arabic (tracking Arabic reduces legibility).

## 4. Motion language

Motion is the product, so it gets the same rigor as color/type:

- **Easing:** a single custom cubic-bezier (`0.22, 1, 0.36, 1` — "confident settle")
  for all entrances; a snappier `0.4, 0, 0.2, 1` for micro-interactions (hover/press).
- **Duration bands:** micro-interactions 120–200ms, section choreography 400–700ms,
  ambient/looping background motion 8–20s (slow, never attention-grabbing).
- **The mesh:** the hero/demo-canvas background is a slowly drifting gradient mesh of
  brand-600/brand-800/midnight blobs plus a faint connected-node field, both reacting
  a few px to pointer position and scroll — never more than a 12px parallax range, so
  it reads as "alive," not as a distraction from the content on top.
- **Everything gates on `prefers-reduced-motion: reduce`** — looping/ambient motion
  stops entirely; entrance transitions collapse to instant opacity fades.

## 5. Iconography & surfaces

- Rounded-corner language (28px radius on the 128px icon → scales to `rounded-2xl`/
  `rounded-3xl` on cards and device frames) — soft, not sharp; not a chat-bubble
  cliché of fully-pill shapes either.
- Device frames (phone for WhatsApp-style, browser chrome for widget-style) use a
  restrained bezel — the content (the conversation) is the hero, not the chrome.
- No stock "AI" iconography (no glowing brains, no circuit patterns, no robot glyphs)
  — the visual vocabulary is *operations*: documents, price tags, order tickets,
  inbox trays, checkmarks. This is a front-desk product, not a sci-fi one.
