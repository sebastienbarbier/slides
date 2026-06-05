import Reveal from "../node_modules/reveal.js/dist/reveal.esm.js";
import { createRiverScene } from "./river-scene.js";

const canvas = document.getElementById("scene");
const heroSlide = document.querySelector(".slide-hero");
const river = canvas ? createRiverScene(canvas) : null;

Reveal.initialize({
  hash: true,
  slideNumber: "c/t",
  showSlideNumber: "all",
  transition: "fade",
  backgroundTransition: "fade",
  width: 1280,
  height: 720,
  margin: 0.04,
  pdfSeparateFragments: false,
  pdfMaxPagesPerSlide: 1,
});

/** Strip leading/trailing whitespace from list text (pretty-printed HTML). */
function trimListItemText() {
  document.querySelectorAll(".reveal ul li").forEach((li) => {
    li.normalize();
    for (const node of li.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.trim();
      }
    }
  });
}

function isHeroSlideActive() {
  if (!heroSlide || !Reveal.isReady?.()) return false;
  return Reveal.getCurrentSlide() === heroSlide;
}

function shouldRunRiver() {
  if (!river) return false;
  if (document.hidden) return false;
  if (Reveal.isOverview?.()) return false;
  if (Reveal.isPaused?.()) return false;
  if (!isHeroSlideActive()) return false;
  if (heroVisible === false) return false;
  return true;
}

let heroVisible = true;

function syncRiverAnimation() {
  if (shouldRunRiver()) {
    river.start();
  } else {
    river.stop();
  }
}

Reveal.on("ready", () => {
  trimListItemText();
  syncRiverAnimation();

  if (heroSlide && typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      (entries) => {
        heroVisible = entries.some(
          (e) => e.isIntersecting && e.intersectionRatio > 0.05,
        );
        syncRiverAnimation();
      },
      { threshold: [0, 0.05, 0.2] },
    );
    observer.observe(heroSlide);
  }
});

Reveal.on("slidechanged", syncRiverAnimation);
Reveal.on("overviewshown", syncRiverAnimation);
Reveal.on("overviewhidden", syncRiverAnimation);
Reveal.on("paused", syncRiverAnimation);
Reveal.on("resumed", syncRiverAnimation);

document.addEventListener("visibilitychange", syncRiverAnimation);
