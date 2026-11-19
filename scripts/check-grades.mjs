// Self-check for the 10:90 honours algorithm in src/data/grades.js. Run: node scripts/check-grades.mjs
// The first four asserts pin today's marks; update them when a new mark lands.
import assert from "node:assert/strict";
import { standing, modules, topModule, round1 } from "../src/data/grades.js";
const s = standing();
console.log(s, topModule().title, round1(s.score));
assert.equal(s.l5, 64.5);                 // (66+60+43+55+74+92+60+66)/8
assert.equal(s.l6, 69);                   // (61+77)/2 so far
assert.equal(round1(s.score), "68.6");    // .1*64.5 + .9*69 = 68.55
assert.equal(s.band.short, "2:1");
// Full Level 6: FYP 60cr @80 + 77 + 61 + 70 + 65 → best 90 = FYP60(80) + 77 + 70
const full = modules.map((m) => m.mark != null ? m : { ...m, mark: { COMP1682: 80, COMP1649: 70, COMP1787: 65 }[m.code] });
const f = standing(full);
assert.equal(f.l6, (80 * 60 + 77 * 15 + 70 * 15) / 90);
assert.equal(f.forFirst, null);
console.log("ok");
