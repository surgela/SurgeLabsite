# Product

<!-- impeccable:product-schema 1 -->

Source: Surge Lab Website Rebuild Brief, 28 Oct 2026, confirmed by Lewis as the brief for this build. It stands in for the init interview. Joe's review on 29 Oct 2026 overrides the brief where they differ: no no-win-no-fee offer anywhere, web design is a service, more emphasis on automations, CRMs, chatbots and document AI (RAG), and a new colourway.

## Platform

web

## Stack

Static HTML, CSS and JS on a Cloudflare Worker (`worker.js`, `wrangler.jsonc`, assets served from the repo root). The Worker's `/submit` route sends form enquiries by email through Brevo. GSAP, ScrollTrigger and Lenis load from a CDN for motion. Files that must not be served publicly are listed in `.assetsignore`.

## Users

Owners of busy, owner-run UK businesses who are good at the job and buried in the admin around it. First focus: home improvement (kitchens, bathrooms, windows, roofing). Second: clinics, dental and private healthcare. They mostly visit on a phone, between jobs, and buy booked jobs and saved time, not "AI".

## Product Purpose

Surge Lab builds the systems that let a business grow without the owner working more hours: more work in, more time back, more of the business running itself. Success for the site is a booked 15-minute call.

## Positioning

Built, not rented. Surge Lab builds its own systems instead of reselling off-the-shelf software, joins leads, calls, reviews and admin into one system, and runs its own lead gen on the same systems. The point is automating the repetitive work so owners can focus on the business.

Three pillars, six services:
- Win more work: websites, database reactivation, AI lead follow-up, reviews and referrals (add-on)
- Get your time back: AI voice receptionist, AI website chatbot
- Run on autopilot: custom systems (CRMs, automations, AI chatbots, document AI/RAG, lead gen engines, quoting tools)

## Operating Context

The site is the demo: the contact form texts the enquirer back within 60 seconds, the site chatbot answers questions and books calls, and the site loads fast. Primary action everywhere: "Book a 15-minute call". Secondary: "See what's in your old leads" (reactivation calculator). Low commitment: "Try our chatbot".

## Capabilities and Constraints

- Pricing on site: no no-win-no-fee offer anywhere (Joe, 29 Oct 2026). Reviews may show as an add-on. Voice receptionist and chatbot may show a "from" price. Lead follow-up and custom systems never show prices.
- The chatbot never quotes retainer prices and always offers the call.
- UK GDPR and PECR: unticked SMS consent box, the instant text only fires when ticked, the chatbot discloses it is AI, cookie reject is as easy as accept, no analytics before consent.
- Performance: under 2s on mobile 4G, Lighthouse 90+. Accessibility: WCAG 2.2 AA.
- `web-design.html` is a live Google Ads landing page for the older web design offer and stays untouched by this rebuild.
- Undecided: booking tool (Cal.com or Calendly), SMS and chatbot backend (being built separately), Turnstile site key.

## Brand Commitments

- Colours come from the logo (a flask with teal-green liquid and a rising arrow): deep green-black grounds with the logo's mint as the accent. Joe asked for a new colourway on 29 Oct 2026, replacing the old navy and cyan.
- Voice: talk like you would to an owner over a brew. Short sentences, British spelling, a bit of cheek, a number, result or picture of their day in every line. Use their words: booked jobs, your diary, your evenings, quotes that went quiet.
- Banned words: solutions, leverage, streamline, empower, elevate, unlock, seamless, cutting-edge, game-changer, next level, revolutionise, transform your business, "in today's fast-paced world". No exclamation marks in headlines. No em dashes anywhere.
- Never describe the work as "hand-coded" in any copy.
- Say AI where it builds trust, never as the headline.

## Evidence on Hand

- Three real Google reviews exist, but they are for web design work, not these services.
- None yet: case study figures, team photos, demo call recording, anonymised reactivation threads, company number, registered address, ICO number, booking link. Never invent any of these. Example message threads are allowed when labelled as examples.

## Product Principles

1. Outcomes first: booked jobs, evenings back, admin gone.
2. Prove it on the page: the site does what it sells.
3. One action: book the 15-minute call.
4. Automate the boring bits so owners get time back.
5. Never fake proof.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, keyboard navigation, visible focus, alt text, reduced motion respected.
