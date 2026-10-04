import Reveal from "../node_modules/reveal.js/dist/reveal.esm.js";
import Notes from "../node_modules/reveal.js/plugin/notes/notes.esm.js";

// reveal.js 5 turns ?print-pdf into the built-in print view. There is no
// separate pdf.css in the published package.
Reveal.initialize({
  hash: true,
  controls: false,
  progress: false,
  slideNumber: false,
  center: false,
  transition: "fade",
  backgroundTransition: "fade",
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.2,
  maxScale: 2,
  pdfSeparateFragments: false,
  pdfMaxPagesPerSlide: 1,
  plugins: [Notes],
});
