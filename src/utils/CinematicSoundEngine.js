// Web Audio click "tick" for buttons and cards. Silent when idle; no samples, no drone.

let audioCtx = null;
let masterFilter = null;

function getContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

// Warm 1200Hz low-pass into a master gain, built once.
function initMaster() {
  const ctx = getContext();
  if (!ctx || masterFilter) return;
  try {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    filter.connect(gain);
    gain.connect(ctx.destination);
    masterFilter = filter;
  } catch {}
}

// Browsers keep audio locked until a user gesture; unlock on the first one.
if (typeof window !== "undefined") {
  const events = ["pointerdown", "click", "touchstart", "keydown", "wheel", "scroll"];
  const unlock = () => {
    initMaster();
    events.forEach((ev) => window.removeEventListener(ev, unlock));
  };
  events.forEach((ev) => window.addEventListener(ev, unlock, { passive: true, once: true }));
}

function blip(ctx, from, to, peak, length) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + length);
  gain.gain.setValueAtTime(peak, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(gain);
  gain.connect(masterFilter);
  osc.start(t);
  osc.stop(t + length + 0.005);
}

// Two-tone tick: a warm 360Hz punch plus a faint 540Hz overtone.
export function playHapticTick() {
  const ctx = getContext();
  if (!ctx) return;
  initMaster();
  if (!masterFilter) return;
  try {
    blip(ctx, 360, 140, 0.18, 0.035);
    blip(ctx, 540, 270, 0.08, 0.025);
  } catch {}
}
