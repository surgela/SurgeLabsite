# Design

Lab-glass green, sharp and hairline. The colours come from the logo's teal-green flask: deep green-black grounds, 1px hairline rules, wide upper-case Archivo headlines with one italic serif phrase in mint, mint pill buttons. Every token lives in `assets/site.css` `:root`; new pages reuse the classes there.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | #06100E | Page ground, heroes, `.night` and `.white` sections |
| `--bg-2` | #0A1714 | Alternate sections: `.dark` and `.light` |
| `--bg-3` | #0F201B | Panels: forms, calculator, threads, reviews, dropdowns |
| `--bg-4` | #173129 | Avatars, slider tracks |
| `--foot` | #040A08 | Footer |
| `--line` / `--line-2` | 12% / 22% pale green | Hairline rules and panel borders |
| `--text` / `--text-2` / `--text-3` | #EEF4F0 / #A6BAB1 / #8BA399 | Primary, secondary, tertiary text (all pass AA) |
| `--accent` | #34E3A6 | Logo mint: buttons, accent words, icons, big numbers |

No purple, no gradient text, no glows. The only gradient is the faint mint wash on the `.pitch` panel. Message bubbles keep iPhone blue so the example threads read as a real phone.

## Type

- Display: Archivo (`fonts/archivo-latin.woff2`), weight 800, `font-stretch` 125%, upper case for h1 and h2.
- Accent: Instrument Serif italic (`fonts/instrument-serif-italic-latin.woff2`), via `<em>` inside an h1 or h2 only, never body text. Normal case, mint, one phrase per heading, usually the last few words: `Your old quotes are full of <em>jobs.</em>`
- Body: Atkinson Hyperlegible Next (`fonts/atkinson-next-latin.woff2`), 17px, line-height 1.65.
- Labels, nav and buttons: Archivo, upper case, letter-spacing .14 to .18em, never smaller than .75rem.
- Step numbers (`.how`, `.steps`) and day or time labels in `.day` ledgers use the italic serif in mint.

## Shape and structure

- Pill buttons (`border-radius:100px`). Panels round at 12 to 24px with a 1px `--line-2` border.
- Structure comes from hairline rules, not boxes: `.ledger`, `.why`, `.faq`, `.how`, `.ticks` open with a `--line-2` rule and separate rows with `--line`.
- No eyebrow labels above headings. The breadcrumb is plain lower-case text.

## Components

- `.btn-book` (mint pill, primary), `.btn-line` (hairline pill, secondary), `.link-arrow` (mint upper-case text link).
- `.band`: scrolling outline-text strip of the six services under the home hero. Pauses on hover, stops with reduced motion.
- `.risk-note`: shield icon plus a short reassurance line, near booking buttons. No no-win-no-fee offer anywhere.
- `.thread`: dark-mode SMS conversation, always tagged "Example".
- `.reviews`: one large serif quote plus two smaller, from real Google reviews only.
- `.pitch`: the "Be our first case study" panel, in place of case studies until a real one exists.
- `.phone` with `.notes`: the lock screen hero. Notifications are listed newest first in HTML.
- `.calc`: slider calculator, inputs left, result right.
- `.todo`: red dashed box for content the team still owes. None may ship.

## Motion

GSAP, ScrollTrigger and Lenis from a CDN: the hero notification stack (clock advances as each lands), example threads (messages arrive in order), the calculator total counting, plus the CSS service band. Everything is visible without JavaScript, and `prefers-reduced-motion` skips all of it.

## Shared markup

Header, footer, icon sprite, cookie banner and mobile booking bar are copied into each page between `<!-- header -->`, `<!-- footer -->` and `<!-- sprite -->` comments. Change them in `index.html` and copy across to every page. Bump the `?v=` number on `site.css` and `site.js` links whenever either file changes so browsers fetch the new version.
