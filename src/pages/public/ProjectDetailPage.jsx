import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Info, Plus } from "lucide-react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { findProject, projects, shotUrl } from "../../data/projects";
import { useHeadMeta } from "../../hooks/useHeadMeta";
import TechLogo, { hasTechLogo } from "../../components/public/TechLogo";
import { SmartImg } from "../../components/public/Resilience";
import "./introduction.css";
import "./projectDetail.css";

/**
 * /project/:slug — one project told like a scene from the home page's film:
 * hero (name, one line, live link) → the hook → stack as logos → highlights you open on demand
 * → a screen viewer → the next stop. Copy comes from `projectsPage.*` with projects.js as fallback.
 */

const ease = [0.16, 1, 0.3, 1];
const rise = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.7, ease } };

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const vi = i18n.language.startsWith("vi");
  const project = findProject(slug);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);
  const returnTo = location.state?.from;
  const backTo = typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/project";

  useHeadMeta(`/project/${slug}`);

  if (!project) return <Navigate to="/project" replace />;

  const index = projects.findIndex((p) => p.id === project.id);
  const next = projects[(index + 1) % projects.length];
  const base = `projectsPage.items.${project.id}`;
  const kind = t(`projectsPage.kinds.${project.kind}`, project.kind);
  const period = project.period.replace("{now}", t("projectsPage.periodNow"));
  const role = t(`${base}.role`, project.role);
  const tagline = t(`${base}.tagline`, project.tagline);
  const summary = t(`${base}.summary`, project.summary);
  const highlights = t(`${base}.highlights`, { returnObjects: true, defaultValue: project.highlights });
  const caption = (src, fallback) => t(`${base}.shots.${src}`, fallback);
  const shots = project.shots;
  const shot = shots[active];
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="creator-home pd">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pd-hero" style={{ "--ambient": `url(${shotUrl(project.id, shots[0].src)})` }}>
        <div className="pd-hero-copy">
          <Link to={backTo} className="pd-back"><ArrowLeft size={16} /> {t("projectsPage.backToSource")}</Link>
          <motion.p className="pd-stop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <span>{vi ? "Chặng" : "Stop"} {pad(index + 1)}/{pad(projects.length)}</span>{kind}
          </motion.p>
          <h1 className="pd-title" aria-label={project.title} translate="no">
            <motion.span initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ delay: 0.1, duration: 1, ease }}>{project.title}</motion.span>
          </h1>
          <motion.p className="pd-tagline" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7, ease }}>{tagline}</motion.p>
          <motion.div className="pd-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease }}>
            {project.url && <a className="pd-cta" href={project.url} target="_blank" rel="noreferrer">{t("projectsPage.openSite", { label: project.urlLabel })} <ArrowUpRight size={18} /></a>}
            {project.repo && <a className="pd-cta pd-cta--quiet" href={project.repo} target="_blank" rel="noreferrer"><TechLogo name="GitHub" size={17} /> {vi ? "Mã nguồn" : "Source"}</a>}
          </motion.div>
        </div>
        <motion.figure className="pd-hero-shot" initial={{ opacity: 0, y: 60, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ delay: 0.2, duration: 1.1, ease }}>
          <span className="pd-browser" aria-hidden="true"><i /><i /><i /><b>{project.urlLabel || project.title}</b></span>
          <SmartImg src={shotUrl(project.id, shots[0].src)} alt={caption(shots[0].src, shots[0].caption)} loading="eager" fetchPriority="high" />
        </motion.figure>
      </section>

      {/* ── Facts: the quick read ──────────────────────────── */}
      <motion.dl className="pd-facts" {...rise}>
        <div><dt>{t("projectsPage.roleLabel")}</dt><dd>{role}</dd></div>
        <div><dt>{t("projectsPage.periodLabel")}</dt><dd>{period}</dd></div>
        {project.partner && <div><dt>{t("projectsPage.partnerLabel")}</dt><dd>{project.partner}</dd></div>}
        <div><dt>{vi ? "Công nghệ" : "Tech"}</dt><dd>{project.stack.length}</dd></div>
      </motion.dl>

      {/* ── The hook ────────────────────────────────────── */}
      <section className="pd-hook">
        <motion.blockquote {...rise}>{summary}</motion.blockquote>
        {project.note && <p className="pd-note"><Info size={18} aria-hidden /> {project.note}</p>}
      </section>

      {/* ── Stack: logos only ──────────────────────────────── */}
      <section className="pd-stack" aria-label={t("projectsPage.techTitle")}>
        <motion.ul initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
          {project.stack.map((tech) => (
            <motion.li key={tech} title={tech}
              variants={{ hidden: { opacity: 0, y: -30, scale: 0.5, rotate: -20 }, show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 420, damping: 15 } } }}>
              {hasTechLogo(tech) ? <><TechLogo name={tech} size={44} /><span className="sr-only">{tech}</span></> : <span className="pd-stack-word">{tech}</span>}
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* ── Highlights: titles first, detail on demand ──────── */}
      <section className="pd-highlights">
        <motion.h2 {...rise}>{vi ? "Vì sao nó hiệu quả" : "Why it works"}</motion.h2>
        <ol>
          {highlights.map((item, itemIndex) => {
            const isOpen = open === itemIndex;
            return (
              <motion.li key={item.title} {...rise} transition={{ ...rise.transition, delay: itemIndex * 0.06 }}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : itemIndex)}>
                  <span className="pd-hl-num">{pad(itemIndex + 1)}</span>
                  <span className="pd-hl-title">{item.title}</span>
                  <Plus className="pd-hl-icon" size={22} aria-hidden />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}>
                      {item.body}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </section>

      {/* ── Screens: one large view, polaroids to switch ───── */}
      <section className="pd-screens">
        <motion.h2 {...rise}>{vi ? "Xem tận mắt" : "See it for yourself"}</motion.h2>
        <div className="pd-viewer">
          <AnimatePresence mode="wait">
            <motion.figure key={shot.src} className="pd-viewer-main"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }} transition={{ duration: 0.45, ease }}>
              <SmartImg src={shotUrl(project.id, shot.src)} alt={caption(shot.src, shot.caption)} />
              <figcaption>{caption(shot.src, shot.caption)}</figcaption>
            </motion.figure>
          </AnimatePresence>
          {shots.length > 1 && (
            <div className="pd-thumbs" role="tablist" aria-label={vi ? "Chọn màn hình" : "Choose a screen"}>
              {shots.map((item, itemIndex) => (
                <button key={item.src} type="button" role="tab" aria-selected={itemIndex === active} onClick={() => setActive(itemIndex)}
                  className="pd-polaroid" style={{ "--tilt": `${[-4, 3, -2, 4, -3, 2][itemIndex % 6]}deg` }}>
                  <SmartImg src={shotUrl(project.id, item.src)} />
                  <span>{pad(itemIndex + 1)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Next stop ───────────────────────────────────────── */}
      <Link to={`/project/${next.id}`} state={{ from: backTo }} className="pd-next" onClick={() => { setActive(0); setOpen(null); }}>
        <span className="pd-next-label">{vi ? "Chặng tiếp theo" : "Next stop"}</span>
        <span className="pd-next-title" translate="no">{next.title}</span>
        <ArrowUpRight className="pd-next-arrow" size={48} aria-hidden />
      </Link>
    </div>
  );
}
