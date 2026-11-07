import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, FileText, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { sound } from "../../sound.js";
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
    <svg viewBox="0 0 600 244" preserveAspectRatio="xMidYMax meet">
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
      {/* base tier */}
      <path d="M8 140 A292 42 0 0 0 592 140 V196 A292 42 0 0 1 8 196 Z" fill="url(#podium-side)" />
      <path d="M8 140 A292 42 0 0 0 592 140 V196 A292 42 0 0 1 8 196 Z" fill="url(#podium-shade)" />
      <ellipse cx="300" cy="140" rx="292" ry="42" fill="url(#podium-top)" />
      <ellipse cx="300" cy="140" rx="292" ry="42" fill="none" stroke="#fff3cf" strokeOpacity=".7" strokeWidth="2.5" />
      <ellipse cx="300" cy="146" rx="212" ry="26" fill="#4d3208" opacity=".22" />
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

  // Opening scene: hero pins, dock & type recede, the room darkens, Hugo steps forward on the podium.
  // Lighting is plain gradient divs animated by opacity/transform only: the old full-screen SVG beams with blend modes lagged.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (end, frontScale) => gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end, scrub: true, pin: true, anticipatePin: 1 } })
      .to(".hero-dock-wrap", { autoAlpha: 0, y: 30, duration: 0.22, ease: "none" }, 0)
      .to(".hero-layer--back", { autoAlpha: 0, yPercent: -10, scale: 0.88, duration: 0.3, ease: "none" }, 0)
      .to(".hero-museum-backdrop", { autoAlpha: 1, duration: 0.35, ease: "none" }, 0.05)
      .fromTo(".hero-beam", { autoAlpha: 0, scaleY: 0.2 }, { autoAlpha: 1, scaleY: 1, duration: 0.3, ease: "power2.out" }, 0.15)
      .fromTo(".hero-pool", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out" }, 0.3)
      .to(".hero-layer--front", { scale: frontScale, transformOrigin: "50% 80%", duration: 0.45, ease: "none" }, 0.18)
      .fromTo(".hero-title", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, ease: "none" }, 0.4)
      .from(".hero-title > *", { y: 40, opacity: 0, stagger: 0.08, duration: 0.25, ease: "power2.out" }, 0.4)
      .to({}, { duration: 0.25 });
    mm.add(desktopMotion, () => { build("+=80%", 1.05); });
    mm.add(phoneMotion, () => { build("+=60%", 1.02); });
  }, { scope: ref });

  return (
    <section ref={ref} className="hero">

      {/* Dark atmospheric backdrop */}
      <div className="hero-museum-backdrop" aria-hidden="true" />
      {/* Stage light: one beam from above, a pool on the floor, and the title card once the room is dark. */}
      <div className="hero-beam" aria-hidden="true" />
      <div className="hero-pool" aria-hidden="true" />
      <div className="hero-title" aria-hidden="true">
        <p>{copy.sloganKicker}</p>
        <p>{copy.slogan}</p>
      </div>

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

// The page is cut like a film: seven scenes, letterbox bars close and reopen on every cut,
// a HUD in the corner reads the scene and a timecode off the scroll position.
const scenes = [
  [".hero", "Mở màn", "Opening"], [".creator-marquee", "Thước phim", "Showreel"], [".creator-about", "Hồ sơ", "Profile"],
  [".creator-skills", "Kỹ năng", "Skills"], [".edu", "Học vấn", "Education"], [".journey", "Hành trình", "Journey"], [".outro", "Lời kết", "Credits"],
];
const FILM_SECONDS = 180; // ponytail: whole page reads as a 3-minute reel; the timecode is scroll progress × this

function FilmHud({ language }) {
  const { scrollYProgress } = useScroll();
  const [scene, setScene] = useState(0);
  const timecode = useRef(null);
  const sceneRef = useRef(0);
  // Rect checks instead of triggers: pin spacers already shift the sections, so this never goes stale after a refresh.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const middle = window.innerHeight / 2;
    const current = scenes.reduce((found, [selector], index) => (document.querySelector(selector)?.getBoundingClientRect().top <= middle ? index : found), 0);
    if (current !== sceneRef.current) sound.scene(current > sceneRef.current);
    sceneRef.current = current;
    setScene(current);
    const frames = Math.round(progress * FILM_SECONDS * 24);
    const pad = (value) => String(value).padStart(2, "0");
    if (timecode.current) timecode.current.textContent = `${pad(Math.floor(frames / 1440))}:${pad(Math.floor(frames / 24) % 60)}:${pad(frames % 24)}`;
  });
  return (
    <>
      <div className="film-bars" aria-hidden="true"><i /><i /></div>
      {/* Always mounted, only faded: GSAP wraps pinned siblings in pin-spacers, so React must never insert nodes next to them. */}
      <motion.div className="film-hud" aria-hidden="true" initial={false} animate={{ opacity: scene > 0 ? 1 : 0, y: scene > 0 ? 0 : 16 }} transition={{ duration: 0.5, ease }}>
        <span className="film-hud-rec" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.b key={scene} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.35, ease }}>
            SC {String(scene + 1).padStart(2, "0")} · {scenes[scene][language === "vi" ? 1 : 2]}
          </motion.b>
        </AnimatePresence>
        <span ref={timecode} className="film-hud-time">00:00:00</span>
      </motion.div>
    </>
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

  // One timeline script for the whole film, written in page order: ScrollTrigger measures each scene
  // after the pins above it, so the order below is load-bearing. Hero (scene 1) pins in HeroSection, which mounts first.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ desktop: desktopMotion, phone: phoneMotion }, ({ conditions }) => {
      const { desktop, phone } = conditions;
      if (!desktop && !phone) return undefined;

      // A cut: the letterbox closes as the next scene arrives and reopens once it has the frame.
      // `wipe` also opens the incoming scene from an inset, rounded frame, like a shot cutting in.
      const cut = (section, wipe) => {
        gsap.timeline({ scrollTrigger: { trigger: section, start: "top 85%", end: "top 15%", scrub: 0.4 } })
          .to(".film-bars i", { scaleY: 1, ease: "power2.in" })
          .to(".film-bars i", { scaleY: 0, ease: "power2.out" });
        if (wipe) gsap.fromTo(section, { clipPath: "inset(6% 5% 0% 5% round 3rem)" }, { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "top 25%", scrub: 0.5 } });
      };
      // Phones: every scene plays with the scroll (scrubbed), so dragging back rewinds it like a film.
      const scrubIn = (targets, vars, trigger, start = "top 90%", end = "top 45%") => gsap.from(targets, { ease: "none", ...vars, scrollTrigger: { trigger: trigger || targets, start, end, scrub: 0.5 } });

      // ── Scene 2 · Showreel: strips advance with scroll and lean into the scroll speed like film through a gate.
      cut(".creator-marquee");
      const reel = { trigger: ".creator-marquee", start: "top bottom", end: "bottom top", scrub: 0.5 };
      gsap.fromTo(".creator-marquee-track:not(.is-reverse)", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: reel });
      gsap.fromTo(".creator-marquee-track.is-reverse", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: reel });
      const lean = gsap.quickSetter(".creator-marquee-viewport", "skewX", "deg");
      const proxy = { skew: 0 };
      ScrollTrigger.create({ trigger: ".creator-marquee", start: "top bottom", end: "bottom top", onUpdate: (self) => {
        const skew = gsap.utils.clamp(-10, 10, self.getVelocity() / -300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, { skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => lean(proxy.skew) });
        }
      } });

      // ── Scene 3 · Profile: pinned; the line plays out word by word like a subtitle, then the signature is signed.
      cut(".creator-about");
      const words = gsap.utils.toArray(".sub-word");
      const strokes = gsap.utils.toArray(".sig-stroke");
      gsap.set(words, { opacity: 0.14 });
      gsap.set(strokes, { strokeDasharray: "1 1", strokeDashoffset: 1, opacity: 0 }); // opacity hides each round-cap dot until its stroke starts
      const profile = gsap.timeline({ scrollTrigger: { trigger: ".creator-about", start: desktop ? "top top" : "bottom bottom", end: "+=150%", scrub: 0.5, pin: true, anticipatePin: 1 } });
      profile.to(words, { opacity: 1, stagger: 0.05, duration: 0.2, ease: "none" }).to({}, { duration: 0.15 });
      strokes.forEach((stroke) => {
        profile.set(stroke, { opacity: 1 }).to(stroke, { strokeDashoffset: 0, ease: "power1.inOut", duration: Number(stroke.dataset.duration) }).to({}, { duration: 0.06 });
      });
      if (desktop) gsap.fromTo(".creator-about-photo", { yPercent: 14 }, { yPercent: -14, ease: "none",
        scrollTrigger: { trigger: ".creator-about", start: "top bottom", end: "bottom top", scrub: 0.5 } });

      // ── Scene 4 · Skills: pinned, the frames slide sideways (phones too: the reel is short enough to fit one screen).
      cut(".creator-skills", true);
      {
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
      }

      // ── Scene 5 · Education: desktop stacks the chapters on a pinned stage; phones stack them as sticky cards (chapters can be taller than a phone screen).
      cut(".edu", true);
      gsap.set(".scout-reveal", { strokeDasharray: "1 1", strokeDashoffset: 1 });
      if (desktop) {
        const panels = gsap.utils.toArray(".edu-panel");
        gsap.set(panels.slice(1), { yPercent: 100 });
        gsap.from(panels[0].querySelector(".edu-visual"), { scale: 0.6, rotate: -14, autoAlpha: 0, ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".edu", start: "top 85%", end: "top 15%", scrub: 0.6 } });
        const hold = 0.8; // each chapter holds still this long (in viewports of scroll) before the next cuts in
        const chaptersTl = gsap.timeline({ scrollTrigger: { trigger: ".edu", start: "top top", scrub: 0.7, pin: true, anticipatePin: 1,
          end: () => `+=${window.innerHeight * chaptersTl.duration()}`, invalidateOnRefresh: true } });
        panels.slice(1).forEach((panel, index) => {
          const at = hold + index * (1 + hold);
          chaptersTl
            // explicit start value: tweening from filter "none" would start at brightness(0), i.e. black
            .fromTo(panels[index], { scale: 1, filter: "brightness(1)" }, { scale: 0.88, filter: "brightness(0.55)", ease: "none" }, at)
            .to(panel, { yPercent: 0, ease: "none" }, at)
            .from(panel.querySelectorAll(".edu-copy > *"), { y: 46, autoAlpha: 0, stagger: 0.06, ease: "power2.out", duration: 0.4 }, at + 0.5)
            .from(panel.querySelector(".edu-visual"), { scale: 0.5, rotate: -18, autoAlpha: 0, ease: "back.out(1.7)", duration: 0.45 }, at + 0.45);
        });
        // Scarf goes on: the picture swings round in 3D while the red colours in along the scarf, in tying order.
        const tieAt = hold + (panels.length - 2) * (1 + hold) + 0.85;
        chaptersTl
          .fromTo(".scout-bust", { rotationY: 32, rotationX: 8, transformPerspective: 900 }, { rotationY: 0, rotationX: 0, ease: "power2.out", duration: 1 }, tieAt - 0.3)
          .to(".scout-reveal", { strokeDashoffset: 0, ease: "power1.inOut", duration: 0.35, stagger: 0.2 }, tieAt)
          .to({}, { duration: hold }); // last chapter holds before the section unpins
      } else {
        // Chapters stack like cards: each sticks once fully read (top = viewport − its height, so tall ones still scroll),
        // the next slides over it and the one underneath sinks back. Each cuts in from a framed inset, emblem and copy scrub in.
        const panels = gsap.utils.toArray(".edu-panel");
        panels.forEach((panel, index) => {
          if (index < panels.length - 1) {
            gsap.set(panel, { position: "sticky", top: () => Math.min(0, window.innerHeight - panel.offsetHeight) });
            gsap.fromTo(panel, { scale: 1, "--dim": 0 }, { scale: 0.9, "--dim": 0.65, ease: "none", transformOrigin: "50% 0", // dim via overlay: fading the card would show the one beneath
              scrollTrigger: { trigger: panels[index + 1], start: "top bottom", end: "top top", scrub: true } });
          }
          if (index) gsap.fromTo(panel, { clipPath: "inset(8% 6% 0% 6% round 2rem)" }, { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "top 30%", scrub: 0.5 } });
          scrubIn(panel.querySelector(".edu-visual"), { scale: 0.5, rotate: -16, autoAlpha: 0 }, panel, "top 80%", "top 25%");
          scrubIn(panel.querySelectorAll(".edu-copy > *"), { y: 60, autoAlpha: 0, stagger: 0.1 }, panel.querySelector(".edu-copy"));
        });
        gsap.to(".scout-reveal", { strokeDashoffset: 0, stagger: 0.2, ease: "power1.inOut", scrollTrigger: { trigger: ".scout-bust", start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
      }

      // ── Scene 6 · Journey: desktop pins and travels sideways, the path drawing as it goes; phones stack the stops and scrub each one in.
      cut(".journey", true);
      if (desktop) {
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
      } else {
        // Each stop: copy slides in from the left, the main shot lands, polaroids are tossed on top.
        gsap.utils.toArray(".journey-slide").forEach((slide) => {
          const visual = slide.querySelector(".journey-visual");
          scrubIn(slide.querySelectorAll(".journey-copy > *"), { x: -60, autoAlpha: 0, stagger: 0.08 }, slide, "top 85%", "top 35%");
          scrubIn(slide.querySelector(".journey-hero"), { scale: 0.75, rotate: -8, autoAlpha: 0 }, visual, "top 95%", "top 50%");
          scrubIn(slide.querySelectorAll(".journey-polaroid"), { y: 160, rotate: (index) => [-24, 20, -14][index], autoAlpha: 0, stagger: 0.1 }, visual, "top 85%", "top 30%");
        });
      }

      // ── Scene 7 · Credits: an iris opens on the cobalt frame, then the lines and channels step in.
      cut(".outro");
      gsap.fromTo(".outro-iris", { clipPath: "circle(12% at 50% 55%)" }, { clipPath: "circle(150% at 50% 55%)", ease: "none",
        scrollTrigger: { trigger: ".outro", start: "top 90%", end: "top 10%", scrub: 0.6 } });
      // Content plays as one beat once the iris is mostly open (not scrubbed: half-way states stacked the mail over the tiles).
      gsap.timeline({ scrollTrigger: { trigger: ".outro", start: "top 35%", toggleActions: "play none none reverse" } })
        .from(".outro-title > span:first-child, .outro-line, .outro-mail", { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.7, ease: "power3.out" })
        .from(".outro-channels li", { y: 40, scale: 0.8, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: "back.out(1.6)" }, "-=0.35")
        .from(".outro-credits", { autoAlpha: 0, duration: 0.6 }, "-=0.2");

      // Resizing across 820px swaps scripts: hand the reels back to native scrolling.
      return () => {
        gsap.set(".skills-reel, .skills-progress, .journey-reel", { clearProps: "overflow,display" });
        gsap.set(".edu-panel", { clearProps: "all" });
      };
    });
  }, { scope: root });
  return (
    <div ref={root} className="creator-home">
      <FilmHud language={language} />
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
          <p className="creator-about-copy">{copy.about.split(" ").map((word, index) => <span key={index} className="sub-word">{word} </span>)}</p>
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
