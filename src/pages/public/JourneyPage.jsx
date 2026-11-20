import { useRef, useState } from "react";
import { ArrowLeft, MapPin, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { journey } from "../../data/journey";
import { useHeadMeta } from "../../hooks/useHeadMeta";
import { SmartImg } from "../../components/public/Resilience";
import "./introduction.css";
import "./projectDetail.css";
import "./journey.css";

/**
 * /journey — memories, laid out like a school wall newspaper (báo tường): a cream sheet pinned to the night wall,
 * a masthead, the newest memory as the front-page story, the rest as short clippings flowing in columns.
 * Photos are taped on; extra photos are small polaroids. Any photo opens large. Adding a memory = one entry in data/journey.js.
 */

const ease = [0.16, 1, 0.3, 1];
const KINDS = {
  education: { vi: "Học vấn", en: "Education" },
  travel: { vi: "Khám phá", en: "Travel" },
  community: { vi: "Cộng đồng", en: "Community" },
  milestone: { vi: "Cột mốc", en: "Milestone" },
  culture: { vi: "Văn hoá", en: "Culture" },
};

const base = (src) => src.replace(/\.webp$/, "");
// ponytail: the big file is labelled 1600w even when the original was narrower; only affects which file is picked.
const srcSet = (src) => `${base(src)}-800.webp 800w, ${src} 1600w`;

// "2019" → year, "2026-09" → month and year, "2026-09-17" → full date, in the page language.
function formatDate(date, lang) {
  const [y, m, d] = date.split("-").map(Number);
  if (!m) return String(y);
  const options = d ? { day: "numeric", month: "long", year: "numeric" } : { month: "long", year: "numeric" };
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", options).format(new Date(Date.UTC(y, m - 1, d || 1)));
}

// Each clipping settles onto the sheet with a slight, fixed tilt, as if pasted by hand.
const tilt = [-0.8, 0.6, -0.4, 0.9, -0.6, 0.3];

function Photo({ item, open, lang, className = "", sizes, eager }) {
  return (
    <button type="button" className={`bt-photo ${className}`} onClick={() => open(item)} aria-label={lang === "vi" ? `Xem ảnh lớn: ${item.alt.vi}` : `View larger: ${item.alt.en}`}>
      <SmartImg src={item.src} srcSet={srcSet(item.src)} sizes={sizes} alt={item.alt[lang]} loading={eager ? "eager" : "lazy"}
        style={item.focus ? { objectPosition: item.focus } : undefined} />
    </button>
  );
}

// One clipping: kicker (section · date), headline, place, the taped lead photo, its paragraph, polaroids, a video if any.
function Clipping({ stop, index, front, open, lang }) {
  const [main, ...rest] = stop.photos || [];
  return (
    <motion.article className={`bt-clip bt-clip--${stop.kind}${front ? " bt-front" : ""}`}
      initial={{ opacity: 0, y: 40, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: front ? 0 : tilt[index % tilt.length] }}
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, ease }}>
      <p className="bt-kicker"><span>{KINDS[stop.kind][lang]}</span>{stop.date && <time dateTime={stop.date}>{formatDate(stop.date, lang)}{stop.until && ` – ${formatDate(stop.until, lang)}`}</time>}</p>
      <h2>{stop.title[lang]}</h2>
      {stop.place && <p className="bt-place"><MapPin size={14} aria-hidden="true" /> {stop.place[lang]}</p>}
      {main && <div className="bt-lead"><Photo item={main} open={open} lang={lang} className={main.tall ? "is-tall" : ""} eager={front}
        sizes={front ? "(max-width: 820px) 100vw, 760px" : "(max-width: 820px) 100vw, 400px"} /></div>}
      {!main && stop.logo && <img className="bt-stamp" src={stop.logo} alt="" loading="lazy" />}
      <p className="bt-body">{stop.body[lang]}</p>
      {rest.length > 0 && <ul className="bt-polaroids">
        {rest.map((item) => <li key={item.src}><Photo item={item} open={open} lang={lang} sizes="160px" /></li>)}
      </ul>}
      {stop.youtube && <div className="bt-video">
        <iframe src={`https://www.youtube-nocookie.com/embed/${stop.youtube}?rel=0`} title={stop.title[lang]} loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      </div>}
    </motion.article>
  );
}

export default function JourneyPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";
  const vi = lang === "vi";
  const location = useLocation();
  const returnTo = location.state?.from;
  const backTo = typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
  const dialog = useRef(null);
  const [viewing, setViewing] = useState(null);
  const open = (photo) => { setViewing(photo); dialog.current?.showModal(); };

  useHeadMeta("/journey");

  // Newest first. A memory without a date borrows the date of the one above it in data/journey.js, only for sorting.
  let carry = "9999";
  const [lead, ...clippings] = journey.map((stop) => ({ stop, key: (carry = stop.date || carry) }))
    .sort((a, b) => b.key.localeCompare(a.key)).map(({ stop }) => stop);

  return (
    <div className="creator-home pd bt">
      <header className="bt-top">
        <Link to={backTo} className="pd-back"><ArrowLeft size={16} /> {vi ? "Quay lại" : "Back"}</Link>
      </header>

      {/* The sheet: a wall newspaper pinned up with four pieces of tape. */}
      <motion.div className="bt-sheet" initial={{ opacity: 0, y: 60, rotate: -1.2 }} animate={{ opacity: 1, y: 0, rotate: -0.3 }} transition={{ duration: 1.1, ease }}>
        <header className="bt-masthead">
          <p className="bt-issue"><span>{vi ? "Báo tường" : "Wall paper"}</span><span>{vi ? `${journey.length} kỷ niệm` : `${journey.length} memories`}</span><span>Mỹ Tho · Việt Nam</span></p>
          <h1>{vi ? "Hành trình" : "The Journey"}</h1>
          <p className="bt-tagline">{vi ? "Những nơi tôi đã đến, những ngày tôi muốn giữ lại." : "The places I have been, and the days I want to keep."}</p>
        </header>

        <Clipping stop={lead} index={0} front open={open} lang={lang} />
        <div className="bt-columns">
          {clippings.map((stop, index) => <Clipping key={stop.id} stop={stop} index={index + 1} open={open} lang={lang} />)}
        </div>
        <p className="bt-end">{vi ? "Còn tiếp ở số sau…" : "To be continued in the next issue…"}</p>
      </motion.div>

      <dialog ref={dialog} className="jr-lightbox" onClose={() => setViewing(null)} onClick={(e) => e.target === e.currentTarget && dialog.current.close()}>
        {viewing && <figure>
          <img src={viewing.src} alt={viewing.alt[lang]} />
          <figcaption>{viewing.alt[lang]}</figcaption>
        </figure>}
        <button type="button" className="jr-close" onClick={() => dialog.current.close()} aria-label={vi ? "Đóng" : "Close"}><X size={22} /></button>
      </dialog>
    </div>
  );
}
