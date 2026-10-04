# Shellui pitch: reveal.js and open-slide

Same 8-slide Shellui pitch, same copy, same resting layout, speaker notes on every slide. Facts are from shellui.com. This note is what actually happened while building both, on reveal.js 5.2.1 and open-slide 2.0.1 (`@open-slide/core`, React 19).

## Which tool made the visual work easier

open-slide. The shell sequence is one 1920x1080 canvas, absolute pixels, `Steps` for the staged reveals, and `MorphElement` so the shell frame moves from the single iframe, to four apps, to the services around it. reveal.js can match those resting frames (same CSS, `fragment` for the same steps) and fade between them. It has no shared-element transition, so the in-between frames are not the same. Children inside a morph node squash while it glides. That is a real difference, and the resting slides were lined up by hand in both tools.

## Agent authoring and code per slide

| | open-slide | reveal.js |
| --- | --- | --- |
| Deck source | `slides/shellui-pitch/index.tsx`, 825 lines | `index.html` 209, `css/shellui.css` 389, `js/main.js` 22 |
| Shape | One React module. The scaffold skill asks for one file, no sibling components, and no `array.map` for repeated visuals, so the windows and docks are written out. | One HTML file plus one stylesheet. Fragments repeat the same structure. |
| Scaffold | CLI init (`@open-slide/cli`, pnpm, no git). It added AGENTS.md, skill symlinks, and a getting-started deck of about 5500 lines, which was deleted. | A folder, `package.json`, and three files. |

Both decks are custom drawings, so the code per slide is high either way. The open-slide file is longer because the motion components and the CSS injection live in the same module. A `<style>` tag inside the React tree made Vite warn about a script tag. The stylesheet is injected from an effect instead.

`pnpm install` then `pnpm start` is enough for each new deck. `packageManager` is `pnpm@10.33.3`, the lockfile is committed, and `start` prints the URL. The Vibehuus deck stays on npm.

## Layout freedom

Both can place arbitrary CSS and SVG. open-slide's canvas is the default and scales as one unit. reveal.js needed `width: 1920`, `height: 1080`, `margin: 0`, `center: false`, and a reset of its heading CSS before the same coordinates landed.

The dock animation is CSS in both (420ms, off under `prefers-reduced-motion`). open-slide's own step fade also collapses under reduced motion.

## Animations and steps

reveal.js fragments advance on the arrow keys, with no mode switch. A hash URL does not reveal fragments, so `#/6` shows the MIT slide before the three drawings.

open-slide `Steps` advance one at a time in play mode (`F`, or `Enter` for a window) and in the production player. In the editor, arrow keys jump a whole page. Landing on Again that way showed all four steps already revealed. `?p=` does the same. Press `F`, and the next arrow reveals one step. That split is in `slide.tsx`: the page-nav handler bails only when `playMode` is set or `showSlideUi` is false.

Dev ignores `build.showSlideUi`. `@open-slide/core` 2.0.1 forces the editor on whenever `isDev` is true. The production build honors the flag. This repo sets `showSlideUi: false`, so GitHub Pages serves the player. Checked on the built bundle (`showSlideUi:!1`) and on a local `_site`: the first arrow reached Again with four pending steps, and the second revealed one.

## Presenter and speaker notes

Notes are plain text on all 8 slides in both decks.

reveal.js: `S` opens the notes window (current slide, upcoming slide, timer, notes). Checked on the title slide.

open-slide: `P` opens `/s/shellui-pitch/presenter` linked to the deck (now, next, notes, timer, jump). Opening that URL on its own shows NOT LINKED. The linked window is the one `P` opens.

## PDF export

Both exports are 8 pages, and page 7 of each shows the three drawings (fragments and steps fully revealed).

reveal.js: open `?print-pdf` and print, with margins none and background graphics on. 5.2.1 has no `dist/print/pdf.css`. Linking that old path 404s. The gold wash survived. The file has shading objects, and a raster of page 1 still shows the corners. `pdfSeparateFragments` is false, so each slide is one page.

open-slide: there is no CLI export. The editor toolbar, or Ctrl/Cmd+K then PDF, builds `#os-print-root` and calls `window.print()`. The library marks Safari as unsupported. Before print, `neutralizeGradientBackgrounds` strips CSS gradients so Chromium does not emit them as soft masks. A raster of page 1 is flat white. The gold iframe border is a border, so it is still there. The Pages player hides the editor, so that build has no PDF button. Export from `pnpm start`.

## Live editing and commenting

The editor is real in dev: thumbnails, a format panel, the design panel, and an agent badge. Double-click text to edit, click an object to format it.

The `apply-comments` skill is in the scaffold and is written to persist `@slide-comment` markers. That loop was not run on this deck, so this note does not claim it works end to end.

The home card wraps the live thumbnail in a link. The title and close slides contain real links, so the deck list logs that an `<a>` cannot contain an `<a>`, plus a Vite script-tag warning. The slide page itself does not nest those links.

## Build and deploy on GitHub Pages

`scripts/build-pages.sh` runs from the workflow. A deck whose `packageManager` starts with `pnpm` gets `pnpm install --frozen-lockfile`. Anything else gets `npm ci`. That frozen install succeeded for both new decks.

The Vibehuus `build` script is exactly `npm ci`, so the script installs and copies the folder, including `node_modules` (reveal.css is loaded from there). Served `/260605-vibehuus-shellui/` and the page title loaded.

The reveal pitch has no build script, so the folder is copied the same way. Served it. The hero text rendered, and `reveal.css` plus `css/shellui.css` returned 200.

open-slide sets `slidesPages.output` to `dist`. The build runs with `SLIDE_BASE=/261004-shellui-pitch-openslide/`. Published size is 1.8MB. The main JS is 1.3MB (387KB gzip). Geist webfonts are still in that output. The deck uses the system font. The runtime still includes editor code with `showSlideUi` false.

GitHub Pages does not rewrite unknown paths to `index.html`. The script copies `index.html` onto `/s/<id>/` and `/s/<id>/presenter/`. Both returned 200 under a local static server, and the player booted. The folder root stays the deck list (`showSlideBrowser` stays true), so the talk URL is `/261004-shellui-pitch-openslide/s/shellui-pitch`.

The workflow deploys on push to `main` only.

## Dependencies and weight

| | open-slide | reveal.js pitch | Vibehuus (existing) |
| --- | --- | --- | --- |
| `node_modules` | 257MB | 11MB | (npm, unchanged) |
| Published folder | 1.8MB | 15MB, because `node_modules` is copied | 6.2MB |
| Runtime | React 19 plus the open-slide app | reveal.js 5.2.1 and `serve` for local preview | reveal.js, npm |

## Maturity and ecosystem

reveal.js is the established one: print view, a notes plugin, and a long public API. open-slide 2.0.1 is MIT, aimed at agents, and ships skills for authoring, themes, and comments. Its config surface that this deck used (`base`, `port`, `build.showSlideUi`, `Step`, `Steps`, `MorphElement`, `notes`, `transition`, `useIsActivePage`) matches the published types and the README. Nothing here was invented to fill a gap.

## Accessibility and keyboard

Both decks are keyboard navigable, with real links on the title and the close. reveal.js fragment keys work immediately, and links have a visible focus ring. open-slide steps need play mode while the editor is up, and they follow the arrow keys in the player. The custom dock motion is disabled under `prefers-reduced-motion` in both.

## Pick one

Pick reveal.js if you want one HTML file, fragment keys with no mode switch, and a print URL that keeps background graphics.

Pick open-slide if an agent will iterate on a fixed canvas in the visual editor, and you want one element to move between pages.

## Friction actually hit

- Editor arrow keys skip `Steps`. Play mode, or a production build with `showSlideUi: false`, is what advances them.
- Dev ignores `showSlideUi: false` and always opens the editor.
- The deck-list thumbnail nests `<a>` inside `<a>` when a slide contains a link.
- PDF is an in-browser print. It strips CSS gradients. Safari is unsupported. There is no CLI.
- The presenter URL is NOT LINKED unless `P` opened it from the deck.
- reveal.js 5.2.1 has no `pdf.css`. The first draft linked it and 404ed.
- The scaffold's AGENTS.md says not to edit `package.json`. `start`, `packageManager`, and `slidesPages` had to change anyway.
- `base` has to stay unset for local preview. Set only for Pages, or every local URL grows the subpath.
- The published open-slide root is the deck list. The reveal deck is the talk itself.
