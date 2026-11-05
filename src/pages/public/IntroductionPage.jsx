import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, FileText, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { TegakiRenderer } from "tegaki";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import scriptFont from "../../fonts/heroScript";
import { cvPdf } from "../../config/publicSites";
import { useHeadMeta } from "../../hooks/useHeadMeta";
import { projects, shotUrl } from "../../data/projects";
import TechLogo from "../../components/public/TechLogo";
import ScoutBust from "../../components/public/ScoutBust";
import { SmartImg } from "../../components/public/Resilience";
import { playHapticTick } from "../../utils/CinematicSoundEngine";
import "./introduction.css";

const reveal = {
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

// Headings rise out of a mask like the hero name. Negative insets keep accents and descenders visible once open.
// The wrapper observes the viewport: IntersectionObserver ignores an element whose own clip-path hides it.
const riseVariants = {
  hidden: { clipPath: "inset(-20% -5% 100% -5%)", y: 48 },
  show: { clipPath: "inset(-20% -5% -20% -5%)", y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

function RiseHeading({ children }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      <motion.h2 variants={riseVariants}>{children}</motion.h2>
    </motion.div>
  );
}

const languageLogos = [
  ["JavaScript", "javascript"], ["TypeScript", "typescript"], ["PHP", "php"],
  ["Python", "python"], ["C#", "csharp"], ["C++", "cplusplus"], ["SQL", "sql"],
];

// Liquid glass: backdrop-filter: url() refraction only renders in Chromium; other engines keep the frosted blur.
gsap.registerPlugin(ScrollTrigger, useGSAP);
const motionOk = "(prefers-reduced-motion: no-preference)";
// Pinned, scroll-jacked scenes only where they feel good: wide screens. Phones keep native scrolling with lighter reveals.
const desktopMotion = "(min-width: 821px) and (prefers-reduced-motion: no-preference)";
const phoneMotion = "(max-width: 820px) and (prefers-reduced-motion: no-preference)";

const supportsLiquid = typeof navigator !== "undefined" && "userAgentData" in navigator;
const ease = [0.16, 1, 0.3, 1];

// Handwritten lines: "Creation" starts once the name has risen, "Development" follows when it finishes.
function HeroScript() {
  const [step, setStep] = useState(0);
  useEffect(() => { const timer = setTimeout(() => setStep(1), 900); return () => clearTimeout(timer); }, []);
  return (
    <div className="hero-script" aria-hidden="true" translate="no">
      {/* Wrappers carry the positioning: the renderer sets its own inline position. */}
      <div className="hero-script-creation">
        <TegakiRenderer font={scriptFont} reducedMotion="user" fallbackFont="cursive"
          time={{ mode: "uncontrolled", speed: 1.3, playing: step >= 1 }} onComplete={() => setStep(2)}>Creation</TegakiRenderer>
      </div>
      <div className="hero-script-development">
        <TegakiRenderer font={scriptFont} reducedMotion="user"
          time={{ mode: "uncontrolled", speed: 1.5, playing: step >= 2 }}>Development</TegakiRenderer>
      </div>
    </div>
  );
}

// Two-tier gold podium the portrait sits on: brushed-metal sides, lit top faces, a bright rim on each edge.
function Podium() {
  return (
    <svg viewBox="0 0 600 236" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="podium-side" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5418" /><stop offset=".12" stopColor="#c9952f" /><stop offset=".3" stopColor="#f6d78a" />
          <stop offset=".46" stopColor="#d6a743" /><stop offset=".62" stopColor="#a8761f" /><stop offset=".8" stopColor="#e9c56c" /><stop offset="1" stopColor="#6e4a12" />
        </linearGradient>
        <radialGradient id="podium-top" cx=".42" cy=".35" r=".75">
          <stop offset="0" stopColor="#f8e2a4" /><stop offset=".55" stopColor="#d9ab4c" /><stop offset="1" stopColor="#a9781f" />
        </radialGradient>
        <linearGradient id="podium-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
      </defs>
      <ellipse cx="300" cy="222" rx="296" ry="14" fill="#06103a" opacity=".35" />
      {/* base tier */}
      <path d="M8 140 A292 42 0 0 0 592 140 V196 A292 42 0 0 1 8 196 Z" fill="url(#podium-side)" />
      <path d="M8 140 A292 42 0 0 0 592 140 V196 A292 42 0 0 1 8 196 Z" fill="url(#podium-shade)" />
      <ellipse cx="300" cy="140" rx="292" ry="42" fill="url(#podium-top)" />
      <ellipse cx="300" cy="140" rx="292" ry="42" fill="none" stroke="#fff3cf" strokeOpacity=".7" strokeWidth="2.5" />
      <ellipse cx="300" cy="146" rx="214" ry="28" fill="#5a3c0c" opacity=".35" />
      {/* top tier */}
      <path d="M90 52 A210 30 0 0 0 510 52 V120 A210 30 0 0 1 90 120 Z" fill="url(#podium-side)" />
      <path d="M90 52 A210 30 0 0 0 510 52 V120 A210 30 0 0 1 90 120 Z" fill="url(#podium-shade)" />
      <ellipse cx="300" cy="52" rx="210" ry="30" fill="url(#podium-top)" />
      <ellipse cx="300" cy="52" rx="210" ry="30" fill="none" stroke="#fff3cf" strokeOpacity=".75" strokeWidth="2.5" />
    </svg>
  );
}

function HeroSection({ copy }) {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);

  // Opening scene: hero pins, dock & type recede, deep darkness settles,
  // multi-angle spotlights beam onto Hugo on the podium with full feet visibility.
  useGSAP(() => {
    const mm = gsap.matchMedia();

    const buildTimeline = (endDistance, frontScale, frameScale) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: endDistance,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Initial fade out of dock and background letters/sun (compositor-only transforms)
      tl.to(".hero-dock-wrap", { autoAlpha: 0, y: 30, duration: 0.2, ease: "power1.out" }, 0)
        .to(".hero-layer--back", { autoAlpha: 0, yPercent: -12, scale: 0.86, duration: 0.32, ease: "power2.inOut" }, 0)
        // 2. Dark backdrop fade
        .to(".hero-museum-backdrop", { autoAlpha: 1, duration: 0.35, ease: "power2.inOut" }, 0.05)
        // 3. Floor spotlight pool under podium
        .fromTo(".hero-spotlight-floor",
          { autoAlpha: 0, scale: 0.7 },
          { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" },
          0.16
        )
        // 4. Spotlights beam in from multiple sides onto Hugo
        .fromTo(".spotlight-beam--left",
          { autoAlpha: 0, scaleY: 0.3, transformOrigin: "top left" },
          { autoAlpha: 0.95, scaleY: 1, duration: 0.45, ease: "power2.out" },
          0.18
        )
        .fromTo(".spotlight-beam--right",
          { autoAlpha: 0, scaleY: 0.3, transformOrigin: "top right" },
          { autoAlpha: 0.95, scaleY: 1, duration: 0.45, ease: "power2.out" },
          0.2
        )
        .fromTo(".spotlight-beam--top",
          { autoAlpha: 0, scaleY: 0.3, transformOrigin: "top center" },
          { autoAlpha: 0.9, scaleY: 1, duration: 0.42, ease: "power2.out" },
          0.22
        )
        .fromTo(".spotlight-lamp",
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" },
          0.2
        )
        // 5. Hugo and pedestal stepped forward (keeping full feet completely visible)
        .to(".hero-layer--front", {
          scale: frontScale,
          yPercent: 0,
          transformOrigin: "50% 80%",
          duration: 0.45,
          ease: "power2.out",
        }, 0.18)
        // 6. Hold the full spotlight showcase moment
        .to({}, { duration: 0.35 })
        // 7. Transition seamlessly into marquee
        .to(ref.current, {
          scale: frameScale,
          borderRadius: 36,
          transformOrigin: "50% 80%",
          ease: "power1.inOut",
          duration: 0.28,
        }, 0.88);
    };

    mm.add(desktopMotion, () => {
      buildTimeline("+=110%", 1.05, 0.9);
    });

    mm.add(phoneMotion, () => {
      buildTimeline("+=90%", 1.02, 0.95);
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="hero">
      <svg className="hero-defs" aria-hidden="true" focusable="false">
        <filter id="hero-liquid" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.02" numOctaves="1" seed="4" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Dark atmospheric backdrop */}
      <div className="hero-museum-backdrop" aria-hidden="true" />

      {/* Background layer: sun, handwritten script, Hugo name */}
      <div className="hero-layer hero-layer--back">
        <motion.span className="hero-sun" aria-hidden="true" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25, duration: 1.2, ease }} />
        <HeroScript />
        <motion.h1 className="hero-name" aria-label="Hugo" translate="no">
          {"Hugo".split("").map((letter, index) => (
            <span key={letter} className="hero-name-mask" aria-hidden="true">
              <motion.span initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ delay: 0.1 + index * 0.07, duration: 1.1, ease }}>{letter}</motion.span>
            </span>
          ))}
        </motion.h1>
      </div>

      {/* Spotlights & beam system (100% GPU-accelerated gradients, zero heavy filters) */}
      <div className="hero-spotlights" aria-hidden="true">
        <svg className="hero-spotlights-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id="spotlight-beam-left-grad" x1="0.08" y1="0" x2="0.5" y2="0.9">
              <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.85" />
              <stop offset="22%" stopColor="#ffd54f" stopOpacity="0.4" />
              <stop offset="55%" stopColor="#ffb300" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#ffb300" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="spotlight-beam-right-grad" x1="0.92" y1="0" x2="0.5" y2="0.9">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#7dd3fc" stopOpacity="0.38" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="spotlight-beam-top-grad" x1="0.5" y1="0" x2="0.5" y2="0.95">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
              <stop offset="30%" stopColor="#fffbeb" stopOpacity="0.32" />
              <stop offset="65%" stopColor="#fef3c7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="lamp-flare-gold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#fff3bf" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#ffc107" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffc107" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lamp-flare-cyan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#bae6fd" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lamp-flare-white" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#f8fafc" stopOpacity="0.8" />
              <stop offset="65%" stopColor="#cbd5e1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Left Spotlight Cone */}
          <polygon
            className="spotlight-beam spotlight-beam--left"
            points="60,-10 140,-10 680,920 320,920"
            fill="url(#spotlight-beam-left-grad)"
          />

          {/* Right Spotlight Cone */}
          <polygon
            className="spotlight-beam spotlight-beam--right"
            points="860,-10 940,-10 680,920 320,920"
            fill="url(#spotlight-beam-right-grad)"
          />

          {/* Top Center Key Light Cone */}
          <polygon
            className="spotlight-beam spotlight-beam--top"
            points="450,-10 550,-10 760,950 240,950"
            fill="url(#spotlight-beam-top-grad)"
          />

          {/* Emitter Fixtures / Lamp Flares */}
          <ellipse className="spotlight-lamp spotlight-lamp--left" cx="100" cy="8" rx="60" ry="24" fill="url(#lamp-flare-gold)" />
          <ellipse className="spotlight-lamp spotlight-lamp--right" cx="900" cy="8" rx="60" ry="24" fill="url(#lamp-flare-cyan)" />
          <ellipse className="spotlight-lamp spotlight-lamp--top" cx="500" cy="5" rx="75" ry="28" fill="url(#lamp-flare-white)" />
        </svg>
      </div>

      {/* Floor spotlight pool beneath podium */}
      <div className="hero-spotlight-floor" aria-hidden="true" />

      {/* Centerpiece: Golden Podium and Portrait with Full Feet Visible */}
      <div className="hero-layer hero-layer--front">
        <motion.div className="hero-podium" aria-hidden="true"
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 1.1, ease }}>
          <Podium />
        </motion.div>
        <motion.img className="hero-portrait" src="/hugo-portrait.png" alt="Hugo Wishpax — Lê Gia Huy"
          initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 1.1, ease }} />
      </div>

      {/* Hero dock banner */}
      <div className="hero-dock-wrap">
        <motion.div className={`hero-dock${supportsLiquid ? " is-liquid" : ""}`}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9, ease }}>
          <div className="hero-meta">
            <p><i aria-hidden="true" />{copy.heroStatus}</p>
            <p><MapPin size={14} aria-hidden="true" />{copy.heroPlace}</p>
          </div>
          <p className="hero-line">{copy.heroLine}</p>
          <div className="hero-actions">
            <a href="#more" className="hero-cta" onClick={playHapticTick}>{i18n.language.startsWith("vi") ? "Xem thêm" : i18n.language.startsWith("zh") ? "查看更多" : "See more"}<ArrowDown size={16} aria-hidden="true" /></a>
            <a href={cvPdf(i18n.language)} target="_blank" rel="noreferrer" className="hero-cta hero-cta--quiet" onClick={playHapticTick}>{t("intro.story.hero.ctaCv")}<FileText size={15} aria-hidden="true" /></a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Signature reveal: thick strokes traced over public/hugo-signature.png (617×405) in signing order,
// used as a mask so the real ink appears as if being signed. [path, seconds to draw]
const signatureStrokes = [
  ["M72 215 C110 188 150 170 192 158 C230 150 240 176 226 204 C214 230 198 256 180 270", 0.55],
  ["M118 192 C145 189 162 200 174 224", 0.2],
  ["M188 158 L184 302", 0.25],
  ["M190 182 C178 232 164 284 145 334", 0.3],
  ["M250 220 C232 226 214 250 220 258 C230 262 244 256 252 252 M224 240 L242 238", 0.35],
  ["M256 132 L264 294", 0.25],
  ["M258 192 L294 190", 0.12],
  ["M236 220 C252 214 262 206 270 212 C266 226 282 234 290 224 C294 214 300 228 308 222 C318 206 326 202 334 212 C340 220 346 206 354 206 C364 206 370 200 382 212 C386 220 372 222 368 214", 0.6],
  ["M368 206 C390 172 430 125 488 90", 0.35],
];

// The strokes are drawn by the page's scroll timeline (About pins until the signature is complete).
function Signature() {
  return (
    <svg className="creator-signature" viewBox="0 0 617 405" aria-hidden="true">
      <defs>
        <mask id="signature-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="617" height="405">
          {signatureStrokes.map(([d, duration]) => (
            <path key={d} className="sig-stroke" data-duration={duration} d={d} pathLength="1" fill="none" stroke="#fff" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </mask>
      </defs>
      <image href="/hugo-signature.png" width="617" height="405" mask="url(#signature-reveal)" />
    </svg>
  );
}

const skillFrames = (language) => [
  { title: language === "vi" ? "Ngôn ngữ" : "Languages", logos: languageLogos.map(([name, icon]) => [name, icon && `/tech-logos/${icon}.svg`]) },
  ...techGroups.map((group) => ({
    title: group.title[language] ?? group.title.en,
    text: group.text?.[language] ?? group.text?.en,
    logos: group.logos?.map((name) => [name, name === "SQL" ? "/tech-logos/sql.svg" : null]),
  })),
];

const techGroups = [
  { title: { vi: "Giao diện", en: "Frontend" }, logos: ["React", "Next.js", "Tailwind", "Expo"] },
  { title: { vi: "Máy chủ", en: "Backend" }, logos: ["Node.js", "Express.js", "Firebase"] },
  { title: { vi: "Cơ sở dữ liệu", en: "Databases" }, logos: ["MongoDB", "SQL"] },
  { title: { vi: "Công cụ & nền tảng", en: "Tools & platforms" }, logos: ["Git", "GitHub", "Docker", "Vercel", "Render"] },
  { title: { vi: "Khái niệm", en: "Concepts" }, text: {
    vi: ["Thiết kế RESTful API", "OAuth", "Mô hình MVC", "Thiết kế đáp ứng"],
    en: ["RESTful API design", "OAuth", "MVC pattern", "Responsive design"],
  } },
];



const socialLinks = [
  { name: "Facebook", icon: "facebook", href: "https://www.facebook.com/share/18jfh4AUPh/?mibextid=wwXIfr" },
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/hugowishpax?rpxt=MW9ibDdkcTNxcm5nYg%3D%3D&utm_source=qr" },
  { name: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@pethugowishpaxle?_r=1&_t=ZS-9B96A7FnRyP" },
  { name: "Zalo", icon: "zalo", href: "https://zalo.me/0839909399" },
  { name: "Mail", icon: "gmail", href: "mailto:hugowishpax@gmail.com" },
  { name: "GitHub", icon: "github", href: "https://github.com/Hugo-huy2004" },
];

const profileCopy = {
  vi: {
    summary: "Software Engineer — Web & Mobile Full-Stack. React · Next.js · Node.js · MongoDB.",
    availability: "Open to Frontend · Backend · Full-Stack",
    heroLine: "Tôi xây sản phẩm web và mobile trọn vẹn, từ cơ sở dữ liệu đến từng chi tiết trên màn hình.",
    heroStatus: "Đang nhận việc frontend, backend và full-stack",
    heroPlace: "Sống và làm việc tại Việt Nam",
    sloganKicker: "LÊ GIA HUY · HUGO WISHPAX",
    slogan: "Tỉ mỉ từng chi tiết · Trọn vẹn từng trải nghiệm",
    sloganSub: "Tôi xây sản phẩm web và mobile trọn vẹn, từ cơ sở dữ liệu đến từng chi tiết trên màn hình.",
    aboutTitle: "Kỹ sư phần mềm.\nLàm trọn từ giao diện tới máy chủ.",
    about: "Lê Gia Huy — Hugo Wishpax. Thiết kế, code, API, dữ liệu và triển khai trong một mạch sản phẩm.",
    legal: "Tên chính thức", languages: "Ngôn ngữ", languagesValue: "Tiếng Anh VSTEP B2 (6.5) · Tiếng Trung HSK 2",
    techHeading: "Kỹ năng chuyên môn", techNote: "Ngôn ngữ, framework và nền tảng mình dùng hằng ngày.",
    education: "Học vấn", degree: "Cử nhân Kỹ thuật phần mềm (Bachelor of Computing) · Sinh viên năm cuối", grade: "Điểm trung bình tạm tính: 69% · US GPA tương đương: 3.80/4.00",
  },
  en: {
    summary: "Software Engineer — Web & Mobile Full-Stack. React · Next.js · Node.js · MongoDB.",
    availability: "Open to Frontend · Backend · Full-Stack",
    heroLine: "I build web and mobile products end to end, from the database to the last detail on screen.",
    heroStatus: "Open to frontend, backend and full-stack roles",
    heroPlace: "Based in Vietnam",
    sloganKicker: "LE GIA HUY · HUGO WISHPAX",
    slogan: "Crafted with Precision · Engineered with Soul",
    sloganSub: "Building web and mobile products end to end, from database to screen.",
    aboutTitle: "Software Engineer.\nFull-Stack Builder.",
    about: "Lê Gia Huy — Hugo Wishpax. Interface, code, API, data and deployment in one product workflow.",
    legal: "Official name", languages: "Languages", languagesValue: "VSTEP English B2 (6.5) · Chinese HSK 2",
    techHeading: "Technical Skills", techNote: "The languages, frameworks and platforms I use every day.",
    education: "Education", degree: "Bachelor of Computing — Software Engineering · Final-year student", grade: "Provisional average: 69% · US GPA equivalent: 3.80/4.00",
  },
};

// Projects as a journey: one full-screen slide per project — stop number and dates, the name set large,
// one hero shot that carries the project, and frosted-glass polaroids of other screens with their captions.
function JourneySlide({ project, index, total, t, from, stopLabel }) {
  const base = `projectsPage.items.${project.id}`;
  const shots = [project.cover || project.shots[0].src, ...project.shots.map(({ src }) => src)]
    .filter((name, position, all) => all.indexOf(name) === position);
  const caption = (src) => t(`${base}.shots.${src}`, project.shots.find((shot) => shot.src === src)?.caption || project.title);
  const [hero, ...rest] = shots;
  return (
    <article className="journey-slide" style={{ "--ambient": `url(${shotUrl(project.id, hero)})` }}>
      <div className="journey-copy">
        <p className="journey-stop"><span>{stopLabel} {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>{project.period.replace("{now}", t("projectsPage.periodNow"))}</p>
        <h3 translate="no">{project.title}</h3>
        <p className="journey-kind">{t(`projectsPage.kinds.${project.kind}`, project.kind)}</p>
        <p className="journey-tagline">{t(`${base}.tagline`, project.tagline)}</p>
        <Link className="journey-cta" to={`/project/${project.id}`} state={{ from }} onClick={playHapticTick}>
          {t("projectsPage.openProject", "Xem dự án")} <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="journey-visual">
        <figure className="journey-hero"><SmartImg src={shotUrl(project.id, hero)} alt={caption(hero)} /></figure>
        {rest.slice(0, 3).map((src, polaroid) => (
          <figure key={src} className={`journey-polaroid journey-polaroid--${polaroid + 1}`}>
            <SmartImg src={shotUrl(project.id, src)} />
            <figcaption>{caption(src)}</figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}

// Education told in three chapters; facts for Nguyễn Đình Chiểu come from vi.wikipedia (founding 17/3/1879, renamed 1953).
const educationChapters = (language, copy) => {
  const vi = language === "vi";
  return [
    {
      id: "greenwich", tone: "sky", label: vi ? "Đại học" : "University",
      visual: <img className="edu-logo edu-logo--wide" src="/education/greenwich.png" alt="University of Greenwich" />,
      kicker: vi ? "Đang theo học" : "Currently studying",
      title: "University of Greenwich (Vietnam)",
      sub: copy.degree,
      facts: [["3.80/4.00", vi ? "GPA quy đổi hệ Mỹ, tạm tính" : "US GPA equivalent, provisional"], ["69%", vi ? "Điểm trung bình tạm tính" : "Provisional average"]],
    },
    {
      id: "ndc", tone: "cobalt", label: vi ? "Trung học" : "High school",
      visual: <img className="edu-logo edu-logo--round" src="/education/nguyen-dinh-chieu.png" alt={vi ? "Logo Trường THPT Nguyễn Đình Chiểu, Mỹ Tho" : "Nguyễn Đình Chiểu High School, Mỹ Tho — logo"} />,
      kicker: vi ? "Tốt nghiệp THPT" : "High School Diploma",
      title: vi ? "THPT Nguyễn Đình Chiểu" : "Nguyễn Đình Chiểu High School",
      sub: "Collège de Mytho · Mỹ Tho",
      body: vi
        ? "Thành lập ngày 17/3/1879 với tên Collège de Mytho, một trong những trường trung học lâu đời nhất Việt Nam. Trường mang tên nhà thơ Nguyễn Đình Chiểu từ năm 1953."
        : "Founded on 17 March 1879 as the Collège de Mytho, one of the oldest high schools in Vietnam. It has carried the name of the poet Nguyễn Đình Chiểu since 1953.",
      facts: [["2019 – 2022", vi ? "Niên khoá" : "Class years"]],
    },
    {
      id: "huynh-truong", tone: "paper", label: vi ? "Cộng đồng" : "Community",
      visual: <ScoutBust label={vi ? "Huynh trưởng TNTT mặc đồng phục, quàng khăn" : "Eucharistic Youth leader in uniform and scarf"} />,
      kicker: vi ? "Xứ Đoàn Các Thánh Tử Đạo Việt Nam · Chánh Tòa Mỹ Tho" : "Vietnamese Martyrs Youth Chapter · Mỹ Tho Cathedral",
      title: vi ? "Huynh trưởng Thiếu Nhi Thánh Thể" : "Eucharistic Youth leader",
      sub: "Phêrô Lê Gia Huy",
      body: vi
        ? "Một chiếc khăn mới mà các em chưa từng được quàng. Một chương trình đào tạo những người dẫn dắt các em. Và những đêm muộn ngồi viết, chụp, đăng để cả xứ đoàn biết điều gì đang xảy ra. Phần còn lại của câu chuyện được kể ở xứ đoàn."
        : "A new scarf the children had never worn. A programme that trains the people who lead them. And late nights writing, shooting and posting so the whole chapter knows what's happening. The rest of the story is told at the chapter.",
      links: [
        { href: "https://chanhtoa.tnttgiaophanmytho.online/gioi-thieu/xu-doan?bio=bdh-le-gia-huy", label: vi ? "Đọc tiếp ở xứ đoàn" : "Read the rest at the chapter" },
      ],
    },
  ];
};

function Education({ language, copy, from }) {
  const chapters = educationChapters(language, copy);
  return (
    <section id="education" className="edu" aria-label={copy.education}>
      <div className="edu-stage">
        {chapters.map((chapter, index) => <article key={chapter.id} className={`edu-panel edu-panel--${chapter.tone}`}>
          <ol className="edu-chapters" aria-hidden="true">
            {chapters.map((item, itemIndex) => <li key={item.id} className={itemIndex === index ? "is-active" : undefined}>{item.label}</li>)}
          </ol>
          <div className="edu-visual">{chapter.visual}</div>
          <div className="edu-copy">
            <p className="edu-kicker">{chapter.kicker}</p>
            <h2>{chapter.title}</h2>
            {chapter.sub && <p className="edu-sub" translate={chapter.id === "huynh-truong" ? "no" : undefined}>{chapter.sub}</p>}
            {chapter.body && <p className="edu-body">{chapter.body}</p>}
            {chapter.facts && <dl className="edu-facts">{chapter.facts.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
            {chapter.links && <div className="edu-links">{chapter.links.map((link, index) => link.href
              ? <a key={link.href} className={`edu-link${index ? " edu-link--quiet" : ""}`} href={link.href} target="_blank" rel="noreferrer" onClick={playHapticTick}>{link.label} <ArrowUpRight size={18} /></a>
              : <Link key={link.to} className={`edu-link${index ? " edu-link--quiet" : ""}`} to={link.to} state={{ from }} onClick={playHapticTick}>{link.label} <ArrowUpRight size={18} /></Link>)}</div>}
          </div>
        </article>)}
      </div>
    </section>
  );
}

// Closing scene: the film ends on the same cobalt as the hero. An iris opens on it while you scroll in,
// the line is handed to the visitor, and each channel is one tile to tap.
function OutroName() {
  const [play, setPlay] = useState(false);
  return (
    <motion.span translate="no" className="outro-name" onViewportEnter={() => setPlay(true)} viewport={{ once: true, amount: 0.8 }}>
      <TegakiRenderer font={scriptFont} reducedMotion="user" time={{ mode: "uncontrolled", speed: 1.2, playing: play }}>Hugo</TegakiRenderer>
    </motion.span>
  );
}

function Contact({ language }) {
  const vi = language === "vi";
  const mail = socialLinks.find((social) => social.icon === "gmail");
  return (
    <section id="contact" className="outro">
      <div className="outro-iris">
        <h2 className="outro-title">
          <span>{vi ? "Kết nối cùng" : "Connect with"}</span>
          <OutroName />
        </h2>
        <p className="outro-line">{vi ? "Một dự án, một câu hỏi hay chỉ một lời chào. Chọn nơi bạn thấy thoải mái nhất." : "A project, a question or just hello. Pick whichever feels most natural."}</p>
        <a className="outro-mail" href={mail.href} onClick={playHapticTick}>hugowishpax@gmail.com <ArrowUpRight size={22} /></a>
        <ul className="outro-channels">
          {socialLinks.filter((social) => social !== mail).map((social) => <li key={social.name}>
            <a href={social.href} target="_blank" rel="noreferrer" onClick={playHapticTick}>
              <img src={`/social-logos/${social.icon}.svg`} alt="" /><span>{social.name}</span>
            </a>
          </li>)}
        </ul>
        <p className="outro-credits">{vi ? "Hết phim · Cảm ơn bạn đã xem" : "The end · Thanks for watching"}</p>
      </div>
    </section>
  );
}

export default function IntroductionPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const language = i18n.language.startsWith("vi") ? "vi" : "en";
  const copy = profileCopy[language];
  const featured = ["minh-oi-media", "hwj", "chanh-toa"].map((id) => projects.find((project) => project.id === id));
  const marquee = useMemo(() => projects.map((project) => ({ id: project.id, title: project.title, src: shotUrl(project.id, project.cover || project.shots[0].src) })), []);
  useHeadMeta("/");
  const root = useRef(null);
  // Reel scenes: the film strips only advance while you scroll, the duotone sticker drifts against the text.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    // Both sizes: film strips, the signature, the outro.
    mm.add(motionOk, () => {
      const reel = { trigger: ".creator-marquee", start: "top bottom", end: "bottom top", scrub: 0.5 };
      gsap.fromTo(".creator-marquee-track:not(.is-reverse)", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: reel });
      gsap.fromTo(".creator-marquee-track.is-reverse", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: reel });
      // About: pin while the signature is signed stroke by stroke; scrolling on only once it's complete.
      const strokes = gsap.utils.toArray(".sig-stroke");
      gsap.set(strokes, { strokeDasharray: "1 1", strokeDashoffset: 1, opacity: 0 }); // opacity hides each round-cap dot until its stroke starts
      const signing = gsap.timeline({ scrollTrigger: { trigger: ".creator-about", start: window.innerWidth > 820 ? "top top" : "bottom bottom", end: "+=110%", scrub: 0.5, pin: true, anticipatePin: 1 } });
      strokes.forEach((stroke) => {
        signing.set(stroke, { opacity: 1 }).to(stroke, { strokeDashoffset: 0, ease: "power1.inOut", duration: Number(stroke.dataset.duration) }).to({}, { duration: 0.06 });
      });
      // Outro: an iris opens on the cobalt frame, then the title lines and channels step in.
      gsap.fromTo(".outro-iris", { clipPath: "circle(12% at 50% 55%)" }, { clipPath: "circle(150% at 50% 55%)", ease: "none",
        scrollTrigger: { trigger: ".outro", start: "top 90%", end: "top 10%", scrub: 0.6 } });
      gsap.from(".outro-title > span:first-child, .outro-line, .outro-mail", { yPercent: 60, autoAlpha: 0, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".outro", start: "top 55%", end: "top 5%", scrub: 0.6 } });
      gsap.from(".outro-channels li", { y: 80, scale: 0.7, rotate: (index) => (index % 2 ? 10 : -10), autoAlpha: 0, stagger: 0.06, ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".outro-channels", start: "top 95%", end: "top 55%", scrub: 0.6 } });
    });
    // Wide screens: pinned scenes.
    mm.add(desktopMotion, () => {
      // Skills reel: pin the section and slide the frames sideways; each frame's logos pop in as it reaches centre.
      const track = root.current.querySelector(".skills-track");
      const distance = () => track.scrollWidth - track.parentElement.clientWidth;
      gsap.set(".skills-reel", { overflow: "hidden" });
      gsap.set(".skills-progress", { display: "block" });
      const reelTween = gsap.to(track, { x: () => -distance(), ease: "none",
        scrollTrigger: { trigger: ".creator-skills", start: "top top", end: () => `+=${distance()}`, scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true } });
      gsap.to(".skills-progress i", { scaleX: 1, ease: "none",
        scrollTrigger: { trigger: ".creator-skills", start: "top top", end: () => `+=${distance()}`, scrub: true } });
      gsap.utils.toArray(".skills-frame").forEach((frame) => {
        const inReel = (start, end) => ({ trigger: frame, containerAnimation: reelTween, start, end, scrub: 0.6 });
        gsap.from(frame.querySelector("h3"), { xPercent: 35, autoAlpha: 0, ease: "power2.out", scrollTrigger: inReel("left 95%", "left 45%") });
        gsap.from(frame.querySelectorAll("li"), { yPercent: 140, rotate: -28, scale: 0.4, autoAlpha: 0, stagger: 0.08, ease: "back.out(1.7)", scrollTrigger: inReel("left 85%", "left 30%") });
      });
      // Education: pinned stage; each chapter slides up over the last, which shrinks back like a cut.
      const panels = gsap.utils.toArray(".edu-panel");
      gsap.set(panels.slice(1), { yPercent: 100 });
      gsap.from(panels[0].querySelector(".edu-visual"), { scale: 0.6, rotate: -14, autoAlpha: 0, ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".edu", start: "top 85%", end: "top 15%", scrub: 0.6 } });
      // Each chapter holds still for a stretch of scroll before the next one cuts in (University first and longest).
      const hold = 0.8;
      // One timeline unit = one viewport of scroll, so the scarf sequence and holds keep their pacing.
      const chaptersTl = gsap.timeline({ scrollTrigger: { trigger: ".edu", start: "top top", scrub: 0.7, pin: true, anticipatePin: 1,
        end: () => `+=${window.innerHeight * chaptersTl.duration()}`, invalidateOnRefresh: true } });
      panels.slice(1).forEach((panel, index) => {
        const at = hold + index * (1 + hold);
        chaptersTl
          // explicit start value: tweening from filter "none" would start at brightness(0), i.e. black
          .fromTo(panels[index], { scale: 1, filter: "brightness(1)" }, { scale: 0.88, filter: "brightness(0.55)", ease: "none" }, at)
          .to(panel, { yPercent: 0, ease: "none" }, at)
          .from(panel.querySelectorAll(".edu-copy > *"), { y: 46, autoAlpha: 0, stagger: 0.06, ease: "power2.out", duration: 0.4 }, at + 0.5);
        chaptersTl.from(panel.querySelector(".edu-visual"), { scale: 0.5, rotate: -18, autoAlpha: 0, ease: "back.out(1.7)", duration: 0.45 }, at + 0.45);
      });
      // Scarf goes on: the picture swings round in 3D while the red colours in along the scarf, in tying order.
      const tieAt = hold + (panels.length - 2) * (1 + hold) + 0.85;
      gsap.set(".scout-reveal", { strokeDasharray: "1 1", strokeDashoffset: 1 });
      chaptersTl
        .fromTo(".scout-bust", { rotationY: 32, rotationX: 8, transformPerspective: 900 }, { rotationY: 0, rotationX: 0, ease: "power2.out", duration: 1 }, tieAt - 0.3)
        .to(".scout-reveal", { strokeDashoffset: 0, ease: "power1.inOut", duration: 0.35, stagger: 0.2 }, tieAt)
        .to({}, { duration: hold }); // last chapter holds before the section unpins
      // Journey: pin the reel, travel sideways; the path draws with the travel, each stop's shots land as it arrives.
      const journey = root.current.querySelector(".journey-track");
      const journeyDistance = () => journey.scrollWidth - journey.parentElement.clientWidth;
      gsap.set(".journey-reel", { overflow: "hidden" });
      gsap.set(".journey-path path", { strokeDasharray: "0.012 0.012" });
      const journeyTween = gsap.to(journey, { x: () => -journeyDistance(), ease: "none",
        scrollTrigger: { trigger: ".journey-reel", start: "top top", end: () => `+=${journeyDistance() * 1.2}`, scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true } });
      gsap.fromTo(".journey-path path", { strokeDashoffset: 1, opacity: 0.2 }, { strokeDashoffset: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".journey-reel", start: "top top", end: () => `+=${journeyDistance() * 1.2}`, scrub: true } });
      gsap.utils.toArray(".journey-slide").forEach((slide) => {
        const stop = (start, end) => ({ trigger: slide, containerAnimation: journeyTween, start, end, scrub: 0.6 });
        gsap.from(slide.querySelectorAll(".journey-copy > *"), { x: 120, autoAlpha: 0, stagger: 0.05, ease: "power2.out", scrollTrigger: stop("left 90%", "left 35%") });
        gsap.from(slide.querySelector(".journey-hero"), { scale: 0.78, rotate: -6, autoAlpha: 0, ease: "power2.out", scrollTrigger: stop("left 95%", "left 40%") });
        gsap.from(slide.querySelectorAll(".journey-polaroid"), { y: 260, rotate: (index) => [-28, 22, -16][index], autoAlpha: 0, stagger: 0.08, ease: "back.out(1.4)", scrollTrigger: stop("left 75%", "left 15%") });
      });
      gsap.fromTo(".creator-about-photo", { yPercent: 14 }, { yPercent: -14, ease: "none",
        scrollTrigger: { trigger: ".creator-about", start: "top bottom", end: "bottom top", scrub: 0.5 } });
    });
    // Phones: native scrolling, light reveals as things come into view.
    mm.add(phoneMotion, () => {
      const reveal = (targets, vars, trigger) => gsap.from(targets, { ...vars, scrollTrigger: { trigger: trigger || targets, start: "top 88%", toggleActions: "play none none reverse" } });
      gsap.utils.toArray(".skills-frame").forEach((frame) => reveal(frame.querySelectorAll("li"), { y: 30, scale: 0.6, autoAlpha: 0, stagger: 0.05, duration: 0.6, ease: "back.out(1.7)" }, frame));
      gsap.utils.toArray(".edu-panel").forEach((panel) => {
        reveal(panel.querySelector(".edu-visual"), { scale: 0.7, rotate: -10, autoAlpha: 0, duration: 0.8, ease: "back.out(1.6)" });
        reveal(panel.querySelectorAll(".edu-copy > *"), { y: 30, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: "power2.out" }, panel.querySelector(".edu-copy"));
      });
      gsap.set(".scout-reveal", { strokeDasharray: "1 1", strokeDashoffset: 1 });
      gsap.to(".scout-reveal", { strokeDashoffset: 0, stagger: 0.2, ease: "power1.inOut", scrollTrigger: { trigger: ".scout-bust", start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
      gsap.utils.toArray(".journey-slide").forEach((slide) => {
        reveal(slide.querySelector(".journey-visual"), { y: 60, autoAlpha: 0, duration: 0.8, ease: "power3.out" });
        reveal(slide.querySelectorAll(".journey-copy > *"), { y: 30, autoAlpha: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" }, slide.querySelector(".journey-copy"));
      });
    });
  }, { scope: root });
  return (
    <div ref={root} className="creator-home">
      <HeroSection copy={copy} />

      <section id="more" className="creator-marquee" aria-label={t("intro.story.work.label")}>
        {[marquee, [...marquee].reverse()].map((row, rowIndex) => <div className="creator-marquee-viewport" key={rowIndex}>
          <div className={`creator-marquee-track ${rowIndex ? "is-reverse" : ""}`}>
            {[...row, ...row].map((item, index) => <SmartImg key={`${item.id}-${index}`} src={item.src} alt={index < row.length ? item.title : ""} />)}
          </div>
        </div>)}
      </section>

      <section id="about" className="creator-about">
        <div className="creator-about-text">
          <motion.p className="creator-kicker" {...reveal}>{t("intro.story.profile.kicker")}</motion.p>
          <RiseHeading>{copy.aboutTitle.split("\n").map((line, index) => <span key={line}>{index ? <em>{line}</em> : line}</span>)}</RiseHeading>
          <motion.p className="creator-about-copy" {...reveal}>{copy.about}</motion.p>
          <motion.div className="creator-about-meta" {...reveal}>
            <span>{copy.legal}<b translate="no">Lê Gia Huy (Hugo Wishpax)</b></span>
            <span>{copy.languages}<b>{copy.languagesValue}</b></span>
          </motion.div>
        </div>
        <figure className="creator-about-photo">
          <svg width="0" height="0" aria-hidden="true" focusable="false">
            {/* Duotone from the hero palette: shadows → cobalt #283DB7, highlights → sun #FFBF08 */}
            <filter id="about-duotone" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues="0.157 1" />
                <feFuncG type="table" tableValues="0.239 0.749" />
                <feFuncB type="table" tableValues="0.718 0.031" />
              </feComponentTransfer>
            </filter>
          </svg>
          <motion.img src="/hugo-about.png" alt={language === "vi" ? "Hugo Wishpax quàng khăn len, nhìn sang bên" : "Hugo Wishpax in a knitted scarf, looking to the side"} loading="lazy"
            initial={{ opacity: 0, scale: 1.18, rotate: -12 }} whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} />
          <Signature />
        </figure>
      </section>

      <section id="skills" className="creator-skills">
        <header><RiseHeading>{copy.techHeading}</RiseHeading><motion.p {...reveal}>{copy.techNote}</motion.p></header>
        {/* Reel: pinned while the frames travel sideways; GSAP drives it, native horizontal scroll is the fallback. */}
        <div className="skills-reel">
          <div className="skills-track">
            {skillFrames(language).map((frame, index, all) => <article key={frame.title} className="skills-frame">
              <p className="skills-frame-count">{index + 1} / {all.length}</p>
              <h3>{frame.title}</h3>
              <ul className={frame.text ? "skills-frame-words" : "skills-frame-logos"}>
                {frame.text?.map((name) => <li key={name}><span>{name}</span></li>)}
                {frame.logos?.map(([name, src]) => <li key={name} title={name}><span>
                  {src ? <img src={src} alt={name} /> : <TechLogo name={name} size={96} />}
                  {!src && <span className="sr-only">{name}</span>}
                </span></li>)}
              </ul>
            </article>)}
          </div>
        </div>
        <div className="skills-progress" aria-hidden="true"><i /></div>
      </section>

      <Education language={language} copy={copy} from={`${location.pathname}${location.search}${location.hash}`} />

      <section id="projects" className="journey">
        <header className="journey-intro"><motion.p className="creator-kicker" {...reveal}>{t("intro.story.work.label")}</motion.p><RiseHeading>{t("intro.story.work.heading")}</RiseHeading><motion.p {...reveal}>{language === "vi" ? "Khách hàng thật, người dùng thật, và vài đêm không ngủ." : "Real clients, real users, and a few sleepless nights."}</motion.p></header>
        <div className="journey-reel">
          <div className="journey-track">
            <svg className="journey-path" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength="1" d="M0 70 C120 20 220 95 333 55 S560 15 666 60 S880 95 1000 40" />
            </svg>
            {featured.map((project, index) => <JourneySlide key={project.id} project={project} index={index} total={featured.length} t={t} stopLabel={language === "vi" ? "Chặng" : "Stop"} from={`${location.pathname}${location.search}${location.hash}`} />)}
            <div className="journey-end">
              <p>{language === "vi" ? "Hành trình vẫn tiếp tục." : "The journey keeps going."}</p>
              <Link className="journey-cta" to="/project" state={{ from: location.pathname }}>{t("intro.story.work.viewAll")} <ArrowUpRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>
      <Contact language={language} />
    </div>
  );
}
