# surgelab.co.uk

The Surge Lab website: plain HTML, CSS and JavaScript served by a Cloudflare Worker, plus a Claude-powered chatbot.

## How publishing works

- **Anything merged into `main` goes live within a minute or two.** Cloudflare Workers Builds is connected to this repo and deploys every push to `main` to surgelab.co.uk.
- **Pushing any other branch makes a private preview** instead. Cloudflare posts the preview link on the commit's check (the green tick next to it on GitHub), in the form `https://<branch-name>-surgelabsite.snowy-haze-32a7.workers.dev`.
- **A failed build never takes the site down.** Cloudflare keeps the current version live.
- To roll back: Cloudflare dashboard, then `surgelabsite`, then Deployments, then pick an earlier version and Rollback.

**Safest way to make a change:** create a branch, edit, check the preview link, then open a pull request into `main` and merge it.

## Where things are

| What | File |
| --- | --- |
| Home page | `index.html` |
| Other pages | `websites.html`, `reactivation.html`, `book.html` and so on. The URL drops `.html` (`/reactivation`). |
| Google Ads landing page | `web-design.html`, older design, linked from the ads. Edit with care. |
| Styles for every page | `assets/site.css` |
| Menus, cookie banner, calculator, forms | `assets/site.js` |
| Chat bubble and panel | `assets/chat.js` |
| What the chatbot knows and its rules | `src/chat-prompt.js` |
| Chatbot server code | `src/chat.js` |
| Form emails and routing | `worker.js` |
| Cloudflare settings and chat rate limit | `wrangler.jsonc` |
| Sitemap | `sitemap.xml` |
| Design rules (colours, fonts, components) | `DESIGN.md` |
| Who the site is for and what it may claim | `PRODUCT.md` |

Markdown files, `src/`, `worker.js`, `wrangler.jsonc` and npm files are listed in `.assetsignore`, so they are never served on the website.

## Things that catch people out

- **The header, footer and icon set are copied into every page.** A menu or footer change has to be made in all the `.html` files, not just one. They sit between `<!-- header -->`, `<!-- footer -->` and `<!-- sprite -->` comments.
- **After editing `site.css`, `site.js` or `chat.js`, bump the `?v=` number** where each page links to it (for example `site.css?v=14` to `?v=15`) in every page, or visitors' browsers keep showing the old file.
- **Chatbot prompt changes take effect for new conversations.** Prices: it may only quote reviews and referrals from £150 a month; everything else is "fixed price on the call".
- **Secrets live in Cloudflare, never in this repo.** `BREVO_KEY` sends form and callback emails; `ANTHROPIC_API_KEY` powers the chatbot. Never commit a key, and never paste one into a file here.
- **Adding a variable in the Cloudflare dashboard with "Add variable and deploy" deploys the newest uploaded version, which can be an unreviewed preview branch.** Check the Deployments list first.
- **iCloud sometimes creates duplicates such as `privacy 2.html`.** They are ignored by git; delete them if you see them.

## Copy rules

- No em dashes. No "hand-coded" (use custom-coded, coded from scratch).
- Avoid: solutions, leverage, streamline, empower, elevate, unlock, seamless, cutting-edge, game-changer, next level, revolutionise, transform your business.
- No no-win-no-fee offers. No invented results, testimonials or logos.
- British spelling, short sentences, one action: "Book a 15-minute call".

## Running it locally (optional)

```bash
npm install
npx wrangler dev
```

For the chatbot to answer locally, create a `.dev.vars` file containing `ANTHROPIC_API_KEY=` and the key. It is ignored by git. Without it the chat says it isn't switched on yet.
