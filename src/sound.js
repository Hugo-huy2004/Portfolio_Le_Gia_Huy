// Site-wide UI sound with SND (snd.dev), kit SND02 "piano" (Ayako Taniguchi): recorded, free for commercial use.
// On by default, with a mute button in the nav (remembered per browser). No background music: only things the visitor does make sound.
// Browsers only allow audio after the visitor's first tap/click (SND unlocks itself on it); before that it is silent.
//   hover   → one of five piano taps, picked by the element, so the same link always plays the same note
//   click   → link: select · button: button · toggles (theme, language menu): toggle on/off
//   scroll  → one soft swipe per gesture · film cut → transition up/down · reaching the credits → celebration, once
import SndModule from "snd-lib";

const Snd = SndModule.default ?? SndModule; // CommonJS package: the class sits one level deeper in the production build
const S = Snd.SOUNDS;
const TAPS = [S.TAP_01, S.TAP_02, S.TAP_03, S.TAP_04, S.TAP_05];
const SWIPES = [S.SWIPE_01, S.SWIPE_02, S.SWIPE_03, S.SWIPE_04, S.SWIPE_05];

const snd = new Snd({ muteOnWindowBlur: false });
let ready = false;
let muted = false;
try { muted = localStorage.getItem("sound") === "off"; } catch {}
export const isMuted = () => muted;
export function setMuted(value) {
  muted = value;
  try { localStorage.setItem("sound", value ? "off" : "on"); } catch {}
}
const play = (key, volume) => ready && !muted && snd.play(key, { volume });

// A stable note per element: hash of its text/label, so moving along a menu plays a little melody.
const noteFor = (el) => {
  const text = el.getAttribute("aria-label") || el.textContent || "";
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return TAPS[Math.abs(h) % TAPS.length];
};

let lastHover = 0;
let celebrated = false;
export const sound = {
  hover: (el) => {
    if (performance.now() - lastHover < 90) return; // ponytail: throttle so sweeping across a menu isn't a buzz
    lastHover = performance.now();
    play(noteFor(el), 0.22);
  },
  click: (el) => {
    if (el.matches("summary, [aria-pressed], [aria-expanded], [role='switch']")) {
      const on = el.matches("summary") ? !el.parentElement.open : el.getAttribute("aria-pressed") !== "true" && el.getAttribute("aria-expanded") !== "true";
      play(on ? S.TOGGLE_ON : S.TOGGLE_OFF, 0.6);
    } else play(el.matches("a") ? S.SELECT : S.BUTTON, 0.6);
  },
  // Scene change in the film: up/down follows the scroll direction; the last scene (credits) gets a small celebration once.
  scene: (forward, last) => {
    if (last && forward && !celebrated) { celebrated = true; play(S.CELEBRATION, 0.45); return; }
    play(forward ? S.TRANSITION_DOWN : S.TRANSITION_UP, 0.5);
  },
};

// One soft swipe per scroll gesture (not per pixel), so movement is heard without a rattle.
let scrolling = false;
let idle;
function onScroll() {
  if (!scrolling) play(SWIPES[Math.floor(Math.random() * SWIPES.length)], 0.25);
  scrolling = true;
  clearTimeout(idle);
  idle = setTimeout(() => { scrolling = false; }, 260);
}

export function installSound() {
  snd.load(Snd.KITS.SND02).then(() => { ready = true; }).catch(() => {});
  const interactive = "a, button, [role='button'], input, select, textarea, summary, label";
  const onOver = (event) => {
    if (event.pointerType !== "mouse") return; // touch fires pointerover right before click: one sound per tap is enough
    const target = event.target.closest?.(interactive);
    if (target && !target.contains(event.relatedTarget)) sound.hover(target);
  };
  const onClick = (event) => { const target = event.target.closest?.(interactive); if (target) sound.click(target); };
  document.addEventListener("pointerover", onOver);
  document.addEventListener("click", onClick, true);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    document.removeEventListener("pointerover", onOver);
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("scroll", onScroll);
  };
}
