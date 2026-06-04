# slides

HTML presentations built with [reveal.js](https://revealjs.com/).

Event site: [vibehuus.be](https://vibehuus.be/)

**Live index:** https://slides.sebastienbarbier.com/

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

On every push to `main`, [GitHub Actions](.github/workflows/deploy-pages.yml) publishes to **https://slides.sebastienbarbier.com/**:

- `/` — this README as HTML
- `/<folder>/` — each deck (folder name = URL path)

### One-time setup

**GitHub** (repo **Settings → Pages**):

1. **Build and deployment → Source:** GitHub Actions
2. **Custom domain:** `slides.sebastienbarbier.com` (should match the [`CNAME`](CNAME) file deployed by the workflow)
3. Enable **Enforce HTTPS** once DNS is verified

**DNS** (at your domain registrar):

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `slides` | `sebastienbarbier.github.io` |

Verification can take a few minutes up to 24 hours.
