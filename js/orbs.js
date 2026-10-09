// Official thinking-orbs 0.3.2 geometry and painter, hosted locally.
// The engine export lets this static site use the original animation without React.
document.addEventListener("DOMContentLoaded", () => {
  const engine = window.ThinkingOrbsEngine;
  if (!engine) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  const controllers = [];

  document.querySelectorAll(".orb-loader").forEach((host) => {
    const canvas = document.createElement("canvas");
    const size = 64;
    const displaySize = 96;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = displaySize * dpr;
    canvas.setAttribute("aria-hidden", "true");
    host.replaceChildren(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    host.classList.add("orb-ready");
    let preset;
    let dark;
    let tint;
    let visible = false;
    let raf = 0;

    function paint(time) {
      const scale = (dpr * displaySize) / size;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const frame = engine.MODE_FRAMES[preset.mode](size, time, preset.opts);
      engine.paintFrame(ctx, frame, dark, tint);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    function tick(time) {
      paint((time / 1000) * preset.speed);
      raf = requestAnimationFrame(tick);
    }
    function sync() {
      stop();
      const resolved = engine.resolvePreset(
        host.dataset.orbState || "connecting",
        size,
      );
      preset = { ...resolved, opts: { ...resolved.opts, dimBase: 0.86 } };
      const theme = document.documentElement.dataset.theme;
      dark = theme ? theme === "dark" : systemDark.matches;
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim()
        .replace("#", "");
      const rgb = parseInt(color, 16);
      tint = { r: (rgb >> 16) & 255, g: (rgb >> 8) & 255, b: rgb & 255 };
      // A brighter ink keeps the small dotted forms legible on black surfaces.
      if (dark) tint = { r: 144, g: 202, b: 255 };
      paint(reduced.matches ? 0.6 : (performance.now() / 1000) * preset.speed);
      if (visible && !reduced.matches && document.visibilityState !== "hidden")
        raf = requestAnimationFrame(tick);
    }
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    visibility.observe(canvas);
    const state = new MutationObserver(sync);
    state.observe(host, {
      attributes: true,
      attributeFilter: ["data-orb-state"],
    });
    sync();
    controllers.push({ sync, stop });
  });

  const syncAll = () => controllers.forEach((controller) => controller.sync());
  const theme = new MutationObserver(syncAll);
  theme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  reduced.addEventListener("change", syncAll);
  systemDark.addEventListener("change", syncAll);
  document.addEventListener("visibilitychange", syncAll);
  window.addEventListener("pagehide", () =>
    controllers.forEach((orb) => orb.stop()),
  );
  window.addEventListener("pageshow", syncAll);
});
