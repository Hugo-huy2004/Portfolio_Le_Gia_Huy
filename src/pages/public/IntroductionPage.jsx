import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, FileText, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { sound } from "../../sound.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cvPdf } from "../../config/publicSites";
import { useHeadMeta } from "../../hooks/useHeadMeta";
import { projects, shotUrl } from "../../data/projects";
import { standing } from "../../data/grades";
import SkillVortex, { playSkillVortex } from "../../components/public/SkillVortex";
import ScoutBust from "../../components/public/ScoutBust";
import GreenwichStage from "../../components/public/GreenwichStage";
import { SmartImg } from "../../components/public/Resilience";
import { startDepth } from "../../utils/depth";
import "./introduction.css";
import "./hero.css";

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


// Liquid glass: backdrop-filter: url() refraction only renders in Chromium; other engines keep the frosted blur.
gsap.registerPlugin(ScrollTrigger, useGSAP);
// Pinned, scroll-jacked scenes only where they feel good: wide screens. Phones keep native scrolling with lighter reveals.
const desktopMotion = "(min-width: 821px) and (prefers-reduced-motion: no-preference)";
const phoneMotion = "(max-width: 820px) and (prefers-reduced-motion: no-preference)";

const ease = [0.16, 1, 0.3, 1];
// Depth slices behind each HUGO letter (hero.css: real 3D concrete block).
const SLICES = Array.from({ length: 24 }, (_, i) => 24 - i); // back to front: later paints on top

// Opening credits, poster style: Hugo sits on his own name.
// On load a projector line flashes, the shutter opens, the letters rise, he sits down onto them, the credits come up
// and a gold light leak sweeps once. Scrolling (pinned) closes an iris of light onto him, then the title card.
const credit = (delay) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.9, ease } });

function HeroSection({ copy }) {
  const { i18n } = useTranslation();
  const ref = useRef(null);
  const vi = i18n.language.startsWith("vi");
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (end) => gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end, scrub: true, pin: true, anticipatePin: 1 } })
      .to(".hero-credits, .hero-sub", { autoAlpha: 0, y: -40, duration: 0.25, ease: "none" }, 0)
      .fromTo(".hero-iris", { scale: 3.2 }, { scale: 1, duration: 0.45, ease: "power1.inOut" }, 0.05)
      .to(".hero-mark", { autoAlpha: 0.4, duration: 0.45, ease: "none" }, 0.05)
      .to(".hero-actor", { scale: 1.06, transformOrigin: "57% 70%", duration: 0.45, ease: "none" }, 0.05)
      .fromTo(".hero-title", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, ease: "none" }, 0.4)
      .from(".hero-title > *", { y: 40, opacity: 0, stagger: 0.08, duration: 0.25, ease: "power2.out" }, 0.4)
      .to({}, { duration: 0.25 });
    mm.add(desktopMotion, () => { build("+=80%"); });
    mm.add(phoneMotion, () => { build("+=60%"); });
  }, { scope: ref });

  return (
    <section ref={ref} className="hero" data-depth>
      <div className="hero-light" aria-hidden="true" />
      <h1 className="hero-mark" aria-label="Hugo Wishpax — Lê Gia Huy" translate="no">
        {"HUGO".split("").map((letter, index) => (
          <span key={letter} className="hero-mark-mask" aria-hidden="true">
            <motion.span data-l={letter} initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ delay: 0.55 + index * 0.08, duration: 1.1, ease }}>
              {letter}{SLICES.map((z) => <i key={z} style={{ "--z": z }}>{letter}</i>)}
            </motion.span>
          </span>
        ))}
      </h1>
      {/* "Wishpax" in Hugo's script (Sugar Script), written on left to right, clear of him on the right. */}
      <p className="hero-sub" aria-hidden="true" translate="no">
        <motion.span initial={{ clipPath: "inset(-20% 100% -40% 0)" }} animate={{ clipPath: "inset(-20% -5% -40% 0)" }} transition={{ delay: 1.6, duration: 1.4, ease: [0.45, 0, 0.25, 1] }}>Wishpax</motion.span>
      </p>
      {/* The stone plinth the letters stand on, and Hugo sits on: seat height = a chair, so his feet reach the floor. */}
      <div className="hero-plinth" aria-hidden="true" />
      {/* He sits down onto the letters: drops in and settles with a little give. GSAP scales the wrapper, motion moves the image. */}
      {/* Five recessed uplights set into the plinth, evenly spaced, throwing white light up the letters. They switch on in turn. */}
      <div className="hero-uplights" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.i key={i} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.35, 1] }} transition={{ delay: 1.0 + i * 0.14, duration: 0.5, times: [0, 0.3, 0.55, 1] }} />
        ))}
      </div>
      {/* White uplight from the floor: washes up the plinth, the foot of the letters and him (no fixture in shot). */}
      <motion.div className="hero-wash" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }} />
      {/* He sits down onto the plinth: portrait, its shadow and its uplit copy drop in together (one moving layer, so they never split).
          GSAP scales the outer wrapper on scroll, motion moves the inner one. */}
      <div className="hero-actor">
        <motion.div className="hero-actor-body" initial={{ opacity: 0, y: -70 }} animate={{ opacity: 1, y: 0 }}
          transition={{ opacity: { delay: 1.0, duration: 0.3 }, y: { delay: 1.0, type: "spring", stiffness: 140, damping: 13 } }}>
          {/* Footlights throw his shadow up onto the letters; contact shadows where he sits and where his shoes meet the floor. */}
          <img className="hero-cast" src="/hugo-portrait.webp" alt="" aria-hidden="true" width="1001" height="1570" />
          <i className="hero-contact" aria-hidden="true" />
          <i className="hero-feet" aria-hidden="true" />
          <img className="hero-portrait" src="/hugo-portrait.webp" alt="Hugo Wishpax — Lê Gia Huy" width="1001" height="1570" fetchpriority="high" />
          <img className="hero-uplit" src="/hugo-portrait.webp" alt="" aria-hidden="true" width="1001" height="1570" />
        </motion.div>
      </div>
      <div className="hero-credits">
        <motion.p className="hero-kicker" {...credit(1.2)}>Lê Gia Huy · Hugo Wishpax</motion.p>
        <motion.p className="hero-line" {...credit(1.3)}>{vi ? <>Lập trình viên<br /><em>Full&#8209;Stack</em>, web &amp; mobile.</> : <>Full&#8209;stack<br /><em>developer</em>, web &amp; mobile.</>}</motion.p>
        <motion.div className="hero-actions" {...credit(1.4)}>
          <a href="#projects" className="hero-cta">{vi ? "Xem dự án" : "See the work"}<ArrowDown size={16} aria-hidden="true" /></a>
          <a href={cvPdf(i18n.language)} target="_blank" rel="noreferrer" className="hero-cta hero-cta--quiet">{vi ? "Xem CV" : "View CV"}<FileText size={15} aria-hidden="true" /></a>
        </motion.div>
      </div>
      <div className="hero-iris" aria-hidden="true" />
      <div className="hero-title" aria-hidden="true"><p>{copy.heroPlace}</p><p>{copy.heroStatus}</p></div>
      {/* Opening: projector line, shutter, light leak. One-shot, transform/opacity only. */}
      <div className="hero-shutter" aria-hidden="true">
        <motion.i initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ delay: 0.4, duration: 0.9, ease }} />
        <motion.i initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ delay: 0.4, duration: 0.9, ease }} />
        <motion.b initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }} transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeOut" }} />
      </div>
      <motion.div className="hero-leak" aria-hidden="true" initial={{ x: "-100%", opacity: 0 }} animate={{ x: "100%", opacity: [0, 0.9, 0] }}
        transition={{ delay: 1.5, duration: 1.6, ease: "easeInOut" }} />
    </section>
  );
}

// Signature reveal: thick strokes traced over public/hugo-signature.webp (617×405) in signing order,
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
      <image href="/hugo-signature.webp" width="617" height="405" mask="url(#signature-reveal)" />
    </svg>
  );
}

const socialLinks = [
  { name: "Facebook", icon: "facebook", href: "https://www.facebook.com/share/18jfh4AUPh/?mibextid=wwXIfr" },
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/hugowishpax?rpxt=MW9ibDdkcTNxcm5nYg%3D%3D&utm_source=qr" },
  { name: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@pethugowishpaxle?_r=1&_t=ZS-9B96A7FnRyP" },
  { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/@By_Hugo_Hi" },
  { name: "Mail", icon: "gmail", href: "mailto:hugowishpax@gmail.com" },
  { name: "GitHub", icon: "github", href: "https://github.com/Hugo-huy2004" },
];

const profileCopy = {
  vi: {
    heroStatus: "Đang tìm vị trí frontend, backend hoặc full-stack",
    heroPlace: "Sống và làm việc tại Việt Nam",
    languages: "Ngôn ngữ", languagesValue: "Tiếng Anh VSTEP B2 (6.5) · Tiếng Trung HSK 2",
    techHeading: "Kỹ năng chuyên môn", techNote: "Ngôn ngữ, framework và nền tảng tôi dùng hằng ngày.",
    education: "Học vấn", degree: "BSc (Hons) Computing · Sinh viên năm cuối",
  },
  en: {
    heroStatus: "Open to frontend, backend and full-stack roles",
    heroPlace: "Based in Vietnam",
    languages: "Languages", languagesValue: "VSTEP English B2 (6.5) · Chinese HSK 2",
    techHeading: "Technical Skills", techNote: "The languages, frameworks and platforms I use every day.",
    education: "Education", degree: "BSc (Hons) Computing · Final-year student",
  },
};

// Projects as a deck of cards: each card sticks while the next one slides over it. Number and dates, the name,
// what it is, the stack, one big screen and a strip of three more.
function ProjectCard({ project, index, t, from }) {
  const base = `projectsPage.items.${project.id}`;
  const shots = [project.cover || project.shots[0].src, ...project.shots.map(({ src }) => src)]
    .filter((name, position, all) => all.indexOf(name) === position);
  const caption = (src) => t(`${base}.shots.${src}`, project.shots.find((shot) => shot.src === src)?.caption || project.title);
  const [hero, ...rest] = shots;
  return (
    <article className="pj-card" style={{ "--i": index }}>
      <div className="pj-info">
        <span className="pj-no" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <p className="pj-period">{project.period.replace("{now}", t("projectsPage.periodNow"))}</p>
        <h3 translate="no">{project.title}</h3>
        <p className="pj-kind">{t(`projectsPage.kinds.${project.kind}`, project.kind)}</p>
        <p className="pj-tagline">{t(`${base}.tagline`, project.tagline)}</p>
        <ul className="pj-stack">{project.stack.slice(0, 5).map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <Link className="journey-cta" to={`/project/${project.id}`} state={{ from }}>
          {t("projectsPage.openProject", "Xem dự án")} <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="pj-frame">
        <figure className="pj-shot"><SmartImg src={shotUrl(project.id, hero)} alt={caption(hero)} /></figure>
        <ul className="pj-strip">{rest.slice(0, 3).map((src) => <li key={src}><SmartImg src={shotUrl(project.id, src)} alt={caption(src)} loading="lazy" /></li>)}</ul>
      </div>
    </article>
  );
}

// Greenwich honours algorithm (10:90), computed from data/grades.js so a new mark updates every number.
function greenwichGrades(vi) {
  return {
    facts: [[`${Math.round(standing().score)}%`, vi ? "Điểm trung bình tạm tính" : "Provisional average"]],
    note: vi
      ? "Điểm được quy đổi chuẩn theo quy chế xếp loại bằng của University of Greenwich (10:90)."
      : "Mark converted under the University of Greenwich degree classification rules (10:90).",
  };
}

// Education told in three chapters; Nguyễn Đình Chiểu facts and wording follow the school's own site (ndc.edu.vn › Tổng quan).
const educationChapters = (language, copy) => {
  const vi = language === "vi";
  return [
    {
      id: "greenwich", tone: "greenwich", label: vi ? "Đại học" : "University",
      visual: <GreenwichStage alt={vi ? "Lê Gia Huy nhận Certificate of Merit tại lễ tôn vinh sinh viên kỳ Summer 2026" : "Lê Gia Huy receiving a Certificate of Merit at the Summer 2026 Student Honoring Ceremony"} />,
      kicker: vi ? "Đang theo học" : "Currently studying",
      title: "University of Greenwich (Vietnam)",
      sub: copy.degree,
      body: <mark className="edu-award"><Trophy size="1.1em" aria-hidden="true" />{vi
        ? "Sinh viên xuất sắc nhất môn Thiết kế & Phát triển Ứng dụng Di động (dự án MHike), kỳ Summer 2026."
        : "Best Student in Mobile Application Design & Development (MHike project), Summer 2026."}</mark>,
      links: [{ to: "/journey", label: vi ? "Xem cả hành trình" : "See the whole journey" }],
      ...greenwichGrades(vi),
    },
    {
      id: "ndc", tone: "ndc", label: vi ? "Trung học" : "High school",
      visual: <figure className="edu-photo">
        <img src="/education/ndc-12d2.webp" alt={vi ? "Ảnh tập thể lớp 12D2 tại Trường THPT Nguyễn Đình Chiểu, có Lê Gia Huy" : "Class photo of 12D2 at Nguyễn Đình Chiểu High School, including Lê Gia Huy"} width="1600" height="1068" />
        <img className="edu-photo-logo" src="/education/nguyen-dinh-chieu.webp" alt="" />
        <figcaption>{vi ? "Ảnh kỷ yếu lớp 12D2 · " : "Class 12D2 yearbook photo · "}<a href="https://ndc.edu.vn/wp-content/uploads/2026/01/31.-12D2.jpg" target="_blank" rel="noreferrer">{vi ? "nguồn: THPT Nguyễn Đình Chiểu" : "Source: Nguyễn Đình Chiểu High School"}</a></figcaption>
      </figure>,
      kicker: vi ? "Tốt nghiệp THPT" : "High School Diploma",
      title: vi ? "THPT Nguyễn Đình Chiểu" : "Nguyễn Đình Chiểu High School",
      sub: "Collège de Mytho · Mỹ Tho, Tiền Giang",
      body: vi
        ? "Thành lập ngày 17/03/1879 với tên Collège de Mytho, đổi tên Collège Le Myre de Vilers năm 1942 và mang tên nhà thơ Nguyễn Đình Chiểu từ năm 1953: một trong những ngôi trường trung học phổ thông lâu đời nhất Việt Nam. Ba năm ở đây, tôi lớn lên cùng truyền thống “Dạy giỏi – Học giỏi” và tiêu chí “Thanh lịch – Thân thiện – Năng động – Tự tin”."
        : "Founded on 17 March 1879 as the Collège de Mytho, renamed Collège Le Myre de Vilers in 1942, and named after the poet Nguyễn Đình Chiểu since 1953: one of the oldest high schools in Vietnam. My three years there were shaped by its tradition of “teaching well, learning well” and its ideal of students who are graceful, friendly, active and confident.",
      facts: [["1879", vi ? "Năm thành lập" : "Founded"], ["2019 – 2022", vi ? "Niên khoá" : "Class years"]],
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
        { href: "https://chanhtoa.tnttgiaophanmytho.online/gioi-thieu/xu-doan?bio=bdh-le-gia-huy", label: vi ? "Hồ sơ Huynh trưởng tại Xứ đoàn" : "Leader profile at the chapter" },
      ],
    },
  ];
};

function Education({ language, copy, from }) {
  const chapters = educationChapters(language, copy);
  return (
    <section id="education" className="edu" aria-label={copy.education} data-depth>
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
            {chapter.note && <p className="edu-note">{chapter.note}</p>}
            {chapter.links && <div className="edu-links">{chapter.links.map((link, index) => link.href
              ? <a key={link.href} className={`edu-link${index ? " edu-link--quiet" : ""}`} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={18} /></a>
              : <Link key={link.to} className={`edu-link${index ? " edu-link--quiet" : ""}`} to={link.to} state={{ from }}>{link.label} <ArrowUpRight size={18} /></Link>)}</div>}
          </div>
        </article>)}
      </div>
    </section>
  );
}

// Closing scene: the film ends on the same cobalt as the hero. An iris opens on it while you scroll in,
// the line is handed to the visitor, and each channel is one tile to tap.
// His full name in his script (Sugar Script, public/fonts), written on left to right once the scene is in view.
function OutroName() {
  // The wrapper is what the viewport observer sees (an element hidden by its own clip-path never counts as in view).
  return (
    <motion.span className="outro-name-wrap" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
      <motion.span translate="no" className="outro-name" variants={{ hidden: { clipPath: "inset(-30% 100% -40% 0)" }, show: { clipPath: "inset(-30% -5% -40% 0)" } }}
        transition={{ duration: 1.8, ease: [0.45, 0, 0.25, 1] }}><span className="outro-name-x">Petrus </span>Hugo Wishpax<span className="outro-name-x"> Lê</span></motion.span>
    </motion.span>
  );
}

function Contact({ language, copy }) {
  const vi = language === "vi";
  const mail = socialLinks.find((social) => social.icon === "gmail");
  return (
    <section id="contact" className="outro" data-depth>
      <div className="outro-iris">
        {/* The set: an event backdrop (step-and-repeat) lit by two spots, on a dark glossy stage floor. */}
        <div className="outro-wall" aria-hidden="true" />
        <div className="outro-runway" aria-hidden="true" />
        {/* The last shot: Hugo in his scarf, and the film signed off on it (strokes drawn by the scene script). */}
        <figure className="creator-about-photo">
          <svg width="0" height="0" aria-hidden="true" focusable="false">
            {/* Duotone in the page palette: shadows → night cobalt, highlights → gold */}
            <filter id="about-duotone" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues="0.06 1" />
                <feFuncG type="table" tableValues="0.1 0.749" />
                <feFuncB type="table" tableValues="0.42 0.031" />
              </feComponentTransfer>
            </filter>
          </svg>
          <motion.img src="/hugo-about.webp" alt={vi ? "Hugo Wishpax quàng khăn len, nhìn sang bên" : "Hugo Wishpax in a knitted scarf, looking to the side"} loading="lazy"
            initial={{ opacity: 0, scale: 1.18, rotate: -12 }} whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} />
          <Signature />
        </figure>
        <div className="outro-copy">
          <h2 className="outro-title">
            <span>{vi ? "Kết nối cùng" : "Connect with"}</span>
            <OutroName />
          </h2>
          <p className="outro-line">{vi ? "Muốn hỏi thêm về tôi, hay chỉ ghé chào một câu, cứ nhắn cho tôi." : "Want to know more about me, or just say hi? Write to me."}</p>
          <p className="outro-langs"><span>{copy.languages}</span>{vi ? "Tiếng Việt · " : "Vietnamese · "}{copy.languagesValue}</p>
          <a className="outro-mail" href={mail.href}>hugowishpax@gmail.com <ArrowUpRight size={22} /></a>
          <ul className="outro-channels">
            {socialLinks.filter((social) => social !== mail).map((social) => <li key={social.name}>
              <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.name} title={social.name}>
                <img src={`/social-logos/${social.icon}.svg`} alt="" />
              </a>
            </li>)}
          </ul>
          <p className="outro-credits">{vi ? "Hết phim · Cảm ơn bạn đã xem" : "The end · Thanks for watching"}</p>
        </div>
      </div>
    </section>
  );
}

// The page is cut like a film: five scenes, letterbox bars close and reopen on every cut,
// a HUD in the corner reads the scene and a timecode off the scroll position.
const scenes = [
  [".hero", "Mở màn", "Opening"], [".journey", "Dự án", "Projects"], [".creator-skills", "Kỹ năng", "Skills"],
  [".edu", "Học vấn", "Education"], [".outro", "Lời kết", "Credits"],
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
    if (current !== sceneRef.current) sound.scene(current > sceneRef.current, current === scenes.length - 1);
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
  useHeadMeta("/");
  const root = useRef(null);
  useEffect(() => startDepth(), []); // pointer parallax + 3D tilt on the [data-depth] sections (CSS at the end of introduction.css)
  // Looping CSS animations (coin, glints, sparkles) keep the GPU busy even off-screen; pause them there.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.toggleAttribute("data-off", !e.isIntersecting)));
    root.current?.querySelectorAll(".edu-panel, .vx").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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

      // ── Scene 2 · Projects (right after the opening: the work leads): a deck of sticky cards.
      cut(".journey", true);
      // Each card drifts back (smaller, darker) as the next one slides over it; its screen settles from a zoom as it arrives.
      const cards = gsap.utils.toArray(".pj-card");
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        if (next) gsap.fromTo(card, { scale: 1, filter: "brightness(1)" }, { scale: 0.9, filter: "brightness(0.4)", ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true } });
        gsap.from(card.querySelector(".pj-shot img"), { scale: 1.3, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 20%", scrub: true } });
        // The CTA stays out: its CSS transform transition fights a scrubbed y and left it parked 50px low.
        scrubIn(card.querySelectorAll(".pj-info > :not(.journey-cta)"), { y: 50, autoAlpha: 0, stagger: 0.05 }, card, "top 90%", "top 40%");
        scrubIn(card.querySelectorAll(".pj-strip li"), { y: 60, autoAlpha: 0, stagger: 0.08 }, card, "top 70%", "top 30%");
      });

      // ── Scene 3 · Skills: pinned colour vortex, one skill group per arm (components/public/SkillVortex.jsx).
      cut(".creator-skills", true);
      playSkillVortex(root.current.querySelector(".vx"));

      // ── Scene 4 · Education: desktop stacks the chapters on a pinned stage; phones stack them as sticky cards (chapters can be taller than a phone screen).
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
            // marginBottom = a read pause: the card stays stuck, fully visible, for that much scroll before the next one rises.
            gsap.set(panel, { position: "sticky", top: () => Math.min(0, window.innerHeight - panel.offsetHeight), marginBottom: "35vh" });
            gsap.fromTo(panel, { scale: 1, "--dim": 0 }, { scale: 0.9, "--dim": 0.65, ease: "none", transformOrigin: "50% 0", // dim via overlay: fading the card would show the one beneath
              scrollTrigger: { trigger: panels[index + 1], start: "top bottom", end: "top top", scrub: true } });
          }
          if (index) gsap.fromTo(panel, { clipPath: "inset(8% 6% 0% 6% round 2rem)" }, { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "top 30%", scrub: 0.5 } });
          scrubIn(panel.querySelector(".edu-visual"), { scale: 0.5, rotate: -16, autoAlpha: 0 }, panel, "top 80%", "top 25%");
          scrubIn(panel.querySelectorAll(".edu-copy > *"), { y: 60, autoAlpha: 0, stagger: 0.1 }, panel.querySelector(".edu-copy"), "top 95%", "top 60%");
        });
        gsap.to(".scout-reveal", { strokeDashoffset: 0, stagger: 0.2, ease: "power1.inOut", scrollTrigger: { trigger: ".scout-bust", start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
      }

      // ── Scene 5 · Credits: an iris opens on the night frame; the photo comes in and Hugo signs off the film on it.
      cut(".outro");
      const strokes = gsap.utils.toArray(".sig-stroke");
      gsap.set(strokes, { strokeDasharray: "1 1", strokeDashoffset: 1, opacity: 0 }); // opacity hides each round-cap dot until its stroke starts
      // Played, not scrubbed: the credits are the last screen, so the scroll can never reach a late end point and the name would stop half-signed.
      const signing = gsap.timeline({ delay: 0.6, scrollTrigger: { trigger: ".outro .creator-about-photo", start: "top 70%", toggleActions: "play none none none" } });
      strokes.forEach((stroke) => {
        signing.set(stroke, { opacity: 1 }).to(stroke, { strokeDashoffset: 0, ease: "power1.inOut", duration: Number(stroke.dataset.duration) }).to({}, { duration: 0.06 });
      });
      gsap.fromTo(".outro-iris", { clipPath: "circle(12% at 50% 55%)" }, { clipPath: "circle(150% at 50% 55%)", ease: "none",
        scrollTrigger: { trigger: ".outro", start: "top 90%", end: "top 10%", scrub: 0.6 } });
      // Content plays as one beat once the iris is mostly open (not scrubbed: half-way states stacked the mail over the tiles).
      gsap.timeline({ scrollTrigger: { trigger: ".outro", start: "top 35%", toggleActions: "play none none reverse" } })
        .from(".outro-title > span:first-child, .outro-line, .outro-langs, .outro-mail", { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.7, ease: "power3.out" })
        .from(".outro-channels li", { y: 40, scale: 0.8, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: "back.out(1.6)" }, "-=0.35")
        .from(".outro-credits", { autoAlpha: 0, duration: 0.6 }, "-=0.2");

      // Resizing across 820px swaps scripts: hand the reels back to native scrolling.
      return () => {
        gsap.set(".edu-panel", { clearProps: "all" });
      };
    });
  }, { scope: root });
  return (
    <div ref={root} className="creator-home">
      <FilmHud language={language} />
      <HeroSection copy={copy} />

      <section id="projects" className="journey" data-depth>
        <header className="journey-intro"><motion.p className="creator-kicker" {...reveal}>{t("intro.story.work.label")}</motion.p><RiseHeading>{t("intro.story.work.heading")}</RiseHeading><motion.p {...reveal}>{language === "vi" ? "Mỗi dự án là một chặng: tôi đã nghĩ gì và làm gì." : "Each project is a stop: what I thought, and what I built."}</motion.p></header>
        <div className="pj-deck">
          {featured.map((project, index) => <ProjectCard key={project.id} project={project} index={index} t={t} from={`${location.pathname}${location.search}${location.hash}`} />)}
        </div>
        <div className="journey-end">
          <p>{language === "vi" ? "Và còn nữa." : "And there is more."}</p>
          <Link className="journey-cta" to="/project" state={{ from: location.pathname }}>{t("intro.story.work.viewAll")} <ArrowUpRight size={18} /></Link>
        </div>
      </section>
      <section id="skills" className="creator-skills">
        <SkillVortex language={language} heading={<RiseHeading>{copy.techHeading}</RiseHeading>} />
      </section>

      <Education language={language} copy={copy} from={`${location.pathname}${location.search}${location.hash}`} />

      <Contact language={language} copy={copy} />
    </div>
  );
}
