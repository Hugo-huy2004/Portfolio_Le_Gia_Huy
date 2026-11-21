// Feasibility of one application, 0–100, and a reading of what the recruiter's words signal.
// 1. The daily routine rates each company on five factors (0–2 each) from the job post and reviews.
// 2. Live Gmail status and the recruiter's reply text then move the score: recruiting psychology says what HR
//    writes (and how fast) leaks intent long before a formal yes or no.
export const FACTORS = {
  stack: { weight: 15, label: "Khớp kỹ năng" },
  schedule: { weight: 12.5, label: "Giờ linh hoạt" },
  location: { weight: 10, label: "Gần khu vực" },
  opening: { weight: 7.5, label: "Đang tuyển" },
  reputation: { weight: 5, label: "Uy tín" },
};

// Recruiter-language cues, Vietnamese and English. Each is a pattern HR writing reliably carries.
// ponytail: keyword lexicon, not a model; the routine's `readout` covers nuance it can't see.
export const SIGNALS = [
  { id: "invite", tone: "positive", weight: 20, icon: "event_available", label: "Mời phỏng vấn",
    re: /mời (em|bạn|anh|chị)?\s*(tham gia |đến )?(buổi )?phỏng vấn|lịch phỏng vấn|hẹn (em|bạn)? ?(phỏng vấn|gặp|trao đổi)|interview (invitation|schedule)|schedule (a|an) (call|interview|chat)/i },
  { id: "test", tone: "positive", weight: 12, icon: "assignment", label: "Giao bài test",
    re: /bài (test|kiểm tra|tập)|test online|làm thử|assignment|take-?home|coding (test|challenge)/i },
  { id: "ask", tone: "positive", weight: 8, icon: "help", label: "HR hỏi thêm: đang quan tâm",
    re: /cho (chị|anh|mình) hỏi|(em|bạn) (vui lòng|có thể) (gửi|cho biết|chia sẻ)|bảng điểm|lịch học|khi nào (em|bạn) (có thể|bắt đầu)|could you (send|share|tell)|when (can|could) you start/i },
  { id: "praise", tone: "positive", weight: 6, icon: "thumb_up", label: "Có lời khen",
    re: /ấn tượng|rất phù hợp|hồ sơ (tốt|đẹp|ấn tượng)|dự án (hay|tốt)|impressed|strong (profile|background|portfolio)/i },
  { id: "warm", tone: "positive", weight: 3, icon: "sentiment_satisfied", label: "Giọng thân thiện",
    // Particles must end a word: \b treats Vietnamese letters as non-word, so "bạn" would match "ạ".
    re: /chào (em|bạn) \p{Lu}|thân (gửi|chào)|(nhé|nha|ạ)(?![\p{L}])|😊|🙂|cheers/iu },
  { id: "ack", tone: "neutral", weight: 0, icon: "mark_email_read", label: "Chỉ xác nhận đã nhận",
    re: /đã nhận (được )?(hồ sơ|cv|email|thư)|sẽ (liên hệ|phản hồi|thông báo)( lại)?( (sau|sớm|nếu))|received your (application|cv|resume)|thank you for (applying|your application)/i },
  { id: "pool", tone: "negative", weight: -10, icon: "inventory_2", label: "“Lưu hồ sơ”: thường là từ chối nhẹ",
    re: /lưu (lại )?hồ sơ|khi có (vị trí|nhu cầu) (phù hợp)?|talent pool|keep your (cv|resume|details) on file/i },
  { id: "rigid", tone: "negative", weight: -8, icon: "schedule", label: "Nhấn mạnh full-time",
    re: /full[- ]?time|toàn thời gian|làm cả ngày|không (hỗ trợ|linh hoạt) (giờ|lịch)/i },
  { id: "decline", tone: "negative", weight: -30, icon: "thumb_down", label: "Từ chối khéo",
    re: /rất tiếc|chưa (có vị trí|phù hợp)|không phù hợp|(ứng viên|bạn khác) phù hợp hơn|đã (tuyển|tìm) (đủ|được)|xin từ chối|regret to|not (be )?moving forward|unfortunately/i },
];
const URGENT = /trước (ngày|\d)|trong (hôm nay|ngày mai|24h|48h)|sớm nhất|gấp|asap|by (today|tomorrow|end of)/i;
const DAY = 86_400_000;

/** Reads a recruiter reply: which cues it carries, whether it is urgent, and how fast it came. */
export function readReply(reply, sentAt) {
  if (!reply?.snippet) return { cues: [], urgent: false, fast: false };
  const text = reply.snippet;
  const cues = SIGNALS.filter((s) => s.re.test(text));
  // A decline line drowns out its own polite praise ("CV ấn tượng nhưng rất tiếc…").
  const decided = cues.some((c) => c.id === "decline") ? cues.filter((c) => c.tone !== "positive") : cues;
  return { cues: decided, urgent: URGENT.test(text), fast: reply.at - sentAt < 2 * DAY };
}

export function feasibility(application, analysis, now = Date.now()) {
  const fit = analysis?.fit || {};
  const read = readReply(application.reply, application.lastSentAt);
  if (application.status === "rejected") return { score: 0, action: "Đã đóng. Hỏi lý do để rút kinh nghiệm nếu chưa hỏi.", read, waited: 0 };
  let score = Object.entries(FACTORS).reduce((sum, [key, { weight }]) => sum + (fit[key] ?? 1) * weight, 0);
  score += read.cues.reduce((sum, cue) => sum + cue.weight, 0) + (read.fast && read.cues.every((c) => c.tone !== "negative") ? 5 : 0);
  const tone = analysis?.readout?.tone;
  if (tone === "positive") score += 5;
  if (tone === "negative") score -= 10;
  const waited = Math.floor((now - application.lastSentAt) / DAY);
  let action = analysis?.nextAction;
  if (read.urgent) action ||= "HR cần trả lời gấp: phản hồi ngay hôm nay.";
  if (application.status === "interview") { score += 15; action ||= "Chuẩn bị phỏng vấn: xem lại JD và dự án liên quan."; }
  else if (application.status === "replied") { score += 5; action ||= "Công ty đã trả lời: đọc và phản hồi trong ngày."; }
  else if (waited > 21) { score -= 15; action ||= "Hơn 3 tuần chưa hồi âm: ưu tiên công ty khác."; }
  else if (waited > 7) { action ||= "Đã quá 7 ngày: gửi email nhắc nhẹ."; }
  else action ||= `Chờ phản hồi (đã ${waited} ngày).`;
  return { score: Math.max(0, Math.min(100, Math.round(score))), action, waited, read };
}

/** Needs attention now: interviews, unanswered replies, urgent asks, and silent applications due a nudge. */
export function needsAction(application, result) {
  if (application.status === "rejected") return null;
  if (application.status === "interview") return "interview";
  if (result.read.urgent) return "urgent";
  if (application.status === "replied" && application.reply?.at > application.lastSentAt) return "reply";
  if (application.status === "sent" && result.waited > 7 && result.waited <= 21) return "nudge";
  return null;
}
