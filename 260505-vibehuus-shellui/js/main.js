import Reveal from "../node_modules/reveal.js/dist/reveal.esm.js";
import { createRiverScene } from "./river-scene.js";

const canvas = document.getElementById("scene");
const river = canvas ? createRiverScene(canvas) : null;

Reveal.initialize({
  hash: true,
  slideNumber: "c/t",
  transition: "fade",
  backgroundTransition: "fade",
  width: 1280,
  height: 720,
  margin: 0.04,
});

function syncRiverAnimation() {
  if (!river) return;
  const indices = Reveal.getIndices();
  if (indices.h === 0 && indices.v === 0) {
    river.start();
  } else {
    river.stop();
  }
}

Reveal.on("ready", syncRiverAnimation);
Reveal.on("slidechanged", syncRiverAnimation);
