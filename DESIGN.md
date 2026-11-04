# Design

Bottle green, sharp and hairline. The colours come from the logo's teal-green flask: deep bottle-green grounds, 1px hairline rules, wide upper-case Archivo headlines with one italic serif phrase in pale mint, and strong mint kept for buttons only so the booking button stands alone. Every token lives in `assets/site.css` `:root`; new pages reuse the classes there.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | #0B1F19 | Page ground, heroes, `.night` and `.white` sections |
| `--bg-2` | #0E261F | Alternate sections: `.dark` and `.light` |
| `--bg-3` | #133129 | Panels: forms, calculator, threads, reviews, dropdowns |
| `--bg-4` | #1B3F35 | Avatars, slider tracks |
| `--foot` | #071510 | Footer |
| `--line` / `--line-2` | 13% / 24% pale green | Hairline rules and panel borders |
| `--text` / `--text-2` / `--text-3` | #F1EFE9 / #B4C4BC / #94AAA0 | Primary, secondary, tertiary text (all pass AA) |
| `--sage` | #A9DCC6 | Pale mint: italic accent words, icons, links, step numbers, big numbers |
| `--accent` | #3EE0A5 | Strong logo mint: booking buttons, focus rings, form controls only |

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
