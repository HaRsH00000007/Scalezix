# Scalezix website (dev build)

The Scalezix site, built on the layout of a mirrored altrdtech.com build (prerendered React 19 / TanStack Start).
All text, branding and contact details come from [scalezix.com](https://www.scalezix.com) (October 2026).

## Run it

```sh
npm start          # or: node server.js
```

Open http://localhost:4173. Other port: `PORT=8080 node server.js` (PowerShell: `$env:PORT=8080; node server.js`).
Requires Node 18+. Don't open the `.html` files directly from disk: browsers block the site's JS on `file://`.

## Pages

| URL               | Nav label        | Content from scalezix.com                       |
| ----------------- | ---------------- | ----------------------------------------------- |
| `/`               | Home             | home, process, FAQ, blog                        |
| `/what-we-do`     | Services         | services (capability pillars, security)         |
| `/who-we-are`     | About Us         | about (founder, mission, values, offices)       |
| `/customer`       | Results          | results, case studies                           |
| `/privacy-policy` | Privacy Policy   | privacy (Scalezix's own page is a placeholder)  |
| `/terms-of-use`   | Terms of Service | terms (Scalezix's own page is a placeholder)    |

The URLs keep the original route names because they are compiled into the JS bundle.

## Changing text

Page text lives in two places that must match: the prerendered HTML (`altrdtech.com/*.html`) and the JS
chunks (`altrdtech.com/assets/*.js`). If they differ, React throws away the server HTML on load.

To change a piece of text, add a pair to `tools/content-map.js` (current text → new text) and run:

```sh
npm install        # once, installs the JS parser the tool uses
npm run content
```

It replaces the text in both places, reports anything it could not find, and then renames the changed JS
chunks (`tools/version-assets.js`) so no browser keeps running an old cached copy. After running it, load
each page and check the browser console for hydration errors.

## Still to do before going live

- **Photos.** Scalezix has no photos on its site, so the slots that held people/office photos now show
  generated Scalezix graphics. Replace these files with real photos (same names and sizes):
  - `img/people/tm-founder.jpg` (founder, 1644×1166)
  - `img/wwa-hero/wwa-*.jpg` (About hero), `img/people/tm-team-*.jpg` (team strip)
  - `img/people/tm-leader-*.jpg` (values cards), `img/results/DSC00432.jpg`, `img/why-now/DSC00226.jpg` (home)
- **Legal pages.** Privacy Policy and Terms of Service contain Scalezix's placeholder text. Add final legal copy.
- **Contact form.** `server.js` saves submissions to `submissions/contact.jsonl`; no email is sent. Replace
  `handleServerFn` in `server.js` to deliver leads (email, CRM, WhatsApp).
- **Pages not carried over.** scalezix.com also has pricing, product, individual service, Canada city and blog
  pages; this build has the six pages above, and links to the blog/careers point at scalezix.com.

## Deploying

`altrdtech.com/` is a static site; any host that maps clean URLs to `.html` files works (Netlify, Vercel,
Cloudflare Pages, `npx serve`). The contact form needs `POST /_serverFn/*` handled as in `server.js`.
