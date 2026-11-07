// Site-wide UI sound with SND (snd.dev): recorded sounds made by sound designers, free for commercial use.
// Always on by owner's call: no mute. No background music: only things the visitor does make sound.
// Browsers only allow audio after the visitor's first tap/click (SND unlocks itself on it); before that it is silent.
import SndModule from "snd-lib";

const Snd = SndModule.default ?? SndModule; // CommonJS package: the class sits one level deeper in the production build

const snd = new Snd({ muteOnWindowBlur: false });
let ready = false;

let lastHover = 0;
export const sound = {
  hover: () => {
    if (!ready || performance.now() - lastHover < 80) return; // ponytail: throttle so sweeping across a menu isn't a buzz
    lastHover = performance.now();
    snd.play(Snd.SOUNDS.TAP, { volume: 0.25 });
  },
  click: () => ready && snd.play(Snd.SOUNDS.BUTTON, { volume: 0.7 }),
  // Scene change in the film: up/down follows the scroll direction.
  scene: (forward) => ready && snd.play(forward ? Snd.SOUNDS.TRANSITION_DOWN : Snd.SOUNDS.TRANSITION_UP, { volume: 0.6 }),
};

// One soft swipe per scroll gesture (not per pixel), so movement is heard without a rattle.
let scrolling = false;
let idle;
function onScroll() {
  if (ready && !scrolling) snd.play(Snd.SOUNDS.SWIPE, { volume: 0.35 });
  scrolling = true;
  clearTimeout(idle);
  idle = setTimeout(() => { scrolling = false; }, 260);
}

export function installSound() {
  snd.load(Snd.KITS.SND01).then(() => { ready = true; }).catch(() => {});
  const interactive = "a, button, [role='button'], input, select, textarea, summary, label";
  const onOver = (event) => {
    const target = event.target.closest?.(interactive);
    if (target && !target.contains(event.relatedTarget)) sound.hover();
  };
  const onClick = (event) => { if (event.target.closest?.(interactive)) sound.click(); };
  document.addEventListener("pointerover", onOver);
  document.addEventListener("click", onClick, true);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    document.removeEventListener("pointerover", onOver);
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("scroll", onScroll);
  };
}
