import { useEffect, useRef } from "react";
import { SmartImg } from "./Resilience";

/**
 * Greenwich chapter visual, in the invitation letter's palette (night navy, Greenwich blue, champagne silver):
 * the award photo as a 3D card that leans toward the pointer, the university emblem turning like a coin in front of it,
 * and silver dust rising behind. Dust is ported from invitation-letter/components/GoldDust.tsx.
 */

function Dust({ count = 46 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    // Only animate while on screen.
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { prev = performance.now(); raf = requestAnimationFrame(tick); } });
    io.observe(canvas);
    const motes = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 2,
      speed: 0.00006 + Math.random() * 0.00014, sway: Math.random() * Math.PI * 2, depth: 0.35 + Math.random() * 0.65,
    }));
    // One pre-drawn glow, stamped per mote: far cheaper than building a gradient for every mote every frame.
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const sg = sprite.getContext("2d");
    const glow = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
    glow.addColorStop(0, "rgb(220 230 247)");
    glow.addColorStop(1, "rgb(184 201 234 / 0)");
    sg.fillStyle = glow;
    sg.fillRect(0, 0, 32, 32);
    let prev = performance.now();
    function tick(t) {
      if (!visible) return;
      raf = requestAnimationFrame(tick);
      const dt = Math.min(t - prev, 50);
      prev = t;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.speed * dt * m.depth;
        if (m.y < -0.05) { m.y = 1.05; m.x = Math.random(); }
        m.sway += dt * 0.0012;
        const x = (m.x + Math.sin(m.sway) * 0.008) * w;
        const r = m.r * 4;
        ctx.globalAlpha = 0.85 * m.depth;
        ctx.drawImage(sprite, x - r, m.y * h - r, r * 2, r * 2);
      }
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [count]);
  return <canvas ref={ref} className="gre-dust" aria-hidden="true" />;
}

export default function GreenwichStage({ alt }) {
  const card = useRef(null);
  const tilt = (event) => {
    const box = card.current.getBoundingClientRect();
    card.current.style.setProperty("--ry", `${((event.clientX - box.left) / box.width - 0.5) * 22}deg`);
    card.current.style.setProperty("--rx", `${((event.clientY - box.top) / box.height - 0.5) * -18}deg`);
  };
  const rest = () => { card.current.style.removeProperty("--rx"); card.current.style.removeProperty("--ry"); };
  return (
    <div className="gre-stage">
      <Dust />
      <figure ref={card} className="gre-card" onPointerMove={tilt} onPointerLeave={rest}>
        <span className="gre-card-glow" aria-hidden="true" />
        <span className="gre-card-photo">
          <SmartImg src="/journey-photos/greenwich-award-portrait.webp" srcSet="/journey-photos/greenwich-award-portrait-800.webp 800w, /journey-photos/greenwich-award-portrait.webp 1600w"
            sizes="(max-width: 820px) 70vw, 420px" alt={alt} />
        </span>
        <span className="gre-card-frame" aria-hidden="true" />
        <span className="gre-coin" aria-hidden="true">
          <span className="gre-coin-face"><img src="/education/greenwich-emblem.webp" alt="" /></span>
          <span className="gre-coin-face gre-coin-back"><img src="/education/greenwich-emblem.webp" alt="" /></span>
        </span>
        <figcaption>Honoring Ceremony · 17.09.2026</figcaption>
      </figure>
    </div>
  );
}
