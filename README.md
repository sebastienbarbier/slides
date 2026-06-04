# slides

HTML presentations built with [reveal.js](https://revealjs.com/).

**Live index:** https://sebastienbarbier.github.io/slides/

## Published decks

| Deck | URL |
| --- | --- |
| ShellUI — building webapp from the ground up | [260505-vibehuus-shellui/](260505-vibehuus-shellui/) |

To add a deck: create a folder with `index.html` and `package.json`, then add a row to the table above.

## Local preview

**Single deck:**

```bash
cd 260505-vibehuus-shellui
npm install
npm start
```

Open http://localhost:5173

## GitHub Pages

On every push to `main`, [GitHub Actions](.github/workflows/deploy-pages.yml) publishes:

- `/` — this README as HTML
- `/<folder>/` — each deck (folder name = URL path)

**One-time setup** (repo settings):

1. **Settings → Pages → Build and deployment**
2. Set **Source** to **GitHub Actions**
