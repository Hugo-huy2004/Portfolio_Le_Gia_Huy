import { useRef } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useSpring } from "motion/react";
import { projects, shotUrl } from "../../data/projects";
import { useHeadMeta } from "../../hooks/useHeadMeta";
import { SmartImg } from "../../components/public/Resilience";
import "./introduction.css";
import "./projectDetail.css";
import "./projectsList.css";

/**
 * /project — the whole journey, oldest stop first, on one road that draws itself as you scroll.
 * Year markers sit between stops. No "n projects" count anywhere: it would be wrong the day one is added.
 * Adding a project = one entry in data/projects.js with the right `startedAt`.
 */

const ease = [0.16, 1, 0.3, 1];
const pad = (n) => String(n).padStart(2, "0");

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const vi = i18n.language.startsWith("vi");
  const location = useLocation();
  const currentPath = `${location.pathname}${location.search}${location.hash}`;
  const returnTo = location.state?.from;
  const backTo = typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
  const road = useRef(null);
  const { scrollYProgress } = useScroll({ target: road, offset: ["start 70%", "end 70%"] });
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useHeadMeta("/project");

  const ordered = [...projects].sort((a, b) => String(a.startedAt).localeCompare(String(b.startedAt)));
  let lastYear = null;

  return (
    <div className="creator-home pd pl">
      <header className="pl-head">
        <Link to={backTo} className="pd-back"><ArrowLeft size={16} /> {t("projectsPage.backToSource")}</Link>
        <motion.p className="pd-stop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <span>{t("projectsPage.kicker")}</span>
        </motion.p>
        <h1 className="pl-title">
          <motion.span initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ delay: 0.1, duration: 1, ease }}>
            {vi ? "Hành trình" : "The journey"}
          </motion.span>
        </h1>
        <motion.p className="pl-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7, ease }}>
          {t("projectsPage.lede")}
        </motion.p>
      </header>

      <ol ref={road} className="pl-road">
        <motion.span className="pl-line" style={{ scaleY: drawn }} aria-hidden="true" />
        {ordered.map((project, index) => {
          const year = String(project.startedAt).slice(0, 4);
          const newYear = year !== lastYear;
          lastYear = year;
          const period = project.period.replace("{now}", t("projectsPage.periodNow"));
          const cover = project.cover || project.shots[0].src;
          const second = project.shots.find((shot) => shot.src !== cover)?.src;
          const flip = index % 2 === 1;
          return (
            <li key={project.id} className={`pl-stop${flip ? " is-flipped" : ""}`}>
              {newYear && <motion.p className="pl-year" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, ease }}>{year}</motion.p>}
              <span className="pl-node" aria-hidden="true" />
              <Link to={`/project/${project.id}`} state={{ from: currentPath }} className="pl-card">
                <motion.div className="pl-visual" initial={{ opacity: 0, x: flip ? 80 : -80, rotate: flip ? 4 : -4 }} whileInView={{ opacity: 1, x: 0, rotate: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease }}>
                  <figure className="pl-shot">
                    <span className="pd-browser" aria-hidden="true"><i /><i /><i /><b>{project.urlLabel || project.title}</b></span>
                    <SmartImg src={shotUrl(project.id, cover)} />
                  </figure>
                  {second && (
                    <figure className="pl-polaroid">
                      <SmartImg src={shotUrl(project.id, second)} />
                    </figure>
                  )}
                </motion.div>
                <motion.div className="pl-copy" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: 0.1, duration: 0.8, ease }}>
                  <p className="pd-stop"><span>{vi ? "Chặng" : "Stop"} {pad(index + 1)}</span>{period}</p>
                  <h2 translate="no">{project.title}</h2>
                  <p className="pl-kind">{t(`projectsPage.kinds.${project.kind}`, project.kind)}</p>
                  <p className="pl-tagline">{t(`projectsPage.items.${project.id}.tagline`, project.tagline)}</p>
                  <span className="pl-open">{t("projectsPage.openProject", "Xem dự án")} <ArrowUpRight size={18} /></span>
                </motion.div>
              </Link>
            </li>
          );
        })}
        <li className="pl-stop pl-stop--open">
          <span className="pl-node pl-node--open" aria-hidden="true" />
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, ease }}>
            {vi ? "Hành trình vẫn tiếp tục." : "The journey keeps going."}
          </motion.p>
        </li>
      </ol>
    </div>
  );
}
