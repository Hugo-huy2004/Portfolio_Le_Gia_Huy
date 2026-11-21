// Feasibility of one application, 0–100. The daily routine rates each company on five factors (0–2 each) from the
// job post and reviews; live Gmail status then adjusts it. Weights favour what matters for this internship:
// matching stack and a schedule that fits 2 class sessions a week.
export const FACTORS = {
  stack: { weight: 15, label: "Khớp kỹ năng" },
  schedule: { weight: 12.5, label: "Giờ linh hoạt" },
  location: { weight: 10, label: "Gần khu vực" },
  opening: { weight: 7.5, label: "Đang tuyển" },
  reputation: { weight: 5, label: "Uy tín" },
};

const DAY = 86_400_000;

export function feasibility(application, analysis, now = Date.now()) {
  const fit = analysis?.fit || {};
  if (application.status === "rejected") return { score: 0, action: "Đã đóng. Hỏi lý do để rút kinh nghiệm nếu chưa hỏi." };
  let score = Object.entries(FACTORS).reduce((sum, [key, { weight }]) => sum + (fit[key] ?? 1) * weight, 0);
  const waited = Math.floor((now - application.lastSentAt) / DAY);
  let action = analysis?.nextAction;
  if (application.status === "interview") { score += 15; action ||= "Chuẩn bị phỏng vấn: xem lại JD và dự án liên quan."; }
  else if (application.status === "replied") { score += 5; action ||= "Công ty đã trả lời: đọc và phản hồi trong ngày."; }
  else if (waited > 21) { score -= 15; action ||= "Hơn 3 tuần chưa hồi âm: ưu tiên công ty khác."; }
  else if (waited > 7) { action ||= "Đã quá 7 ngày: gửi email nhắc nhẹ."; }
  else action ||= `Chờ phản hồi (đã ${waited} ngày).`;
  return { score: Math.max(0, Math.min(100, Math.round(score))), action, waited };
}
