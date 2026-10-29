# Design

Dark, sharp and hairline, carried over from the previous Surge Lab site without its purple gradients and glows. Near-black navy grounds, 1px hairline rules, wide upper-case Archivo headlines with one italic serif phrase in cyan, cyan pill buttons. Every token lives in `assets/site.css` `:root`; new pages reuse the classes there.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | #05070E | Page ground, heroes, `.night` and `.white` sections |
| `--bg-2` | #090D19 | Alternate sections: `.dark` and `.light` |
| `--bg-3` | #0E1426 | Panels: forms, calculator, threads, reviews, dropdowns |
| `--bg-4` | #141C33 | Avatars, slider tracks |
| `--foot` | #030409 | Footer |
| `--line` / `--line-2` | 12% / 22% blue-white | Hairline rules and panel borders |
| `--text` / `--text-2` / `--text-3` | #EEF2FF / #9AA6C8 / #8592B3 | Primary, secondary, tertiary text (all pass AA on every ground) |
| `--cyan` | #00E5FF | Buttons, accent words, icons, big numbers |

No purple, no gradient text, no glows. The only gradient is the faint cyan wash on the `.pitch` panel.

## Type

- Display: Archivo (`fonts/archivo-latin.woff2`), weight 800, `font-stretch` 125%, upper case for h1 and h2.
- Accent: Instrument Serif italic (`fonts/instrument-serif-italic-latin.woff2`), via `<em>` inside an h1 or h2. Normal case, cyan, one phrase per heading, usually the last few words: `Your old quotes are full of <em>jobs.</em>`
- Body: Atkinson Hyperlegible Next (`fonts/atkinson-next-latin.woff2`), 17px, line-height 1.65.
- Labels, nav and buttons: Archivo, upper case, letter-spacing .14 to .18em, never smaller than .75rem.
- Step numbers (`.how`, `.steps`) and sector-page times use the italic serif in cyan.

## Shape and structure

- Pill buttons (`border-radius:100px`). Panels round at 12 to 24px with a 1px `--line-2` border.
- Structure comes from hairline rules, not boxes: `.ledger`, `.why`, `.faq`, `.how`, `.ticks` open with a `--line-2` rule and separate rows with `--line`.
- No eyebrow labels above headings. The breadcrumb is plain lower-case text.

## Components

- `.btn-book` (cyan pill, primary), `.btn-line` (hairline pill, secondary), `.link-arrow` (cyan upper-case text link).
- `.band`: scrolling outline-text strip of the six services under the home hero. Pauses on hover, stops with reduced motion.
- `.risk-note`: shield icon plus "No-win-no-fee to start", near booking buttons.
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
