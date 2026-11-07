import React, { lazy, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { installSound } from "./sound.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import i18n, { ensureTranslations } from "./i18n/config";
import { SERVICES_ORIGIN, cvPdf } from "./config/publicSites";
import HugoLogo from "./components/HugoLogo";
import { ErrorBoundary, NotFound, OfflineNotice, PageSkeleton } from "./components/public/Resilience";
import "./index.css";
import "./portfolio.css";

const Introduction = lazy(() => import("./pages/public/IntroductionPage"));
const Projects = lazy(() => import("./pages/public/ProjectsPage"));
const Project = lazy(() => import("./pages/public/ProjectDetailPage"));
const LANGS = [
  { code: "vi", short: "VI", name: "Tiếng Việt" },
  { code: "en", short: "EN", name: "English" },
];
gsap.registerPlugin(ScrollTrigger);
// Phones show/hide the address bar while scrolling; recalculating every trigger on that resize is what makes pins jump.
ScrollTrigger.config({ ignoreMobileResize: true });

// Inertial scrolling for the whole site, driven by GSAP's ticker so ScrollTrigger scenes stay in sync.
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
}

// Zoom is locked site-wide (owner's call): pinch on iOS ignores user-scalable=no, and desktop
// zoom comes from Ctrl/⌘ + wheel or Ctrl/⌘ + plus/minus/0.
function useNoZoom() {
  useEffect(() => {
    const stop = (event) => event.preventDefault();
    const onWheel = (event) => { if (event.ctrlKey || event.metaKey) event.preventDefault(); };
    const onKey = (event) => { if ((event.ctrlKey || event.metaKey) && ["+", "=", "-", "_", "0"].includes(event.key)) event.preventDefault(); };
    const onTouch = (event) => { if (event.touches.length > 1) event.preventDefault(); };
    document.addEventListener("gesturestart", stop, { passive: false });
    document.addEventListener("touchmove", onTouch, { passive: false });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("gesturestart", stop);
      document.removeEventListener("touchmove", onTouch);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
}

// Theme follows the device (prefers-color-scheme) until the visitor picks one; the switch is animated
// with a View Transition: the new theme grows out of the toggle in a circle.
const THEME_KEY = "hugo-theme";
const deviceTheme = () => (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
const savedTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };

function useTheme() {
  const [theme, setTheme] = useState(() => savedTheme() || deviceTheme());
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const follow = () => { if (!savedTheme()) switchTheme(deviceTheme()); };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  });
  const switchTheme = (next, origin) => {
    const apply = () => { document.documentElement.dataset.theme = next; setTheme(next); };
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { apply(); return; }
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(.16,1,.3,1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };
  const toggle = (event) => {
    const next = theme === "dark" ? "light" : "dark";
    try { localStorage.setItem(THEME_KEY, next); } catch { /* per-visitor convenience only */ }
    const box = event.currentTarget.getBoundingClientRect();
    switchTheme(next, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
  };
  return [theme, toggle];
}

// Every language beyond VI/EN: Google Translate's page widget, loaded only when asked for (or when a previous
// choice is still in its `googtrans` cookie). It rewrites text nodes in place, which trips React's
// removeChild/insertBefore on nodes it moved, so those two are made tolerant first.
const translatedByGoogle = () => /(?:^|;\s*)googtrans=\/[a-z-]+\/(?!vi\b|en\b)[a-z-]+/i.test(document.cookie);
let googleTranslate;
function loadGoogleTranslate(pageLanguage) {
  if (googleTranslate) return googleTranslate;
  const { removeChild, insertBefore } = Node.prototype;
  Node.prototype.removeChild = function patchedRemoveChild(child) {
    return child.parentNode === this ? removeChild.call(this, child) : child;
  };
  Node.prototype.insertBefore = function patchedInsertBefore(node, reference) {
    return reference && reference.parentNode !== this ? node : insertBefore.call(this, node, reference);
  };
  googleTranslate = new Promise((resolve, reject) => {
    window.hugoGoogleTranslateInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage, autoDisplay: false }, "gt-element");
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=hugoGoogleTranslateInit";
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return googleTranslate;
}
// Picking VI or EN again must drop the machine translation, or Google re-applies it on the next load.
function clearGoogleTranslate() {
  const expired = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = expired;
  document.cookie = `${expired}; domain=${window.location.hostname}`;
  document.cookie = `${expired}; domain=.${window.location.hostname}`;
}

const prefix = window.location.pathname.match(/^\/(en|vi)(?=\/|$)/)?.[0] || "";

function ScrollPosition() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Is the surface right under the nav light? Walks up from what sits behind it to the first opaque background.
function surfaceIsLight(x, y) {
  const behind = document.elementsFromPoint(x, y).find((el) => !el.closest(".portfolio-nav-wrap"));
  for (let node = behind; node; node = node.parentElement) {
    const [r, g, b, a = 1] = getComputedStyle(node).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
    if (a > 0.5) return 0.2126 * r + 0.7152 * g + 0.0722 * b > 160;
  }
  return false;
}

function Portfolio() {
  const { t, i18n: language } = useTranslation();
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  useSmoothScroll();
  useNoZoom();
  useEffect(installSound, []);
  const [theme, toggleTheme] = useTheme();
  const [otherLanguages, setOtherLanguages] = useState(translatedByGoogle);
  useEffect(() => { if (otherLanguages) loadGoogleTranslate(language.language).catch(() => setOtherLanguages(false)); }, [otherLanguages, language.language]);
  const [hovered, setHovered] = useState(null);
  const hover = (key) => ({ onMouseEnter: () => setHovered(key), onFocus: () => setHovered(key) });
  const pill = (key) => (
    <AnimatePresence>
      {hovered === key && (
        <motion.span layoutId="nav-pill" className="portfolio-nav-pill" aria-hidden="true"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }} />
      )}
    </AnimatePresence>
  );
  const { scrollY, scrollYProgress } = useScroll();
  const [navHidden, setNavHidden] = useState(false);
  const [navOnLight, setNavOnLight] = useState(false);
  // Hide while scrolling down, reveal on any scroll up
  useMotionValueEvent(scrollY, "change", (y) => {
    setNavHidden(y > scrollY.getPrevious() && y > 120);
  });
  // Also re-check without a scroll: on first paint, after a route change and after a theme switch.
  useEffect(() => {
    // Pages are lazy, so check again once the route's chunk has had a moment to paint.
    const check = () => setNavOnLight(surfaceIsLight(window.innerWidth / 2, 40));
    const frame = requestAnimationFrame(check);
    const late = setTimeout(check, 700);
    return () => { cancelAnimationFrame(frame); clearTimeout(late); };
  }, [pathname, theme, ready]);
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 28, mass: 0.25 });
  useEffect(() => { ensureTranslations().then(() => setReady(true)); }, []);
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 28 }}>
      <motion.div className="portfolio-progress" style={{ scaleX: progress }} />
      <motion.header className={`portfolio-nav-wrap${navOnLight ? " is-light" : ""}`}
        animate={{ y: navHidden ? "-140%" : "0%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}
        onFocusCapture={() => setNavHidden(false)}>
        <nav aria-label="Portfolio" className="portfolio-nav" onMouseLeave={() => setHovered(null)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHovered(null)}>
          <Link to="/" className="portfolio-wordmark" aria-label="Hugo Wishpax — Portfolio" {...hover("home")}>
            {pill("home")}<HugoLogo className="h-7 w-7" aria-hidden="true" /> <span translate="no">Hugo Wishpax</span>
          </Link>
          <div className="portfolio-nav-links">
            <Link to="/#projects" {...hover("projects")}>{pill("projects")}{t("projectsPage.navLabel", "Dự Án")}</Link>
            <Link to="/#about" {...hover("about")}>{pill("about")}{t("intro.story.profile.kicker", "Hồ sơ")}</Link>
            <Link to="/#skills" {...hover("skills")}>{pill("skills")}{language.language.startsWith("vi") ? "Kỹ năng" : "Skills"}</Link>
            <a href={cvPdf()} target="_blank" rel="noreferrer" {...hover("cv")}>{pill("cv")}CV</a>
          </div>
          <div className="portfolio-nav-actions">
            <button type="button" className="portfolio-theme" onClick={toggleTheme} {...hover("theme")}
              aria-label={language.language.startsWith("vi") ? (theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối") : (theme === "dark" ? "Switch to light theme" : "Switch to dark theme")}>
              {pill("theme")}
              <span className="material-symbols-outlined" aria-hidden="true">{theme === "dark" ? "light_mode" : "dark_mode"}</span>
            </button>
            <details className="portfolio-languages">
              <summary aria-label="Language" {...hover("lang")}>
                {pill("lang")}
                <span className="material-symbols-outlined" aria-hidden="true">language</span>
                {LANGS.find((item) => language.language.startsWith(item.code))?.short || "VI"}
              </summary>
              <div role="menu" translate="no">
                {LANGS.map(({ code, name }) => (
                  <a key={code} role="menuitem" href={`${code === "vi" ? "" : `/${code}`}${pathname}`} onClick={clearGoogleTranslate}
                    aria-current={language.language.startsWith(code) && !translatedByGoogle() ? "page" : undefined}>{name}</a>
                ))}
                {!otherLanguages && (
                  <button type="button" role="menuitem" className="portfolio-languages-more" onClick={() => setOtherLanguages(true)}>
                    {language.language.startsWith("vi") ? "Ngôn ngữ khác…" : "Other languages…"}
                  </button>
                )}
                <div id="gt-element" className="portfolio-gt" hidden={!otherLanguages} />
              </div>
            </details>
          </div>
        </nav>
      </motion.header>
      <main id="top">
        {ready ? <ErrorBoundary resetKey={pathname}><Suspense fallback={<PageSkeleton />}>
          <ScrollPosition />
          <Routes>
            <Route path="/" element={<Introduction />} />
            <Route path="/introduction" element={<Navigate to="/" replace />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/project/:slug" element={<Project />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense></ErrorBoundary> : <PageSkeleton />}
      </main>
      <OfflineNotice />
      <footer className="portfolio-footer">
        <div className="portfolio-footer-inner">
          <div className="portfolio-footer-grid">
            {/* Col 1: Brand & Tagline & Social Badges */}
            <div className="portfolio-footer-brand-col">
              <Link to="/" className="portfolio-footer-brand" aria-label="Hugo Wishpax">
                <HugoLogo className="h-8 w-8" aria-hidden="true" />
                <span translate="no">Hugo Wishpax</span>
              </Link>
              <p className="portfolio-footer-bio">
                {language.language.startsWith("vi")
                  ? "Lê Gia Huy, sinh viên năm cuối Kỹ thuật phần mềm tại Greenwich Việt Nam. Làm web và app với React, Next.js và Node.js."
                  : "Lê Gia Huy, final-year Software Engineering student at Greenwich Vietnam. Building web and mobile apps with React, Next.js and Node.js."}
              </p>
              <div className="portfolio-footer-socials">
                <a href="https://www.tiktok.com/@pethugowishpaxle?_r=1&_t=ZS-9B96A7FnRyP" target="_blank" rel="noreferrer" title="TikTok" aria-label="TikTok">
                  <img src="/social-logos/tiktok.svg" alt="TikTok" />
                </a>
                <a href="https://github.com/Hugo-huy2004" target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub">
                  <img src="/social-logos/github.svg" alt="GitHub" />
                </a>
                <a href="https://www.facebook.com/share/18jfh4AUPh/?mibextid=wwXIfr" target="_blank" rel="noreferrer" title="Facebook" aria-label="Facebook">
                  <img src="/social-logos/facebook.svg" alt="Facebook" />
                </a>
                <a href="mailto:hugowishpax@gmail.com" title="Email" aria-label="Email">
                  <img src="/social-logos/gmail.svg" alt="Email" />
                </a>
              </div>
            </div>

            {/* Col 2: Dự án / Projects */}
            <div className="portfolio-footer-col">
              <h4>{language.language.startsWith("vi") ? "Dự án" : "Projects"}</h4>
              <ul>
                <li><Link to="/project/chanh-toa">Chánh Tòa Mỹ Tho</Link></li>
                <li><Link to="/project/minh-oi-media">Minh Ơi Media</Link></li>
                <li><Link to="/project/hwj">HWJ Photography</Link></li>
                <li><Link to="/project">{language.language.startsWith("vi") ? "Tất cả dự án →" : "All projects →"}</Link></li>
              </ul>
            </div>

            {/* Col 3: Công nghệ / Tech Stack */}
            <div className="portfolio-footer-col">
              <h4>{language.language.startsWith("vi") ? "Công nghệ" : "Tech Stack"}</h4>
              <ul>
                <li><Link to="/#skills">React & Next.js</Link></li>
                <li><Link to="/#skills">Node.js & Express</Link></li>
                <li><Link to="/#skills">MongoDB & SQL</Link></li>
                <li><Link to="/#skills">TypeScript & React Native</Link></li>
              </ul>
            </div>

            {/* Col 4: Cộng đồng / Community */}
            <div className="portfolio-footer-col">
              <h4>{language.language.startsWith("vi") ? "Cộng đồng" : "Community"}</h4>
              <ul>
                <li><a href="https://www.tiktok.com/@pethugowishpaxle?_r=1&_t=ZS-9B96A7FnRyP" target="_blank" rel="noreferrer">TikTok @pethugowishpaxle</a></li>
                <li><a href="https://github.com/Hugo-huy2004" target="_blank" rel="noreferrer">GitHub @Hugo-huy2004</a></li>
                <li><a href="https://www.facebook.com/share/18jfh4AUPh/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook Lê Gia Huy</a></li>
              </ul>
            </div>

            {/* Col 5: Giới thiệu / About */}
            <div className="portfolio-footer-col">
              <h4>{language.language.startsWith("vi") ? "Giới thiệu" : "About"}</h4>
              <ul>
                <li><Link to="/#about">{language.language.startsWith("vi") ? "Về Hugo Wishpax" : "About Hugo"}</Link></li>
                <li><a href={cvPdf(language.language)} download>{language.language.startsWith("vi") ? "Tải CV PDF" : "Download CV"}</a></li>
                <li><Link to="/#education">{language.language.startsWith("vi") ? "Học vấn & Bằng cấp" : "Education"}</Link></li>
                <li><a href={SERVICES_ORIGIN} target="_blank" rel="noreferrer">{t("navbar.services", "Dịch vụ")}</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright notice row */}
          <div className="portfolio-footer-copyright">
            <p>
              {language.language.startsWith("vi")
                ? `© ${new Date().getFullYear()} Hugo Wishpax · Lê Gia Huy. Mọi dự án và dòng code đều được xây dựng với sự tỉ mỉ.`
                : `© ${new Date().getFullYear()} Hugo Wishpax · Le Gia Huy. Code and products crafted with precision and soul.`}
            </p>
          </div>

          {/* Giant background typography watermark */}
          <div className="portfolio-footer-watermark" aria-hidden="true" translate="no">
            HUGO WISHPAX
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}

await i18n.changeLanguage(prefix.slice(1) || "vi");
createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter basename={prefix || undefined}><Portfolio /></BrowserRouter></React.StrictMode>,
);
