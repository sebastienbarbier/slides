# Shellui pitch (open-slide)

The same Shellui product pitch as `261004-shellui-pitch-revealjs`, built with [open-slide](https://open-slide.dev). Pages are React components on a 1920x1080 canvas.

## Local preview

From this folder:

```bash
pnpm install
pnpm start
```

Deck: http://localhost:5174/s/shellui-pitch

`pnpm start` prints that URL. No global install and no build step.

Speaker notes are on every page. Press `P` for the presenter view, or open http://localhost:5174/s/shellui-pitch/presenter

PDF export is in the deck toolbar (Export, then PDF). Safari does not support it.

## Pages

`pnpm build` writes a static site to `dist/`. The GitHub Pages workflow sets `SLIDE_BASE` so asset URLs work under `/261004-shellui-pitch-openslide/`.

The published deck is the player (`build.showSlideUi` is false). Arrow keys advance steps. `pnpm start` still opens the visual editor, because open-slide forces the editor on in dev. Press `F` there to play, since editor arrow keys skip steps.

The deck URL on Pages is `/261004-shellui-pitch-openslide/s/shellui-pitch`. The workflow copies `index.html` onto that path and the presenter path. GitHub Pages does not rewrite unknown paths to the app.
