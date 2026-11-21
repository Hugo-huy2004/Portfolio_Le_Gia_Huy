// node scripts/feasibility.check.mjs — fails loudly if the scoring or reply-reading rules break.
import assert from "node:assert/strict";
import { feasibility, needsAction, readReply } from "../src/admin/feasibility.js";

const now = Date.UTC(2026, 10, 21);
const DAY = 86_400_000;
const sent = (days) => ({ status: "sent", lastSentAt: now - days * DAY });
const replied = (snippet, afterDays = 1) => ({ status: "replied", lastSentAt: now - 5 * DAY, reply: { snippet, at: now - 5 * DAY + afterDays * DAY } });
const perfect = { fit: { stack: 2, schedule: 2, location: 2, opening: 2, reputation: 2 } };
const ids = (text) => readReply({ snippet: text, at: 1 }, 0).cues.map((c) => c.id);

// Scoring
assert.equal(feasibility(sent(1), perfect, now).score, 100);
assert.equal(feasibility(sent(1), undefined, now).score, 50, "unrated factors count as average (1/2)");
assert.equal(feasibility({ ...sent(1), status: "rejected" }, perfect, now).score, 0);
assert.equal(feasibility({ ...sent(1), status: "interview" }, perfect, now).score, 100, "capped at 100");
assert.equal(feasibility(sent(30), undefined, now).score, 35, "silent for 3+ weeks loses 15");
assert.match(feasibility(sent(9), undefined, now).action, /nhắc/);
assert.equal(feasibility(sent(9), { nextAction: "Gọi HR" }, now).action, "Gọi HR", "routine advice wins");

// Reading recruiter replies
assert.deepEqual(ids("Chào Huy, chị mời em tham gia phỏng vấn vào thứ Ba nhé"), ["invite", "warm"]);
assert.deepEqual(ids("Cảm ơn bạn, chúng tôi đã nhận được hồ sơ và sẽ liên hệ lại sau"), ["ack"]);
assert.deepEqual(ids("CV của em rất ấn tượng nhưng rất tiếc bên chị đã tuyển đủ"), ["decline"], "decline drowns its own praise");
assert.ok(ids("Bên chị sẽ lưu hồ sơ khi có vị trí phù hợp").includes("pool"));
assert.ok(readReply({ snippet: "Em gửi bài test trước ngày 25 giúp chị", at: 1 }, 0).urgent);
const invited = feasibility(replied("Mời em phỏng vấn online thứ Tư", 1), undefined, now);
const pooled = feasibility(replied("Bên mình xin lưu hồ sơ", 1), undefined, now);
assert.ok(invited.score > pooled.score + 30, "an invite outranks a polite shelving");
assert.equal(feasibility(replied("ok", 1), undefined, now).score, 60, "fast neutral reply: +5 replied, +5 speed");

// What needs action now
assert.equal(needsAction(sent(9), feasibility(sent(9), undefined, now)), "nudge");
assert.equal(needsAction(sent(2), feasibility(sent(2), undefined, now)), null);
assert.equal(needsAction({ ...sent(1), status: "rejected" }, feasibility({ ...sent(1), status: "rejected" }, undefined, now)), null);
console.log("feasibility: ok");
