import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import TechLogo from "./TechLogo";
import { skillGroups as groups, skillLabel as label } from "../../data/skills.js";
import "./skillVortex.css";

/**
 * Skills: Hugo in front of a vortex of tinted glass petals that fills the section. Scrolling (pinned) turns the petals
 * around a pivot behind the photo; whichever petal sweeps over the card on the right picks the group shown there.
 * Drawn on one viewport-sized canvas and repainted only while the scroll moves: no huge layers, no blur.
 * The groups live in data/skills.js (shared with the prerendered SEO copy).
 */
// Sparkles: fixed, spread-out positions (deterministic, so server and client agree), twinkling in CSS.
const sparkles = Array.from({ length: 16 }, (_, i) => ({ x: (i * 37 + 11) % 100, y: (i * 53 + 7) % 100, s: 8 + ((i * 7) % 14), d: (i * 0.37) % 3 }));
const files = { SQL: "sql", PHP: "php", Python: "python", "C#": "csharp", "C++": "cplusplus" };
const names = { hwj: "HWJ", mhike: "M-Hike", "chanh-toa": "Chánh Tòa", "l3go-coffee": "L3GO Coffee" };
// Navy logos that would vanish on the navy page; the black ones are flagged by TechLogo itself (data-dark).
const tint = new Set(["PayPal", "SQLite"]);

// Petal i: the band between two curves leaving the pivot at i·STEP and i·STEP+STEP+OVER, sweeping TURN degrees outward.
// Neighbours overlap by OVER degrees, where the two tints mix like stacked glass. Units: radius 0–100.
const N = groups.length;
const STEP = 360 / N;
const OVER = 16;
const TURN = 115;
const P = 0.85; // r = 100·t^P
function edge(a0) {
  return Array.from({ length: 33 }, (_, k) => {
    const t = k / 32;
    const a = ((a0 + t * TURN) * Math.PI) / 180;
    const r = 100 * t ** P;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
}
const petals = groups.map((_, i) => ({ a: edge(i * STEP), b: edge(i * STEP + STEP + OVER) }));
const rgba = (hex, a) => `rgb(${parseInt(hex.slice(1, 3), 16)} ${parseInt(hex.slice(3, 5), 16)} ${parseInt(hex.slice(5, 7), 16)} / ${a})`;

/** Pinned, scrubbed turn of the glass. Called from IntroductionPage's scene script so the pin is measured in page order. */
export function playSkillVortex(frame) {
  const canvas = frame.querySelector(".vx-glass");
  const ctx = canvas.getContext("2d");
  const shapes = petals.map(({ a, b }) => {
    const fill = new Path2D();
    a.forEach(([x, y], k) => (k ? fill.lineTo(x, y) : fill.moveTo(x, y)));
    // Outer end follows the circle (a chord would leave the screen corners bare).
    fill.arc(0, 0, 100, Math.atan2(a.at(-1)[1], a.at(-1)[0]), Math.atan2(b.at(-1)[1], b.at(-1)[0]));
    [...b].reverse().forEach(([x, y]) => fill.lineTo(x, y));
    fill.closePath();
    const rim = new Path2D(); // the leading edge catches the light
    b.forEach(([x, y], k) => (k ? rim.lineTo(x, y) : rim.moveTo(x, y)));
    return { fill, rim };
  });
  const view = { w: 0, h: 0, dpr: 1, px: 0, py: 0, R: 1, phi: 0, td: 0, cx: 0, cy: 0, cr: 0 };
  // Measure: pivot under the photo, reference point = the card's centre, radius reaching past every corner.
  const layout = () => {
    const box = frame.getBoundingClientRect();
    const photo = frame.querySelector(".vx-photo").getBoundingClientRect();
    const card = frame.querySelector(".vx-card").getBoundingClientRect();
    view.w = box.width; view.h = box.height; view.dpr = Math.min(devicePixelRatio || 1, 2);
    view.px = photo.left - box.left + photo.width / 2;
    view.py = photo.top - box.top + photo.height * 0.82;
    view.R = 1.15 * Math.max(...[[0, 0], [view.w, 0], [0, view.h], [view.w, view.h]].map(([x, y]) => Math.hypot(x - view.px, y - view.py)));
    const dx = card.left - box.left + card.width / 2 - view.px;
    const dy = card.top - box.top + card.height / 2 - view.py;
    view.phi = (Math.atan2(dy, dx) * 180) / Math.PI;
    view.td = (Math.hypot(dx, dy) / view.R) ** (1 / P) * TURN;
    view.cx = view.px + dx; view.cy = view.py + dy; view.cr = Math.max(card.width, card.height) * 0.75;
    const W = Math.round(view.w * view.dpr);
    const H = Math.round(view.h * view.dpr);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  };
  // Rotation that puts the middle of petal g's unshared band over the card. Each step adds a turn, so it keeps
  // turning one way and the petals read as curling in.
  const angleFor = (g) => { layout(); return view.phi - (view.td + (STEP + OVER) / 2) + g * (360 - STEP); };
  const state = { rot: 0 };
  const draw = () => {
    const { dpr, R } = view;
    const k = (R / 100) * dpr;
    const a = (state.rot * Math.PI) / 180;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(k * Math.cos(a), k * Math.sin(a), -k * Math.sin(a), k * Math.cos(a), view.px * dpr, view.py * dpr);
    // Lit glass on a deep navy page: "screen" brightens where panes overlap, so the depth reads as layers of light.
    ctx.globalCompositeOperation = "screen";
    shapes.forEach(({ fill }, i) => { ctx.fillStyle = rgba(groups[i].color, 0.38); ctx.fill(fill); });
    ctx.globalCompositeOperation = "source-over";
    ctx.lineJoin = "round";
    shapes.forEach(({ rim }) => {
      ctx.strokeStyle = "rgb(184 201 234 / .55)"; ctx.lineWidth = (3 * dpr) / k; ctx.stroke(rim);
    });
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 100); // light pooling at the pivot, behind the photo
    glow.addColorStop(0, "rgb(141 182 242 / .45)");
    glow.addColorStop(0.35, "rgb(141 182 242 / 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(-100, -100, 200, 200);
    // Still shade under the copy (does not turn): keeps light text readable on any pane without boxing it in a card.
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    const pool = ctx.createRadialGradient(view.cx, view.cy, 0, view.cx, view.cy, view.cr);
    pool.addColorStop(0, "rgb(2 11 51 / .82)");
    pool.addColorStop(0.55, "rgb(2 11 51 / .62)");
    pool.addColorStop(1, "rgb(2 11 51 / 0)");
    ctx.fillStyle = pool;
    ctx.fillRect(view.cx - view.cr, view.cy - view.cr, view.cr * 2, view.cr * 2);
  };

  let current = 0;
  const tl = gsap.timeline({ defaults: { onUpdate: draw }, scrollTrigger: { trigger: frame, start: "top top", end: `+=${N * 70}%`, scrub: 0.6, pin: true,
    anticipatePin: 1, invalidateOnRefresh: true, onRefresh: draw,
    onUpdate: (self) => {
      const g = Math.min(N - 1, Math.round(self.progress * (N - 1)));
      if (g !== current) { current = g; frame.dispatchEvent(new CustomEvent("vortex", { detail: g })); }
    } } });
  // Hold on each group a little, then turn to the next one.
  tl.fromTo(state, { rot: () => angleFor(0) }, { rot: () => angleFor(1), duration: 1, ease: "power2.inOut" });
  for (let g = 2; g < N; g += 1) tl.to({}, { duration: 0.35 }).to(state, { rot: () => angleFor(g), duration: 1, ease: "power2.inOut" });
  state.rot = angleFor(0);
  draw();
  return tl;
}

function Mark({ name }) {
  return files[name] ? <img src={`/tech-logos/${files[name]}.svg`} alt="" width="34" height="34" /> : <TechLogo name={name} size={34} />;
}

export default function SkillVortex({ language, heading }) {
  const vi = language === "vi";
  const lang = vi ? "vi" : "en";
  const frame = useRef(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = frame.current;
    const pick = (event) => setActive(event.detail);
    el.addEventListener("vortex", pick);
    return () => el.removeEventListener("vortex", pick);
  }, []);
  const group = groups[active];
  return (
    <div ref={frame} className="vx">
      <canvas className="vx-glass" aria-hidden="true" />
      <div className="vx-sparkles" aria-hidden="true">
        {sparkles.map(({ x, y, s: size, d }) => <i key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${d}s` }} />)}
      </div>
      <img className="vx-photo" src="/hugo-skills.webp" alt="" width="519" height="553" loading="lazy" decoding="async" />
      <div className="vx-card">
        {heading}
        <AnimatePresence mode="wait">
          <motion.div key={active} className="vx-group" initial="out" animate="in" exit="out"
            variants={{ in: { transition: { staggerChildren: 0.05 } }, out: { transition: { staggerChildren: 0.02, staggerDirection: -1 } } }}>
            <motion.h3 variants={{ in: { opacity: 1, x: 0 }, out: { opacity: 0, x: 24 } }}>{group.title[lang]}</motion.h3>
            <ul className={`vx-logos${group.studied ? " is-studied" : ""}`}>
              {group.items.map((name) => (
                <motion.li key={name} tabIndex={0} variants={{ in: { opacity: 1, scale: 1, y: 0 }, out: { opacity: 0, scale: 0.6, y: 12 } }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}>
                  <span className={`vx-logo${tint.has(name) ? " is-tinted" : ""}`}><Mark name={name} /></span>
                  <span className="vx-name">{label[name] || name}</span>
                </motion.li>
              ))}
            </ul>
            <motion.p className="vx-proof" variants={{ in: { opacity: 1 }, out: { opacity: 0 } }}>
              <span>{group.studied ? (vi ? "Học phần đại học" : "University coursework") : (vi ? "Dùng trong" : "Used in")}</span>
              {group.proof?.map((id) => <Link key={id} to={`/project/${id}`}>{names[id]}</Link>)}
            </motion.p>
          </motion.div>
        </AnimatePresence>
        <ol className="vx-dots" aria-label={vi ? "Nhóm kỹ năng" : "Skill groups"}>
          {groups.map((item, i) => (
            <li key={item.color}>
              <button type="button" style={{ "--dot": item.color }} aria-current={i === active || undefined} onClick={() => setActive(i)}
                aria-label={item.title[lang]} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
