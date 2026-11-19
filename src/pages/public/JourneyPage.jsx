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
 * /journey — a photo journal. Each stop picks its own layout (frame, tall, split, mosaic, scatter; "-flip" mirrors it),
 * and the page backdrop becomes a blurred, grainy version of the stop you are looking at.
 * Photos ship in three sizes (scripts/journey-photo.sh): 800w and up-to-1600w via srcset, and a 32px one for the backdrop.
 * Adding a stop = one entry in data/journey.js.
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
// A video-only stop borrows YouTube's 120px thumbnail; it gets blurred just the same.
const backdrop = (stop) => stop.photos?.[0] ? `${base(stop.photos[0].src)}-bg.webp` : stop.youtube && `https://i.ytimg.com/vi/${stop.youtube}/default.jpg`;

// "2019" → year, "2026-09" → month and year, "2026-09-17" → full date, in the page language.
function formatDate(date, lang) {
  const [y, m, d] = date.split("-").map(Number);
  if (!m) return String(y);
  const options = d ? { day: "numeric", month: "long", year: "numeric" } : { month: "long", year: "numeric" };
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-GB", options).format(new Date(Date.UTC(y, m - 1, d || 1)));
}

// No layout given: three or more photos make a mosaic, a portrait lead stands tall, anything else is a frame.
function layoutOf(stop) {
  const [name = "", flip] = (stop.layout || "").split("-");
  if (name) return { name, flip: flip === "flip" };
  const photos = stop.photos || [];
  return { name: photos.length >= 3 ? "mosaic" : photos[0]?.tall ? "tall" : "frame", flip: false };
}

// youtube-nocookie: no tracking cookies until the visitor presses play.
function Video({ stop, lang }) {
  return (
    <div className="jr-video">
      <iframe src={`https://www.youtube-nocookie.com/embed/${stop.youtube}?rel=0`} title={stop.title[lang]} loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    </div>
  );
}

function Meta({ stop, lang }) {
  return (
    <>
      <p className="jr-meta"><span>{KINDS[stop.kind][lang]}</span>{stop.date && <time dateTime={stop.date}>{formatDate(stop.date, lang)}{stop.until && ` – ${formatDate(stop.until, lang)}`}</time>}</p>
      <h2>{stop.title[lang]}</h2>
      {stop.place && <p className="jr-place"><MapPin size={16} aria-hidden="true" /> {stop.place[lang]}</p>}
    </>
  );
}

const reveal = (delay = 0) => ({ initial: { opacity: 0, y: 36 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { delay, duration: 0.8, ease } });

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

  // Newest first. A stop without a date borrows the date of the stop above it in data/journey.js, only for sorting.
  let carry = "9999";
  const ordered = journey.map((stop) => ({ stop, key: (carry = stop.date || carry) }))
    .sort((a, b) => b.key.localeCompare(a.key)).map(({ stop }) => stop);
  const [active, setActive] = useState(ordered[0]?.id);
  let lastYear = null;

  // One clickable photo. `sizes` tells the browser how wide it will be drawn, so it fetches 800w or 1600w.
  const shot = (photo, { className = "", sizes, eager } = {}) => (
    <button type="button" className={`jr-shot-btn ${className}`} onClick={() => open(photo)} aria-label={vi ? `Xem ảnh lớn: ${photo.alt.vi}` : `View larger: ${photo.alt.en}`}>
      <SmartImg src={photo.src} srcSet={srcSet(photo.src)} sizes={sizes} alt={photo.alt[lang]} loading={eager ? "eager" : "lazy"}
        style={photo.focus ? { objectPosition: photo.focus } : undefined} />
    </button>
  );

  const copy = (stop, className = "") => (
    <motion.div className={`jr-copy ${className}`} {...reveal(0.1)}>
      <Meta stop={stop} lang={lang} />
      <p className="jr-body">{stop.body[lang]}</p>
    </motion.div>
  );

  function render(stop, index) {
    const photos = stop.photos || [];
    const [main, ...rest] = photos;
    const { name, flip } = layoutOf(stop);
    const flipClass = flip ? " is-flip" : "";
    const eager = index === 0;

    if (!main) return stop.youtube ? (
      <motion.article className="jr-reel" {...reveal()}>
        <Video stop={stop} lang={lang} />
        {copy(stop, "jr-reel-copy")}
      </motion.article>
    ) : (
      <motion.article className="jr-postcard" initial={{ opacity: 0, y: 30, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 1.5 : -1.5 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease }}>
        {stop.logo && <img className="jr-stamp" src={stop.logo} alt="" loading="lazy" />}
        <div><Meta stop={stop} lang={lang} /><p className="jr-body">{stop.body[lang]}</p></div>
      </motion.article>
    );

    const video = stop.youtube && <Video stop={stop} lang={lang} />;

    // Split: magazine spread — the story in one column, the photo in the other, extra photos pinned on its corners.
    if (name === "split") return (
      <article className={`jr-split${flipClass}`}>
        {copy(stop, "jr-split-copy")}
        <motion.div className="jr-split-visual" initial={{ opacity: 0, x: flip ? -60 : 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease }}>
          {shot(main, { className: `jr-split-main${main.tall ? " is-tall" : ""}`, sizes: "(max-width: 820px) 100vw, 720px", eager })}
          {rest.slice(0, 2).map((photo, i) => <span key={photo.src} className={`jr-pin jr-pin--${i + 1}`}>{shot(photo, { className: "jr-polaroid", sizes: "260px" })}</span>)}
        </motion.div>
        {video}
      </article>
    );

    // Mosaic: a headline row, then a grid where the lead photo takes a 2×2 block and the rest fill around it.
    if (name === "mosaic") {
      const shape = (i) => rest.length === 1 ? "is-big" : rest.length === 2 ? "is-tall" : rest.length === 3 && i === 2 ? "is-wide" : rest.length === 5 && i === 4 ? "is-full" : "";
      return (
        <article className={`jr-mosaic${flipClass}`}>
          {copy(stop, "jr-mosaic-copy")}
          <div className="jr-grid">
            <motion.div className="jr-tile jr-tile--lead" {...reveal()}>{shot(main, { sizes: "(max-width: 820px) 100vw, 680px", eager })}</motion.div>
            {rest.map((photo, i) => (
              <motion.div key={photo.src} className={`jr-tile ${shape(i)}`} {...reveal(0.08 * (i + 1))}>
                {shot(photo, { sizes: shape(i) === "is-full" ? "(max-width: 820px) 100vw, 1360px" : "(max-width: 820px) 50vw, 340px" })}
              </motion.div>
            ))}
          </div>
          {video}
        </article>
      );
    }

    // Scatter: the story centred, every photo dropped as a polaroid on the table.
    if (name === "scatter") {
      const tilt = [-7, 5, -3, 6, -5];
      const drop = [0, 46, -18, 30, 8];
      return (
        <article className="jr-scatter">
          {copy(stop, "jr-scatter-copy")}
          <ul className="jr-pile">
            {photos.map((photo, i) => (
              <motion.li key={photo.src} style={{ "--drop": `${drop[i % 5]}px`, zIndex: i === 0 ? 2 : 1 }}
                initial={{ opacity: 0, y: -60, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: tilt[i % 5] }}
                viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.12 * i, type: "spring", stiffness: 120, damping: 14 }}>
                {shot(photo, { className: `jr-polaroid${i === 0 ? " is-lead" : ""}`, sizes: "(max-width: 820px) 60vw, 340px", eager: eager && i === 0 })}
              </motion.li>
            ))}
          </ul>
          {video}
        </article>
      );
    }

    // Frame (and tall): the photo is the page, the caption sits on it, polaroids underneath.
    const tall = name === "tall";
    return (
      <article className={`jr-frame${tall ? " jr-frame--tall" : ""}${flipClass}`}>
        <div className="jr-shot">
          <motion.div className="jr-hero" initial={{ scale: 1.08, opacity: 0.4 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1.4, ease }}>
            {shot(main, { sizes: tall ? "(max-width: 820px) 100vw, 520px" : "(max-width: 820px) 100vw, 1360px", eager })}
          </motion.div>
          <motion.div className="jr-caption" {...reveal(0.2)}><Meta stop={stop} lang={lang} /></motion.div>
        </div>
        <div className="jr-under">
          <p className="jr-body">{stop.body[lang]}</p>
          {rest.length > 0 && <ul className="jr-strip">
            {rest.map((photo, i) => (
              <motion.li key={photo.src} initial={{ opacity: 0, y: 40, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 4 : -4 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: 0.1 * i, duration: 0.8, ease }}>
                {shot(photo, { className: "jr-polaroid", sizes: "220px" })}
              </motion.li>
            ))}
          </ul>}
        </div>
        {video}
      </article>
    );
  }

  return (
    <div className="creator-home pd jr">
      {/* The backdrop: every stop's 32px photo, blown up and blurred; only the one in view is lit. */}
      <div className="jr-backdrop" aria-hidden="true">
        {ordered.map((stop) => backdrop(stop) && <i key={stop.id} className={stop.id === active ? "is-on" : undefined} style={{ backgroundImage: `url(${backdrop(stop)})` }} />)}
      </div>

      <header className="jr-head">
        <Link to={backTo} className="pd-back"><ArrowLeft size={16} /> {vi ? "Quay lại" : "Back"}</Link>
        <h1 className="jr-title">
          <motion.span initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ delay: 0.1, duration: 1, ease }}>
            {vi ? "Hành trình" : "The journey"}
          </motion.span>
        </h1>
        <motion.p className="jr-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7, ease }}>
          {vi
            ? "Những bước ngoặt trên con đường học vấn, và những nơi tôi đã đặt chân đến."
            : "The turning points in my education, and the places I have set foot in."}
        </motion.p>
      </header>

      <ol className="jr-feed">
        {ordered.map((stop, index) => {
          const year = stop.date?.slice(0, 4);
          const newYear = year && year !== lastYear;
          if (year) lastYear = year;
          return (
            <motion.li key={stop.id} className={`jr-stop jr-stop--${stop.kind}`} onViewportEnter={() => backdrop(stop) && setActive(stop.id)} viewport={{ amount: 0.35 }}>
              {newYear && <motion.p className="jr-year" aria-hidden="true" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, ease }}>{year}</motion.p>}
              {render(stop, index)}
            </motion.li>
          );
        })}
      </ol>
      <p className="jr-end">{vi ? "Chặng tiếp theo đang chờ." : "The next stop is waiting."}</p>

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
