# Portfolio Slop

A deliberately over-generated AI slop portfolio experiment for Claudia Mai.

It is a separate project and does not modify the existing portfolio site.
The original site's pages, tools, assets, public media, PDFs, text files, Vite
config, and Netlify functions are included here as part of the Slop version.
Heavy model assets were removed for the flattened Slop Gallery build.

## Run

Use Vite so the imported modules and old tool pages resolve correctly:

```bash
npm install
npm run dev
```

Then visit `http://localhost:4173`.

## GitHub Pages

The project ships with a Pages-specific build because it is deployed as a
project site under `/portfolioslop/`:

```bash
npm run build:pages
```

That command builds with Vite's Pages base path, prefixes preserved root-level
URLs in copied legacy pages, and adds `dist/.nojekyll` so GitHub Pages serves
underscored assets and folders normally. The workflow in
`.github/workflows/deploy-pages.yml` publishes `dist` on every push to `main`.

Expected Pages URL:

```text
https://maicoding.github.io/portfolioslop/
```

The Netlify functions are kept for the Netlify version and for source parity
with the old portfolio. GitHub Pages is static, so dynamic function calls should
use the existing client-side fallbacks there.

## Files

- `index.html` contains the page structure.
- `styles.css` contains the full visual system.
- `script.js` powers the playful filters, status console, controls, and canvas particles.
- `assets/slop-hero.png` is the generated hero/background asset.
- `design/ai-slop-concept.png` is the generated design reference.
- `classic-index.html` is the original gateway page.
- `src/`, `public/`, `netlify/`, and the copied HTML entry points preserve the
  old portfolio content and interactive tools.
