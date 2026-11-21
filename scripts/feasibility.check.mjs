// node scripts/feasibility.check.mjs — fails loudly if the scoring rules break.
import assert from "node:assert/strict";
import { feasibility } from "../src/admin/feasibility.js";

const now = Date.UTC(2026, 10, 21);
const sent = (days) => ({ status: "sent", lastSentAt: now - days * 86_400_000 });
const perfect = { fit: { stack: 2, schedule: 2, location: 2, opening: 2, reputation: 2 } };

assert.equal(feasibility(sent(1), perfect, now).score, 100);
assert.equal(feasibility(sent(1), undefined, now).score, 50, "unrated factors count as average (1/2)");
assert.equal(feasibility({ ...sent(1), status: "rejected" }, perfect, now).score, 0);
assert.equal(feasibility({ ...sent(1), status: "interview" }, perfect, now).score, 100, "capped at 100");
assert.equal(feasibility(sent(30), undefined, now).score, 35, "silent for 3+ weeks loses 15");
assert.match(feasibility(sent(9), undefined, now).action, /nhắc/);
assert.equal(feasibility(sent(9), { nextAction: "Gọi HR" }, now).action, "Gọi HR", "routine advice wins");
console.log("feasibility: ok");
