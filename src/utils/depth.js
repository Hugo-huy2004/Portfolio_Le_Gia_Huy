// Pointer depth: each [data-depth] region gets --mx/--my (-1…1, eased like a damped follow) and --tilt (deg) from where the
// pointer is over it; the CSS turns those into parallax layers and 3D tilt. Only individual `translate`/`rotate` properties
// are driven, so GSAP and motion keep their own `transform`. Fine pointers only, off for reduced motion.
const ease = 0.1;

export function startDepth() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const live = new Map(); // region → { x, y, tx, ty }
  let raf = 0;
  const tick = () => {
    raf = 0;
    for (const [el, s] of live) {
      s.x += (s.tx - s.x) * ease;
      s.y += (s.ty - s.y) * ease;
      const settled = Math.abs(s.tx - s.x) < 0.002 && Math.abs(s.ty - s.y) < 0.002;
      if (settled) { s.x = s.tx; s.y = s.ty; }
      el.style.setProperty("--mx", s.x.toFixed(3));
      el.style.setProperty("--my", s.y.toFixed(3));
      el.style.setProperty("--tilt", `${(Math.hypot(s.x, s.y) * 6).toFixed(2)}deg`);
      if (settled && !s.tx && !s.ty) live.delete(el);
    }
    if (live.size) raf = requestAnimationFrame(tick);
  };
  const aim = (el, tx, ty) => {
    const s = (el.__depth ||= { x: 0, y: 0, tx: 0, ty: 0 });
    s.tx = tx; s.ty = ty; live.set(el, s);
    raf ||= requestAnimationFrame(tick);
  };
  let current = null;
  const move = (event) => {
    const el = event.target.closest?.("[data-depth]") || null;
    if (current && current !== el) aim(current, 0, 0);
    current = el;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    aim(el, clamp(((event.clientX - box.left) / box.width) * 2 - 1), clamp(((event.clientY - box.top) / box.height) * 2 - 1));
  };
  const leave = () => { if (current) aim(current, 0, 0); current = null; };
  document.addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  return () => {
    document.removeEventListener("pointermove", move);
    document.documentElement.removeEventListener("pointerleave", leave);
    cancelAnimationFrame(raf);
  };
}
