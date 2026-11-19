// Technical skills, kept to what the projects use (same list as the CV, scripts/build-cv.py); coursework-only
// languages are their own group. Read by the skills vortex and by the prerendered page copy (scripts/prerender-meta.mjs).
// One colour family, the site's cobalt and sky: deep and light panes alternate so neighbouring petals stay distinct.
export const skillGroups = [
  { color: "#283db7", title: { vi: "Ngôn ngữ", en: "Languages" }, items: ["TypeScript", "JavaScript", "Java", "SQL"], proof: ["hwj", "mhike", "chanh-toa"] },
  { color: "#08a0ef", title: { vi: "Web", en: "Web" }, items: ["React", "Next.js", "Tailwind"], proof: ["hwj", "chanh-toa", "l3go-coffee"] },
  { color: "#4a5bd0", title: { vi: "Mobile", en: "Mobile" }, items: ["Android", "React Native", "Expo"], proof: ["mhike"] },
  { color: "#5fb8f5", title: { vi: "Backend & dữ liệu", en: "Backend & data" }, items: ["Node.js", "Express.js", "MongoDB", "Firebase", "SQLite"], proof: ["hwj", "mhike", "chanh-toa"] },
  { color: "#1e2f8f", title: { vi: "Tích hợp & triển khai", en: "Integrations & delivery" }, items: ["JWT", "Google OAuth", "PayPal", "Git", "Vercel"], proof: ["hwj", "chanh-toa"] },
  { color: "#7d8cf0", title: { vi: "Đã học trong chương trình", en: "Also studied" }, items: ["PHP", "Python", "C#", "C++"], studied: true },
];

export const skillLabel = { "Express.js": "Express", Tailwind: "Tailwind CSS", Android: "Android (Java)" };
