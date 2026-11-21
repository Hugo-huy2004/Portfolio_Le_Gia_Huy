import { useEffect, useState } from "react";
import HugoLogo from "../components/HugoLogo";
import { FACTORS, feasibility, needsAction } from "./feasibility.js";
import "./admin.css";

// Private dashboard at /admin. Data comes from /api/admin (Gmail, read-only). The password is kept in
// sessionStorage only, so closing the tab logs out.
const KEY = "hugo-admin";
const GMAIL = "https://mail.google.com/mail/u/0/";
const COLOR = { sent: "var(--ink)", replied: "var(--cyan)", interview: "var(--sun)", rejected: "var(--brick)" };
const TODO = {
  interview: { icon: "event_available", label: "Phỏng vấn" },
  urgent: { icon: "priority_high", label: "Cần trả lời gấp" },
  reply: { icon: "reply", label: "Chưa trả lời HR" },
  nudge: { icon: "notifications", label: "Nên gửi email nhắc" },
};
const TONE = { positive: "Tích cực", neutral: "Trung tính", negative: "Tiêu cực" };
const store = {
  get: () => { try { return sessionStorage.getItem(KEY) || ""; } catch { return ""; } },
  set: (v) => { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY); } catch { /* private mode */ } },
};
const day = (ms) => new Date(ms).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
const domain = (email) => email.split("@")[1] || "";
const Icon = ({ name }) => <span className="material-symbols-outlined" aria-hidden="true">{name}</span>;
const sender = (from) => from.replace(/<.*>/, "").replace(/"/g, "").trim();

// Analysis entries are keyed by recruiting email; fall back to the company domain (never for free-mail domains).
function findAnalysis(companies, to) {
  const free = /^(gmail|yahoo|outlook|hotmail)\./;
  return companies.find((c) => c.email?.toLowerCase() === to)
    || (!free.test(domain(to)) && companies.find((c) => c.email && domain(c.email.toLowerCase()) === domain(to)));
}

async function fetchBoard(password) {
  const response = await fetch("/api/admin", { method: "POST", headers: { "x-admin-password": password } });
  const body = await response.json().catch(() => ({ error: `Máy chủ trả lỗi ${response.status}. Thử lại sau ít phút.` }));
  if (!response.ok) throw Object.assign(new Error(body.error), { status: response.status });
  return body;
}

function Login({ onLogin, error, loading }) {
  const [value, setValue] = useState("");
  const [shown, setShown] = useState(false);
  return (
    <div className="adm-center">
      <form className="adm-login" onSubmit={(e) => { e.preventDefault(); onLogin(value); }}>
        <HugoLogo aria-hidden="true" />
        <h1 className="adm-display">Admin Dashboard</h1>
        <label htmlFor="admin-password">Mật khẩu</label>
        <div className="adm-field">
          <input id="admin-password" type={shown ? "text" : "password"} autoFocus autoComplete="current-password" required
            value={value} onChange={(e) => setValue(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "admin-error" : undefined} />
          <button type="button" className="adm-eye" onClick={() => setShown(!shown)} aria-pressed={shown} aria-label={shown ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
            <Icon name={shown ? "visibility_off" : "visibility"} />
          </button>
        </div>
        {error && <p id="admin-error" role="alert" className="adm-error">{error}</p>}
        <button className="adm-btn adm-btn--sun" disabled={loading}>{loading ? "Đang mở…" : "Đăng nhập"}</button>
      </form>
    </div>
  );
}

// Sent, replied, interview is the path an application walks; a rejection ends it after the reply.
function Track({ status }) {
  const steps = status === "rejected" ? ["Đã gửi", "Từ chối"] : ["Đã gửi", "Phản hồi", "Phỏng vấn"];
  const reached = { sent: 0, replied: 1, interview: 2, rejected: 1 }[status];
  return (
    <ol className="adm-track" aria-label={`Trạng thái: ${steps[reached]}`} style={{ "--c": COLOR[status] }}>
      {steps.map((label, i) => <li key={label} className={`adm-step${i <= reached ? " is-done" : ""}`}><i aria-hidden="true" />{label}</li>)}
    </ol>
  );
}

// What the recruiter's words give away: live cues from the reply text, plus the routine's deeper reading.
function Readout({ app, result, info }) {
  const { cues, fast, urgent } = result.read;
  const deep = info?.readout;
  if (!app.reply && !deep) return null;
  return (
    <div className="adm-read">
      <p className="adm-read-head"><Icon name="psychology" />Đọc vị{deep?.tone && <span className="adm-tone">{TONE[deep.tone]}</span>}</p>
      {(cues.length > 0 || fast || urgent) && (
        <ul className="adm-cues">
          {cues.map((cue) => <li key={cue.id} className={`is-${cue.tone}`}><Icon name={cue.icon} />{cue.label}</li>)}
          {fast && <li className="is-positive"><Icon name="bolt" />Trả lời trong 2 ngày</li>}
          {urgent && <li className="is-negative"><Icon name="priority_high" />Có hạn chót</li>}
        </ul>
      )}
      {deep?.note && <p className="adm-read-note">{deep.note}{deep.quote && <q>{deep.quote}</q>}</p>}
    </div>
  );
}

function Application({ app, info, result }) {
  const closed = app.status === "rejected";
  const fit = info?.fit || {};
  return (
    <li className={`adm-row${closed ? " is-closed" : result.score < 50 ? " is-low" : ""}`}>
      <p className="adm-score adm-display" aria-label={`Điểm khả thi ${result.score} trên 100`}>{result.score}<small>khả thi</small></p>
      <div className="adm-co">
        <h3>{info?.company || app.to}</h3>
        <p>{info?.role || app.subject}{info?.district && `, ${info.district}`}</p>
        <p className="adm-next"><Icon name={closed ? "do_not_disturb_on" : "arrow_forward"} /><span>{result.action}</span></p>
        {app.reply && <p className="adm-reply"><strong>{sender(app.reply.from)}</strong> ({day(app.reply.at)}): “{app.reply.snippet}”</p>}
        <Readout app={app} result={result} info={info} />
        <p className="adm-foot">
          <span><Icon name="outgoing_mail" />Gửi {day(app.sentAt)}</span>
          {app.lastSentAt !== app.sentAt && <span><Icon name="notifications" />Nhắc {day(app.lastSentAt)}</span>}
          {!closed && <span><Icon name="hourglass_empty" />Chờ {result.waited} ngày</span>}
          <span><Icon name="alternate_email" />{app.to}</span>
          <a href={`${GMAIL}#all/${app.threadId}`} target="_blank" rel="noreferrer"><Icon name="open_in_new" />Mở trong Gmail</a>
        </p>
        {info && (
          <details className="adm-details">
            <summary><Icon name="chevron_right" />Tin tuyển và đánh giá</summary>
            <div className="adm-brief">
              {info.summary?.length > 0 && <ul>{info.summary.map((line) => <li key={line}>{line}</li>)}</ul>}
              {(info.schedule || info.allowance || info.reputationNote) && (
                <dl className="adm-facts">
                  {info.schedule && <><dt>Thời gian</dt><dd>{info.schedule}</dd></>}
                  {info.allowance && <><dt>Trợ cấp</dt><dd>{info.allowance}</dd></>}
                  {info.reputationNote && <><dt>Review</dt><dd>{info.reputationNote}</dd></>}
                </dl>
              )}
              <div className="adm-factors">
                {Object.entries(FACTORS).map(([key, { label }]) => {
                  const value = fit[key] ?? 1;
                  return (
                    <div key={key} role="img" aria-label={`${label}: ${value} trên 2`}>
                      <span>{label}</span>
                      <div className="adm-pips" aria-hidden="true"><i className={value >= 1 ? "on" : ""} /><i className={value >= 2 ? "on" : ""} /></div>
                    </div>
                  );
                })}
              </div>
              {info.jdUrl && <a href={info.jdUrl} target="_blank" rel="noreferrer"><Icon name="open_in_new" />Xem tin tuyển gốc</a>}
            </div>
          </details>
        )}
      </div>
      <Track status={app.status} />
    </li>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState(store.get);
  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard";
    const robots = Object.assign(document.createElement("meta"), { name: "robots", content: "noindex, nofollow" });
    document.head.appendChild(robots);
    document.body.style.background = "#050817"; // overscroll matches the page
    return () => { robots.remove(); document.body.style.background = ""; };
  }, []);

  const load = (pass) => {
    setLoading(true); setError("");
    fetchBoard(pass)
      .then((data) => { store.set(pass); setPassword(pass); setBoard(data); })
      .catch((e) => { setError(e.message); if (e.status === 401) { store.set(""); setPassword(""); } })
      .finally(() => setLoading(false));
  };
  useEffect(() => { if (password) load(password); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!board && (!password || error)) return <main className="adm"><Login onLogin={load} error={error} loading={loading} /></main>;
  if (!board) return <main className="adm"><p className="adm-center">Đang đọc Gmail…</p></main>;

  const analysis = board.analysis || {};
  const companies = analysis.companies || [];
  const rows = board.applications
    .map((app) => { const info = findAnalysis(companies, app.to); const result = feasibility(app, info); return { app, info, result, todo: needsAction(app, result) }; })
    .sort((a, b) => b.result.score - a.result.score);
  const open = rows.filter((r) => r.app.status !== "rejected");
  const closed = rows.filter((r) => r.app.status === "rejected");
  const todos = rows.filter((r) => r.todo).sort((a, b) => Object.keys(TODO).indexOf(a.todo) - Object.keys(TODO).indexOf(b.todo));
  const count = (s) => board.applications.filter((a) => a.status === s).length;
  const stages = [["sent", "send", board.applications.length, "đã gửi"], ["replied", "forum", count("replied") + count("interview"), "có phản hồi"], ["interview", "record_voice_over", count("interview"), "phỏng vấn"]];

  return (
    <main className="adm">
      <div className="adm-wrap">
        <header className="adm-head">
          <div>
            <h1 className="adm-display">Admin Dashboard</h1>
            <p className="adm-meta">
              Gmail đọc trực tiếp. Phân tích cập nhật {analysis.updatedAt ? new Date(analysis.updatedAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "chưa có"}.
            </p>
          </div>
          <div className="adm-actions">
            <button type="button" className="adm-btn" onClick={() => load(password)} disabled={loading}><Icon name="refresh" />{loading ? "Đang tải…" : "Làm mới"}</button>
            <button type="button" className="adm-btn" onClick={() => { store.set(""); setPassword(""); setBoard(null); }}><Icon name="logout" />Đăng xuất</button>
          </div>
        </header>
        {error && <p role="alert" className="adm-notice">{error}</p>}
        {analysis.error && <p className="adm-notice">{analysis.error} Danh sách bên dưới vẫn lấy từ Gmail.</p>}

        <section className="adm-pipe" aria-label="Tổng quan">
          {stages.map(([key, icon, value, label], i) => (
            <div key={key} style={{ display: "contents" }}>
              {i > 0 && <span className="adm-pipe-line" aria-hidden="true" />}
              <p className={`adm-stage is-${key}`}><b>{value}</b><span><Icon name={icon} />{label}</span></p>
            </div>
          ))}
          <div className="adm-pipe-rest">
            <p className="adm-stage is-rejected"><b>{count("rejected")}</b><span><Icon name="block" />từ chối</span></p>
            <p className="adm-stage is-drafts"><b>{board.drafts.length}</b><span><Icon name="edit_note" />nháp chờ gửi</span></p>
          </div>
        </section>

        {todos.length > 0 && (
          <section className="adm-section" aria-labelledby="adm-todo">
            <h2 id="adm-todo">Cần làm ngay</h2>
            <ul className="adm-todos">
              {todos.map(({ app, info, result, todo }) => (
                <li key={app.threadId} className={`is-${todo}`}>
                  <Icon name={TODO[todo].icon} />
                  <div>
                    <p><b>{info?.company || app.to}</b><span>{TODO[todo].label}</span></p>
                    <p>{result.action}</p>
                  </div>
                  <a href={`${GMAIL}#all/${app.threadId}`} target="_blank" rel="noreferrer" aria-label={`Mở thư ${info?.company || app.to} trong Gmail`}><Icon name="open_in_new" /></a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {analysis.advice?.length > 0 && (
          <section className="adm-advice">
            <h2><Icon name="lightbulb" />Gợi ý hôm nay</h2>
            <ul>{analysis.advice.map((line) => <li key={line}>{line}</li>)}</ul>
          </section>
        )}

        <section className="adm-section" aria-labelledby="adm-apps">
          <h2 id="adm-apps">Hồ sơ đang mở</h2>
          <p>Điểm khả thi gồm: kỹ năng, giờ linh hoạt, khu vực, tin còn mở, uy tín, và những gì câu chữ của HR để lộ.</p>
          {open.length
            ? <ul className="adm-list">{open.map((row) => <Application key={row.app.threadId} {...row} />)}</ul>
            : <p className="adm-empty">Chưa có hồ sơ nào đang mở. Gửi hồ sơ mới rồi bấm Làm mới.</p>}
        </section>

        {board.drafts.length > 0 && (
          <section className="adm-section" aria-labelledby="adm-drafts">
            <h2 id="adm-drafts">Nháp chờ gửi</h2>
            <ul className="adm-list">
              {board.drafts.map((d) => {
                const info = findAnalysis(companies, d.to);
                return (
                  <li key={d.id} className="adm-draft">
                    <h3>{info?.company || d.to}</h3>
                    <p>{d.subject}</p>
                    {info?.summary?.[0] && <p>{info.summary[0]}</p>}
                    <a href={`${GMAIL}#drafts`} target="_blank" rel="noreferrer"><Icon name="open_in_new" />Mở Thư nháp</a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {closed.length > 0 && (
          <details className="adm-section adm-closed">
            <summary><Icon name="chevron_right" />Đã đóng ({closed.length})</summary>
            <ul className="adm-list">{closed.map((row) => <Application key={row.app.threadId} {...row} />)}</ul>
          </details>
        )}
      </div>
    </main>
  );
}
