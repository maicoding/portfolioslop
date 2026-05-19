# Portfolio Slop

A deliberately over-generated AI slop portfolio experiment for Claudia Mai.

It is a separate project and does not modify the existing portfolio site.
The original site's pages, tools, assets, public media, PDFs, 3D models, text
files, Vite config, and Netlify functions are included here as part of the Slop
version.

## Run

Use Vite so the imported modules and old tool pages resolve correctly:

```bash
npm install
npm run dev
```

Then visit `http://localhost:4173`.

## Files

- `index.html` contains the page structure.
- `styles.css` contains the full visual system.
- `script.js` powers the playful filters, status console, controls, and canvas particles.
- `assets/slop-hero.png` is the generated hero/background asset.
- `design/ai-slop-concept.png` is the generated design reference.
- `classic-index.html` is the original gateway page.
- `src/`, `public/`, `netlify/`, and the copied HTML entry points preserve the
  old portfolio content and interactive tools.
