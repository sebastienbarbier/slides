# slides

HTML presentations. The Vibehuus talk uses [reveal.js](https://revealjs.com/). The Shellui pitch exists twice, once in reveal.js and once in [open-slide](https://open-slide.dev), so the two tools can be compared on the same content. See [261004-shellui-pitch-COMPARISON.md](261004-shellui-pitch-COMPARISON.md).

Event site: [vibehuus.be](https://vibehuus.be/)

**Live index:** https://slides.sebastienbarbier.com/

## Published decks

| Deck | URL |
| --- | --- |
| ShellUI: building webapp from the ground up | [260605-vibehuus-shellui/](260605-vibehuus-shellui/) |
| Shellui pitch (reveal.js) | [261004-shellui-pitch-revealjs/](261004-shellui-pitch-revealjs/) |
| Shellui pitch (open-slide) | [261004-shellui-pitch-openslide/](261004-shellui-pitch-openslide/) |

To add a reveal.js deck: create a folder with `index.html` and `package.json`, then add a row to the table above. An open-slide deck is a folder with `package.json`, `open-slide.config.ts`, and `slidesPages.output` set to the static build folder (`dist`).

## Local preview

**Vibehuus deck (npm):**

```bash
cd 260605-vibehuus-shellui
npm install
npm start
```

Open http://localhost:5173

**Shellui pitch, either tool (pnpm):**

```bash
cd 261004-shellui-pitch-revealjs
pnpm install
pnpm start
```

reveal.js: http://localhost:5173

```bash
cd 261004-shellui-pitch-openslide
pnpm install
pnpm start
```

open-slide: http://localhost:5174/s/shellui-pitch

`pnpm start` prints the URL. No global install and no build before the first preview.

## GitHub Pages

On every push to `main`, [GitHub Actions](.github/workflows/deploy-pages.yml) publishes to **https://slides.sebastienbarbier.com/**:

- `/` is this README as HTML
- `/<folder>/` is each deck (folder name = URL path)

The open-slide pitch itself is at `/261004-shellui-pitch-openslide/s/shellui-pitch`. The folder root is the deck list.

### One-time setup

**GitHub** (repo **Settings → Pages**):

1. **Build and deployment → Source:** GitHub Actions
2. **Custom domain:** `slides.sebastienbarbier.com` (should match the [`CNAME`](CNAME) file deployed by the workflow)
3. Enable **Enforce HTTPS** once DNS is verified

**DNS** (at your domain registrar):

| Type  | Name     | Value                        |
| ----- | -------- | ---------------------------- |
| CNAME | `slides` | `sebastienbarbier.github.io` |

Verification can take a few minutes up to 24 hours.
