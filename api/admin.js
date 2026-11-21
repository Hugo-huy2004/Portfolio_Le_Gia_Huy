// Private job-hunt dashboard data for /admin. Reads Gmail (read-only scope) with the owner's refresh token:
// application threads come from the "Thực tập/*" labels, which the daily Claude routine keeps up to date, and the
// routine's analysis (job summaries, fit factors, next steps) comes from its latest "[HUGO-DATA]" email to self.
// Env (Vercel): ADMIN_PASSWORD, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN.
import { createHash, timingSafeEqual } from "node:crypto";

const GMAIL = "https://gmail.googleapis.com/gmail/v1/users/me";
// ponytail: label ids of hugowishpax@gmail.com hard-coded; move to env if the labels are ever recreated.
const SENT_LABEL = "Label_3";
const STATUS_BY_LABEL = { Label_7: "rejected", Label_5: "interview", Label_4: "replied" }; // first match wins
const DATA_SUBJECT = "[HUGO-DATA]";

const digest = (text) => createHash("sha256").update(text).digest();
const samePassword = (given, expected) => timingSafeEqual(digest(given), digest(expected));

async function accessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  if (!response.ok) throw new Error(`Google từ chối token (${response.status}). Kiểm tra GOOGLE_* trên Vercel.`);
  return (await response.json()).access_token;
}

const header = (message, name) => message.payload?.headers?.find((h) => h.name.toLowerCase() === name)?.value || "";
const address = (value) => (value.match(/<([^>]+)>/)?.[1] || value).trim().toLowerCase();
const METADATA = "format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To";

function toApplication(thread) {
  const messages = thread.messages || [];
  const mine = messages.filter((m) => m.labelIds?.includes("SENT"));
  const first = mine[0] || messages[0];
  const reply = [...messages].reverse().find((m) => !m.labelIds?.includes("SENT"));
  const labels = new Set(messages.flatMap((m) => m.labelIds || []));
  const status = Object.entries(STATUS_BY_LABEL).find(([id]) => labels.has(id))?.[1] || "sent";
  return {
    self: address(header(first, "to")) === address(header(first, "from")), // reports and [HUGO-DATA] mails to self
    threadId: thread.id,
    to: address(header(first, mine.length ? "to" : "from")), // the company, even when it wrote first

    subject: header(first, "subject"),
    sentAt: Number(first.internalDate),
    lastSentAt: Number(mine.at(-1)?.internalDate || first.internalDate),
    status,
    reply: reply && { from: header(reply, "from"), snippet: reply.snippet, at: Number(reply.internalDate) },
  };
}

// The routine writes JSON between these markers so a signature or quoted text can't break parsing.
function parseData(message) {
  const parts = [message.payload, ...(message.payload?.parts || [])];
  const plain = parts.find((p) => p?.mimeType === "text/plain" && p.body?.data);
  const text = plain ? Buffer.from(plain.body.data, "base64url").toString("utf8") : "";
  const json = text.match(/<<<JSON([\s\S]*?)JSON>>>/)?.[1];
  return json ? JSON.parse(json) : null;
}

async function load() {
  const token = await accessToken();
  const gmail = async (path) => {
    const response = await fetch(`${GMAIL}${path}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`Gmail ${response.status} ở ${path.split("?")[0]}`);
    return response.json();
  };
  const [threadList, dataList, draftList] = await Promise.all([
    gmail(`/threads?labelIds=${SENT_LABEL}&maxResults=100`),
    gmail(`/messages?maxResults=1&q=${encodeURIComponent(`subject:"${DATA_SUBJECT}"`)}`),
    gmail("/drafts?maxResults=50"),
  ]);
  const [threads, dataMessage, drafts] = await Promise.all([
    Promise.all((threadList.threads || []).map((t) => gmail(`/threads/${t.id}?${METADATA}`))),
    dataList.messages?.[0] ? gmail(`/messages/${dataList.messages[0].id}?format=full`) : null,
    Promise.all((draftList.drafts || []).map((d) => gmail(`/drafts/${d.id}?${METADATA}`))),
  ]);
  return {
    applications: threads.map(toApplication).filter((a) => !a.self).sort((a, b) => b.lastSentAt - a.lastSentAt),
    analysis: dataMessage ? parseData(dataMessage) : null,
    drafts: drafts
      .map((d) => ({ id: d.id, to: address(header(d.message, "to")), subject: header(d.message, "subject"), threadId: d.message.threadId }))
      .filter((d) => /ứng tuyển|thực tập|intern|xin cơ hội/i.test(d.subject)),
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return res.status(500).json({ error: "Chưa đặt ADMIN_PASSWORD trên Vercel." });
  if (!samePassword(String(req.headers["x-admin-password"] || ""), expected)) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // ponytail: slows guessing; add a lockout store if attacked
    return res.status(401).json({ error: "Sai mật khẩu." });
  }
  try {
    return res.status(200).json(await load());
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
