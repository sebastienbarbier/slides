/**
 * Animated river background — adapted from vibehuus.be scene.js for reveal.js slides.
 */
export function createRiverScene(canvas) {
  const ctx = canvas.getContext("2d");

  let W = 0;
  let H = 0;
  let dpr = 1;
  let running = false;
  let rafId = 0;
  let particles = [];
  let riverSamples = [];
  let totalLen = 0;
  let bgCanvas = null;
  let lastT = 0;

  const RIVER_POINTS = [
    [0.34, 0.0],
    [0.34, 0.19],
    [0.36, 0.323],
    [0.485, 0.33],
    [0.62, 0.345],
    [0.64, 0.41],
    [0.625, 0.475],
    [0.525, 0.485],
    [0.435, 0.49],
    [0.41, 0.55],
    [0.41, 0.65],
    [0.41, 0.78],
    [0.41, 0.9],
    [0.41, 1.0],
  ];

  function catmullSamples(pts, perSeg = 70) {
    const out = [];
    if (pts.length < 2) return out;
    const all = [pts[0], ...pts, pts[pts.length - 1]];

    for (let i = 0; i < all.length - 3; i++) {
      const p0 = all[i];
      const p1 = all[i + 1];
      const p2 = all[i + 2];
      const p3 = all[i + 3];
      for (let j = 0; j < perSeg; j++) {
        const t = j / perSeg;
        const t2 = t * t;
        const t3 = t2 * t;
        const x =
          0.5 *
          (2 * p1[0] +
            (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        const y =
          0.5 *
          (2 * p1[1] +
            (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
        const dx =
          0.5 *
          (-p0[0] +
            p2[0] +
            2 * (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t +
            3 * (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t2);
        const dy =
          0.5 *
          (-p0[1] +
            p2[1] +
            2 * (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t +
            3 * (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t2);
        const l = Math.hypot(dx, dy) || 1;
        out.push({ x, y, tx: dx / l, ty: dy / l, s: 0, u: 0 });
      }
    }
    const last = pts[pts.length - 1];
    const prev = out[out.length - 1] || { tx: 0, ty: 1 };
    out.push({ x: last[0], y: last[1], tx: prev.tx, ty: prev.ty, s: 0, u: 0 });

    let cum = 0;
    for (let i = 0; i < out.length; i++) {
      if (i > 0) {
        cum += Math.hypot(out[i].x - out[i - 1].x, out[i].y - out[i - 1].y);
      }
      out[i].s = cum;
    }
    totalLen = cum || 1;
    for (let i = 0; i < out.length; i++) out[i].u = out[i].s / totalLen;
    return out;
  }

  function strokeRiver(g, samples, width, color) {
    g.strokeStyle = color;
    g.lineWidth = width;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(samples[0].x, samples[0].y);
    for (let i = 1; i < samples.length; i++) g.lineTo(samples[i].x, samples[i].y);
    g.stroke();
  }

  const FAN_EXPONENT = 1.15;
  const SIDE_STRIPS = [
    { xInner: 0.22, xOuter: 0.04, count: 7 },
    { xInner: 0.78, xOuter: 0.96, count: 7 },
  ];

  function drawCartography(g) {
    if (W < 720) return;
    g.save();
    g.strokeStyle = "rgba(117, 172, 210, 0.34)";
    g.lineWidth = 1;
    for (const strip of SIDE_STRIPS) {
      for (let i = 0; i < strip.count; i++) {
        const s = strip.count === 1 ? 0 : i / (strip.count - 1);
        const t = Math.pow(s, FAN_EXPONENT);
        const x = (strip.xInner + (strip.xOuter - strip.xInner) * t) * W;
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, H);
        g.stroke();
      }
    }
    g.restore();
  }

  function buildBackground() {
    bgCanvas = document.createElement("canvas");
    bgCanvas.width = W * dpr;
    bgCanvas.height = H * dpr;
    const g = bgCanvas.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#FFFFFF";
    g.fillRect(0, 0, W, H);
    drawCartography(g);
    const samplesPx = riverSamples.map((s) => ({ x: s.x, y: s.y }));
    strokeRiver(g, samplesPx, Math.max(28, W * 0.026), "rgba(90, 149, 200, 0.18)");
    strokeRiver(g, samplesPx, Math.max(22, W * 0.02), "#75ACD2");
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial) {
      this.u = initial ? Math.random() : Math.random() * 0.04;
      this.speed = 0.00001 + Math.random() * 0.000028;
      this.depth = Math.random();
      this.lateral = (Math.random() - 0.5) * 1.4;
      this.size = 0.5 + Math.random() * (1.1 + this.depth * 0.9);
      this.swayPhase = Math.random() * Math.PI * 2;
      this.swayFreq = 0.0009 + Math.random() * 0.0017;
      this.swayAmp = 0.4 + Math.random() * 2.6;
      this.breathePh = Math.random() * Math.PI * 2;
    }

    update(t, dt, samples) {
      this.u += this.speed * dt;
      if (this.u >= 1) this.reset(false);

      const fIdx = this.u * (samples.length - 1);
      const i0 = Math.floor(fIdx);
      const i1 = Math.min(i0 + 1, samples.length - 1);
      const f = fIdx - i0;
      const s0 = samples[i0];
      const s1 = samples[i1];
      const x = s0.x + (s1.x - s0.x) * f;
      const y = s0.y + (s1.y - s0.y) * f;
      const tx = s0.tx + (s1.tx - s0.tx) * f;
      const ty = s0.ty + (s1.ty - s0.ty) * f;
      const tl = Math.hypot(tx, ty) || 1;
      const nx = -ty / tl;
      const ny = tx / tl;
      const channelHalf = Math.max(7, W * 0.008);
      const sway = Math.sin(t * this.swayFreq + this.swayPhase) * this.swayAmp;
      const off = this.lateral * channelHalf + sway;
      this.x = x + nx * off;
      this.y = y + ny * off;
      const fadeIn = Math.min(1, this.u * 14);
      const fadeOut = Math.min(1, (1 - this.u) * 14);
      const breathe = 0.78 + 0.22 * Math.sin(t * 0.0013 + this.breathePh);
      this.alpha = fadeIn * fadeOut * breathe * (0.45 + this.depth * 0.55);
    }

    draw(g) {
      if (this.alpha < 0.01) return;
      g.globalAlpha = this.alpha;
      g.fillStyle = "#F2F8FF";
      g.beginPath();
      g.arc(this.x, this.y, Math.max(0.3, this.size), 0, 6.2832);
      g.fill();
    }
  }

  function init() {
    if (!W || !H) return;
    const px = RIVER_POINTS.map(([x, y]) => [x * W, y * H]);
    riverSamples = catmullSamples(px, 70);
    buildBackground();
    const target = Math.floor(Math.min(2000, totalLen * 1.4));
    particles = Array.from({ length: target }, () => new Particle());
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    const nW = Math.round(rect.width);
    const nH = Math.round(rect.height);
    if (nW === W && nH === H && canvas.width === nW * dpr) return;
    W = nW;
    H = nH;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    init();
  }

  function animate(t) {
    if (!running) return;
    rafId = requestAnimationFrame(animate);
    const dt = lastT ? Math.min(50, t - lastT) : 16;
    lastT = t;
    if (!particles.length) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0);
    else {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(t, dt, riverSamples);
      particles[i].draw(ctx);
    }
    ctx.globalAlpha = 1;
  }

  let resizeTimer;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  ro.observe(canvas);

  resize();

  return {
    start() {
      if (running) return;
      running = true;
      lastT = 0;
      resize();
      rafId = requestAnimationFrame(animate);
    },
    stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    },
    destroy() {
      this.stop();
      ro.disconnect();
    },
  };
}
