import { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Everything that keeps the film running when the network or the code doesn't:
// lazy images with a shimmer and a drawn fallback, the page skeleton, the "torn reel" error screen,
// the 404 scene and the offline notice. All copy is VI/EN.

const isVi = (language) => !String(language).startsWith("en");

// Drawn fallback for an image that won't load: a film frame on night blue, sun and brick dots.
const fallbackArt = (label) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
<rect width="800" height="500" fill="#14182b"/>
<g fill="#1f2540">${Array.from({ length: 12 }, (_, i) => `<rect x="${24 + i * 64}" y="18" width="34" height="22" rx="5"/><rect x="${24 + i * 64}" y="460" width="34" height="22" rx="5"/>`).join("")}</g>
<rect x="60" y="70" width="680" height="360" rx="22" fill="none" stroke="#2c3458" stroke-width="4" stroke-dasharray="14 12"/>
<circle cx="400" cy="215" r="58" fill="#b4452a"/><circle cx="436" cy="190" r="22" fill="#ffbf08"/>
<path d="M300 330 C350 280 450 280 500 330" fill="none" stroke="#f4f6fb" stroke-opacity=".35" stroke-width="6" stroke-linecap="round"/>
<text x="400" y="390" fill="#c3cad3" font-family="Georgia,serif" font-style="italic" font-size="26" text-anchor="middle">${label}</text></svg>`)}`;

/** <img> that lazy-loads, shimmers while loading, retries once on a network hiccup, then shows drawn art. */
export function SmartImg({ src, alt = "", className = "", loading = "lazy", ...props }) {
  const { i18n } = useTranslation();
  const [state, setState] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => { setState("loading"); setAttempt(0); }, [src]);
  const onError = () => {
    if (attempt === 0) { setTimeout(() => setAttempt(1), 1500); return; } // one quiet retry, then give up gracefully
    setState("error");
  };
  const current = state === "error"
    ? fallbackArt(isVi(i18n.language) ? "Ảnh đang nghỉ một chút" : "This frame is taking a break")
    : attempt ? `${src}${src.includes("?") ? "&" : "?"}retry=1` : src;
  return (
    <img {...props} src={current} alt={alt} className={`smart-img ${className}`.trim()} data-state={state}
      loading={loading} decoding="async" onLoad={() => state !== "error" && setState("ready")} onError={state === "error" ? undefined : onError} />
  );
}

/** Route-level loading: the shape of a page, shimmering, while its chunk arrives. */
export function PageSkeleton() {
  const { i18n } = useTranslation();
  return (
    <div className="skeleton-page creator-home" role="status" aria-live="polite">
      <span className="sr-only">{isVi(i18n.language) ? "Đang tải…" : "Loading…"}</span>
      <div className="skeleton-reel" aria-hidden="true"><i /><i /><i /></div>
      <div className="skeleton-line skeleton-line--kicker" aria-hidden="true" />
      <div className="skeleton-line skeleton-line--title" aria-hidden="true" />
      <div className="skeleton-line skeleton-line--title skeleton-line--short" aria-hidden="true" />
      <div className="skeleton-line" aria-hidden="true" />
      <div className="skeleton-card" aria-hidden="true" />
    </div>
  );
}

// The torn film strip shared by the error and 404 scenes.
function TornReel() {
  const frames = (x) => Array.from({ length: 5 }, (_, i) => <rect key={i} x={x + 10} y={34 + i * 56} width="20" height="14" rx="4" fill="#0b0c10" />);
  return (
    <svg className="scene-art" viewBox="0 0 520 340" aria-hidden="true">
      <g transform="rotate(-8 140 170)">
        <path d="M60 20 H220 L232 60 L212 95 L236 135 L214 175 L238 215 L210 255 L234 300 L220 320 H60 Z" fill="#283db7" />
        {frames(60)}{frames(190)}
        <rect x="104" y="70" width="70" height="90" rx="8" fill="#ffbf08" opacity=".9" />
        <rect x="104" y="180" width="70" height="90" rx="8" fill="#f4f6fb" opacity=".25" />
      </g>
      <g transform="rotate(10 380 170)">
        <path d="M300 20 L288 60 L308 95 L284 135 L306 175 L282 215 L310 255 L286 300 L300 320 H460 V20 Z" fill="#283db7" />
        {frames(420)}
        <rect x="336" y="70" width="70" height="90" rx="8" fill="#b4452a" />
        <rect x="336" y="180" width="70" height="90" rx="8" fill="#f4f6fb" opacity=".25" />
      </g>
      <path d="M248 120 l18 -10 M250 170 l22 0 M248 220 l18 10" stroke="#ffbf08" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function Scene({ kicker, title, body, actions }) {
  return (
    <section className="scene creator-home">
      <TornReel />
      <p className="scene-kicker">{kicker}</p>
      <h1 className="scene-title">{title}</h1>
      <p className="scene-body">{body}</p>
      <div className="scene-actions">{actions}</div>
    </section>
  );
}

/** 404: a scene that isn't in the film. Kept out of search results. */
export function NotFound() {
  const { i18n } = useTranslation();
  const vi = isVi(i18n.language);
  useEffect(() => {
    document.title = vi ? "Không có cảnh này — Hugo Wishpax" : "Scene not found — Hugo Wishpax";
    const robots = document.querySelector('meta[name="robots"]');
    const previous = robots?.getAttribute("content");
    robots?.setAttribute("content", "noindex, follow");
    return () => { if (previous) robots?.setAttribute("content", previous); };
  }, [vi]);
  return (
    <Scene kicker="404" title={vi ? "Cảnh này không có trong phim." : "This scene isn't in the film."}
      body={vi ? "Có thể đường dẫn đã cũ hoặc gõ nhầm một chữ. Phần còn lại của câu chuyện vẫn đang chờ bạn." : "The link may be old or have a typo. The rest of the story is still waiting for you."}
      actions={<>
        <Link className="scene-cta" to="/">{vi ? "Về cảnh đầu" : "Back to the opening"}</Link>
        <Link className="scene-cta scene-cta--quiet" to="/project">{vi ? "Xem các dự án" : "See the projects"}</Link>
      </>} />
  );
}

function ErrorScene({ error, onRetry }) {
  const { i18n } = useTranslation();
  const vi = isVi(i18n.language);
  // A failed dynamic import almost always means the network dropped or a new deploy replaced the chunk.
  const network = /Loading chunk|dynamically imported module|Failed to fetch|Importing a module script failed/i.test(String(error?.message));
  return (
    <Scene kicker={network ? (vi ? "Mất tín hiệu" : "Signal lost") : (vi ? "Sự cố" : "Something broke")}
      title={vi ? "Cuộn phim vừa bị đứt." : "The reel just snapped."}
      body={network
        ? (vi ? "Mạng đang chập chờn nên cảnh tiếp theo chưa tải về được. Kiểm tra kết nối rồi thử lại nhé." : "The connection dropped before the next scene arrived. Check your connection and try again.")
        : (vi ? "Một phần của trang gặp lỗi khi hiển thị. Tải lại thường là đủ để phim chạy tiếp." : "Part of the page failed to render. A reload is usually all it takes to keep the film rolling.")}
      actions={<>
        <button type="button" className="scene-cta" onClick={onRetry}>{vi ? "Tải lại cảnh này" : "Reload this scene"}</button>
        <a className="scene-cta scene-cta--quiet" href="/">{vi ? "Về cảnh đầu" : "Back to the opening"}</a>
      </>} />
  );
}

/** Catches render and lazy-chunk errors below it; resets when the route changes. */
export class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("Page crashed:", error, info.componentStack); }
  componentDidUpdate(previous) { if (this.state.error && previous.resetKey !== this.props.resetKey) this.setState({ error: null }); }
  render() {
    return this.state.error ? <ErrorScene error={this.state.error} onRetry={() => window.location.reload()} /> : this.props.children;
  }
}

/** A small pill while the device is offline; what's already loaded keeps working. */
export function OfflineNotice() {
  const { i18n } = useTranslation();
  const [offline, setOffline] = useState(() => typeof navigator !== "undefined" && navigator.onLine === false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  if (!offline) return null;
  return (
    <p className="offline-pill" role="status">
      <i aria-hidden="true" />
      {isVi(i18n.language) ? "Bạn đang offline — phần đã tải vẫn xem được." : "You're offline — what's loaded still works."}
    </p>
  );
}
