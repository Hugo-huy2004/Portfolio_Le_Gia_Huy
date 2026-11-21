import { Fragment, useEffect, useState } from "react";
import { FACTORS, feasibility } from "./feasibility.js";

// Private job-hunt board at /admin. Data comes from /api/admin (Gmail, read-only). The password is kept in
// sessionStorage only, so closing the tab logs out.
const KEY = "hugo-admin";
const STATUS = {
  sent: { label: "Đã gửi", tone: "bg-sky-500/15 text-sky-600 dark:text-sky-300" },
  replied: { label: "Có phản hồi", tone: "bg-amber-500/15 text-amber-600 dark:text-amber-300" },
  interview: { label: "Phỏng vấn", tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" },
  rejected: { label: "Từ chối", tone: "bg-rose-500/15 text-rose-600 dark:text-rose-300" },
};
const GMAIL = "https://mail.google.com/mail/u/0/";
const store = {
  get: () => { try { return sessionStorage.getItem(KEY) || ""; } catch { return ""; } },
  set: (v) => { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY); } catch { /* private mode */ } },
};
const day = (ms) => new Date(ms).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
const domain = (email) => email.split("@")[1] || "";

// Analysis entries are keyed by recruiting email; fall back to the company domain (never for free-mail domains).
function findAnalysis(companies, to) {
  const free = /^(gmail|yahoo|outlook|hotmail)\./;
  return companies.find((c) => c.email?.toLowerCase() === to)
    || (!free.test(domain(to)) && companies.find((c) => c.email && domain(c.email.toLowerCase()) === domain(to)));
}

async function fetchBoard(password) {
  const response = await fetch("/api/admin", { method: "POST", headers: { "x-admin-password": password } });
  const body = await response.json().catch(() => ({ error: `Lỗi máy chủ (${response.status})` }));
  if (!response.ok) throw Object.assign(new Error(body.error), { status: response.status });
  return body;
}

function Login({ onLogin, error }) {
  const [value, setValue] = useState("");
  return (
    <form className="mx-auto mt-[20vh] flex w-full max-w-sm flex-col gap-3 px-4" onSubmit={(e) => { e.preventDefault(); onLogin(value); }}>
      <h1 className="text-xl font-semibold">Quản lý thực tập</h1>
      <label className="text-sm text-muted-foreground" htmlFor="admin-password">Mật khẩu</label>
      <input id="admin-password" type="password" autoFocus autoComplete="current-password" value={value} onChange={(e) => setValue(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500" />
      {error && <p role="alert" className="text-sm text-rose-500">{error}</p>}
      <button className="rounded-lg bg-foreground px-3 py-2 font-medium text-background">Đăng nhập</button>
    </form>
  );
}

function Card({ app, info, result }) {
  const status = STATUS[app.status];
  return (
    <article className="rounded-xl border border-border p-4 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold">{info?.company || app.to}</h3>
          <p className="text-sm text-muted-foreground">{[info?.role, info?.district].filter(Boolean).join(" · ") || app.subject}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.tone}`}>{status.label}</span>
      </div>
      <div className="mt-3 flex items-center gap-3" title="Điểm khả thi">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border" role="meter" aria-valuenow={result.score} aria-valuemin={0} aria-valuemax={100} aria-label="Điểm khả thi">
          <div className="h-full rounded-full bg-sky-500" style={{ width: `${result.score}%` }} />
        </div>
        <span className="w-10 text-right text-sm font-semibold tabular-nums">{result.score}</span>
      </div>
      <p className="mt-2 text-sm"><b>Nên làm:</b> {result.action}</p>
      {app.reply && (
        <blockquote className="mt-2 border-l-2 border-amber-500 pl-3 text-sm text-muted-foreground">
          {app.reply.from.replace(/<.*>/, "").trim()} · {day(app.reply.at)}: “{app.reply.snippet}”
        </blockquote>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Gửi {day(app.sentAt)}{app.lastSentAt !== app.sentAt && `, nhắc ${day(app.lastSentAt)}`} · {app.to} ·{" "}
        <a className="underline" href={`${GMAIL}#all/${app.threadId}`} target="_blank" rel="noreferrer">Mở trong Gmail</a>
      </p>
      {info && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium">Tóm tắt tin tuyển &amp; đánh giá</summary>
          {info.summary?.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5">{info.summary.map((line) => <li key={line}>{line}</li>)}</ul>}
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            {info.schedule && <><dt className="text-muted-foreground">Thời gian</dt><dd>{info.schedule}</dd></>}
            {info.allowance && <><dt className="text-muted-foreground">Trợ cấp</dt><dd>{info.allowance}</dd></>}
            {info.reputationNote && <><dt className="text-muted-foreground">Review</dt><dd>{info.reputationNote}</dd></>}
            {Object.entries(FACTORS).map(([key, { label }]) => (
              <Fragment key={key}><dt className="text-muted-foreground">{label}</dt><dd>{"●".repeat(info.fit?.[key] ?? 1)}{"○".repeat(2 - (info.fit?.[key] ?? 1))}</dd></Fragment>
            ))}
          </dl>
          {info.jdUrl && <a className="mt-2 inline-block underline" href={info.jdUrl} target="_blank" rel="noreferrer">Xem tin tuyển gốc</a>}
        </details>
      )}
    </article>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState(store.get);
  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Quản lý thực tập";
    const robots = Object.assign(document.createElement("meta"), { name: "robots", content: "noindex, nofollow" });
    document.head.appendChild(robots);
    try { document.documentElement.dataset.theme = localStorage.getItem("hugo-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"); } catch { /* default theme */ }
    return () => robots.remove();
  }, []);

  const load = (pass) => {
    setLoading(true); setError("");
    fetchBoard(pass)
      .then((data) => { store.set(pass); setPassword(pass); setBoard(data); })
      .catch((e) => { setError(e.message); if (e.status === 401) { store.set(""); setPassword(""); } })
      .finally(() => setLoading(false));
  };
  useEffect(() => { if (password) load(password); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!password || (!board && error)) return <main className="min-h-screen bg-background text-foreground"><Login onLogin={load} error={error} /></main>;
  if (!board) return <main className="min-h-screen bg-background p-6 text-foreground">Đang tải dữ liệu Gmail…</main>;

  const companies = board.analysis?.companies || [];
  const rows = board.applications
    .map((app) => { const info = findAnalysis(companies, app.to); return { app, info, result: feasibility(app, info) }; })
    .sort((a, b) => b.result.score - a.result.score);
  const count = (s) => board.applications.filter((a) => a.status === s).length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Quản lý thực tập</h1>
            <p className="text-sm text-muted-foreground">
              Gmail: trực tiếp · Phân tích: {board.analysis?.updatedAt ? new Date(board.analysis.updatedAt).toLocaleString("vi-VN") : "chưa có"}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => load(password)} disabled={loading} className="rounded-lg border border-border px-3 py-1.5 text-sm">{loading ? "Đang tải…" : "Làm mới"}</button>
            <button onClick={() => { store.set(""); setPassword(""); setBoard(null); }} className="rounded-lg border border-border px-3 py-1.5 text-sm">Đăng xuất</button>
          </div>
        </header>
        {error && <p role="alert" className="mt-3 text-sm text-rose-500">{error}</p>}

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5" aria-label="Tổng quan">
          {[["Đã gửi", board.applications.length], ["Có phản hồi", count("replied")], ["Phỏng vấn", count("interview")], ["Từ chối", count("rejected")], ["Nháp chờ gửi", board.drafts.length]].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border p-3">
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>

        {board.analysis?.advice?.length > 0 && (
          <section className="mt-6 rounded-xl border border-sky-500/40 p-4">
            <h2 className="font-semibold">Gợi ý hôm nay</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{board.analysis.advice.map((line) => <li key={line}>{line}</li>)}</ul>
          </section>
        )}

        <section className="mt-6" aria-label="Hồ sơ đã gửi">
          <h2 className="mb-3 font-semibold">Hồ sơ đã gửi · xếp theo điểm khả thi</h2>
          <div className="grid gap-3">{rows.map((row) => <Card key={row.app.threadId} {...row} />)}</div>
        </section>

        {board.drafts.length > 0 && (
          <section className="mt-8" aria-label="Bản nháp">
            <h2 className="mb-3 font-semibold">Bản nháp chờ gửi</h2>
            <ul className="grid gap-2">
              {board.drafts.map((d) => {
                const info = findAnalysis(companies, d.to);
                return (
                  <li key={d.id} className="rounded-xl border border-border p-3 text-sm">
                    <b>{info?.company || d.to}</b> · {d.subject}
                    {info?.summary?.[0] && <p className="text-muted-foreground">{info.summary[0]}</p>}
                    <a className="underline" href={`${GMAIL}#drafts`} target="_blank" rel="noreferrer">Mở Thư nháp</a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
