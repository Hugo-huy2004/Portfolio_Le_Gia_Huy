/**
 * Greenwich module marks (provisional, from the student grades portal) and the honours algorithm.
 * Update a mark here and every number on the site follows. `mark: null` = not graded yet.
 *
 * University of Greenwich honours algorithm, ratified 26 April 2023 (10:90):
 *   classification mark = 10% × mean of ALL Level 5 credits + 90% × mean of the BEST 90 Level 6 credits.
 * The result is rounded to a whole number (Regulations D6.1(c)) before banding. Level 4 does not count. Bands: First ≥ 70, Upper Second 60–69, Lower Second 50–59, Third 40–49.
 */
export const modules = [
  // Level 4 — not counted towards the classification
  { code: "COMP1753", title: "Programming Foundations", level: 4, credits: 15, mark: 90 },
  { code: "COMP1821", title: "Principles of Software Engineering", level: 4, credits: 15, mark: 67 },
  { code: "COMP1589", title: "Computer Systems and Internet Technologies", level: 4, credits: 15, mark: 83 },
  { code: "COMP1752", title: "Object Oriented Programming", level: 4, credits: 15, mark: 60 },
  { code: "COMP1809", title: "Introduction to Computer Science and its Applications", level: 4, credits: 15, mark: 65 },
  { code: "COMP1843", title: "Principles of Security", level: 4, credits: 15, mark: 54 },
  { code: "COMP1845", title: "Systems Development", level: 4, credits: 15, mark: 92 },
  { code: "MATH1179", title: "Mathematics for Computer Science", level: 4, credits: 15, mark: 94 },
  // Level 5 — 10%
  { code: "COMP1770", title: "Professional Project Management", level: 5, credits: 15, mark: 66 },
  { code: "COMP1773", title: "User Interface Design", level: 5, credits: 15, mark: 60 },
  { code: "COMP1841", title: "Web Programming 1", level: 5, credits: 15, mark: 43 },
  { code: "COMP1551", title: "Application Development", level: 5, credits: 15, mark: 55 },
  { code: "COMP1807", title: "Agile Development with SCRUM", level: 5, credits: 15, mark: 74 },
  { code: "COMP1810", title: "Data and Web Analytics", level: 5, credits: 15, mark: 92 },
  { code: "COMP1842", title: "Web Programming 2", level: 5, credits: 15, mark: 60 },
  { code: "COMP1844", title: "Information Analysis and Visualisation", level: 5, credits: 15, mark: 66 },
  // Level 6 — best 90 credits, 90%
  { code: "COMP1643", title: "Information and Content Management", level: 6, credits: 15, mark: 61 },
  { code: "COMP1786", title: "Mobile Application Design and Development", level: 6, credits: 15, mark: 77 },
  { code: "COMP1649", title: "Human Computer Interaction and Design", level: 6, credits: 15, mark: null },
  { code: "COMP1787", title: "Requirements Management", level: 6, credits: 15, mark: null },
  { code: "COMP1682", title: "Final Year Project", level: 6, credits: 60, mark: null },
];

const mean = (list) => {
  const credits = list.reduce((sum, m) => sum + m.credits, 0);
  return credits ? list.reduce((sum, m) => sum + m.mark * m.credits, 0) / credits : null;
};

// Best `limit` credits, highest marks first; a module that straddles the limit counts only partly.
function best(list, limit) {
  let left = limit;
  const taken = [];
  for (const m of [...list].sort((a, b) => b.mark - a.mark)) {
    if (left <= 0) break;
    taken.push({ ...m, credits: Math.min(m.credits, left) });
    left -= m.credits;
  }
  return taken;
}

const BANDS = [
  [70, { short: "First", vi: "Loại Nhất (First)", en: "First Class" }],
  [60, { short: "2:1", vi: "Loại Hai hạng trên (2:1)", en: "Upper Second (2:1)" }],
  [50, { short: "2:2", vi: "Loại Hai hạng dưới (2:2)", en: "Lower Second (2:2)" }],
  [40, { short: "Third", vi: "Loại Ba (Third)", en: "Third Class" }],
];
const band = (score) => BANDS.find(([min]) => score >= min)?.[1] ?? null;

/** The classification so far. While Level 6 is incomplete it uses the Level 6 credits graded to date. */
export function standing(list = modules) {
  const pick = (level) => list.filter((m) => m.level === level && m.mark != null);
  const l5 = mean(pick(5));
  const l6Graded = pick(6);
  const l6 = mean(best(l6Graded, 90));
  const score = l5 == null || l6 == null ? null : 0.1 * l5 + 0.9 * l6;
  const l6Credits = l6Graded.reduce((sum, m) => sum + m.credits, 0);
  const l6Pending = list.filter((m) => m.level === 6 && m.mark == null).reduce((sum, m) => sum + m.credits, 0);
  // Mean the best 90 Level 6 credits still need for a First (null once Level 6 is complete).
  const forFirst = l5 == null || l6Pending === 0 ? null : (69.5 - 0.1 * l5) / 0.9; // 69.5 rounds up to 70
  return { l5, l6, score, band: score == null ? null : band(Math.round(score)), l6Credits, l6Pending, forFirst };
}

/** Highest single module mark, for a headline fact. */
export const topModule = () => [...modules].filter((m) => m.mark != null).sort((a, b) => b.mark - a.mark)[0];

export const round1 = (n) => (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, "");
