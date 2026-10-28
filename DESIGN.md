# Design

Van livery at night. A navy ground like a sign-written van, cyan as the brand stripe and the "live" signal, tape-measure yellow only on booking buttons. Every token lives in `assets/site.css` `:root`; new pages reuse the classes there rather than adding new ones.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--navy-900` | #081429 | Hero, page heroes, header, mobile booking bar |
| `--navy-800` | #0C1D3A | Dark sections, ink on light |
| `--navy-950` | #050D1C | Footer |
| `--cyan` | #00E0F5 | Accent text and icons on dark only |
| `--cyan-ink` | #006A7A | Cyan on light grounds (passes AA) |
| `--yellow` | #FFC20E | "Book a 15-minute call" buttons only |
| `--paper` / `--white` | #F2F4F7 / #FFF | Light sections alternate between these |
| `--ink-2` / `--on-dark-2` | #43506A / #B8C4D9 | Secondary text on light / dark |

Sections alternate dark and light: `.night`, `.dark`, `.light`, `.white`. Add `.on-light` to light containers inside dark sections (forms, calculator) so buttons and notes switch colour.

## Type

- Display: Archivo (self-hosted variable, `fonts/archivo-latin.woff2`), weight 750 to 850, `font-stretch` 110 to 125%. Headlines end with a full stop.
- Body: Atkinson Hyperlegible Next (`fonts/atkinson-next-latin.woff2`), 17px base, line-height 1.6.
- `.h2` for section headings, `.lede` for the line under them, `.problem` for the problem-in-their-words line (cyan rule on the left).

## Shape and structure

- Square corners on buttons, inputs and panels. Rounded corners only inside the phone (notifications, message bubbles).
- Structure comes from rules, not cards: 3px navy rule to open a list (`.ledger`, `.why`, `.faq`, `.how`), 2px or 1px rules between rows.
- No eyebrow labels above headings, no gradients on text, no icon-tile card grids.

## Components

- `.btn-book` (yellow, primary), `.btn-line` (outline, secondary), `.link-arrow` (text link with arrow).
- `.risk-note`: shield icon plus "No-win-no-fee to start", placed near booking buttons.
- `.thread`: example SMS conversation, always tagged "Example".
- `.phone` with `.notes`: the lock screen hero. Notifications are listed newest first in HTML.
- `.calc`: slider calculator, inputs left, navy result panel right.
- `.faq` uses native `details`/`summary`.
- `.todo`: red dashed box for content the team still owes. None may ship.

## Motion

GSAP, ScrollTrigger and Lenis from a CDN, used in three places only: the hero notification stack (clock advances as each one lands), example threads (messages arrive in order), and the calculator total counting. Everything is visible without JavaScript, and `prefers-reduced-motion` skips all of it.

## Shared markup

Header, footer, icon sprite, cookie banner and mobile booking bar are copied into each page between `<!-- header -->`, `<!-- footer -->` and `<!-- sprite -->` comments. Change them in `index.html` and copy across to every page.
