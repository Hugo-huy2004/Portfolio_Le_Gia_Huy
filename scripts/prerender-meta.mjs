// After `vite build`: one static HTML per public URL and language, each carrying its own title, description,
// Open Graph/Twitter card, canonical, hreflang and JSON-LD — link-preview bots read these without running JS.
// Also writes sitemap.xml (with hreflang alternates), robots.txt and llms.txt.
import fs from "node:fs";
import path from "node:path";
import { COPY, LANGS, ORIGIN, SAME_AS, routes, seoFor, urlFor } from "../src/seo/seo.js";
import { projects } from "../src/data/projects.js";
import { journey } from "../src/data/journey.js";
import { skillGroups, skillLabel } from "../src/data/skills.js";
import { headHtml } from "../src/seo/head.js";

const dist = path.resolve("dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--seo-->")) throw new Error("dist/index.html is missing the <!--seo--> marker");

const dictionaries = Object.fromEntries(LANGS.map((lang) => [lang, JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}/translation.json`, "utf8"))]));
const lookup = (lang) => (key, fallback) => {
  const value = key.split(".").reduce((node, part) => (node == null ? undefined : node[part]), dictionaries[lang]);
  return typeof value === "string" ? value : fallback;
};
const escape = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// Readable page copy inside #root, the same facts the app shows. Crawlers and AI answer engines that don't run JS
// (GPTBot, ClaudeBot, PerplexityBot…) read this; the app replaces it on mount (createRoot clears the container).
const MAIL = seoFor("/", "en").jsonLd["@graph"][0].email; // the public address already in the Person schema
const link = (href, text) => `<a href="${escape(href)}">${escape(text)}</a>`;
const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
const projectText = (project, t) => {
  const key = `projectsPage.items.${project.id}`;
  return { tagline: t(`${key}.tagline`, project.tagline), summary: t(`${key}.summary`, project.summary) };
};
function staticBody(route, lang) {
  const t = lookup(lang);
  const copy = COPY[lang];
  const at = (where) => urlFor(where, lang);
  const projectItems = projects.map((project) => `${link(at(`/project/${project.id}`), project.title)}: ${escape(projectText(project, t).tagline)}`);
  if (route === "/") {
    return `<h1>Lê Gia Huy (Hugo Wishpax)</h1><p>${escape(copy.bio)}</p><p>${escape(copy.award)}</p>
<h2>${copy.education}</h2>${list([escape(copy.greenwich), escape(copy.ndc), escape(copy.community)])}
<h2>${copy.skills}</h2>${list(skillGroups.map((group) => `${escape(group.title[lang])}: ${escape(group.items.map((name) => skillLabel[name] || name).join(", "))}`))}
<h2>${copy.projects}</h2>${list(projectItems)}
<h2>${copy.contact}</h2>${list([link(MAIL, MAIL.replace("mailto:", "")), ...SAME_AS.map((href) => link(href, href.replace(/^https:\/\/(www\.)?/, "")))])}
<p>${link(at("/journey"), copy.journey)} · ${link(at("/project"), copy.projects)} · ${link(`${ORIGIN}/CV_Le_Gia_Huy.pdf`, "CV Web (PDF)")} · ${link(`${ORIGIN}/CV_Le_Gia_Huy_Mobile.pdf`, "CV Mobile (PDF)")}</p>`;
  }
  if (route === "/project") return `<h1>${escape(copy.listTitle)}</h1><p>${escape(copy.listDescription)}</p>${list(projectItems)}`;
  if (route === "/journey") {
    return `<h1>${escape(copy.journeyTitle)}</h1><p>${escape(copy.journeyDescription)}</p>${list(journey.map((stop) =>
      `<strong>${escape(stop.title[lang])}</strong>${stop.date ? ` (${escape(stop.date.slice(0, 4))})` : ""}${stop.place ? ` · ${escape(stop.place[lang])}` : ""}${stop.body ? `. ${escape(stop.body[lang])}` : ""}`))}`;
  }
  const project = projects.find((item) => item.id === route.split("/")[2]);
  const { tagline, summary } = projectText(project, t);
  return `<h1>${escape(project.title)}</h1><p>${escape(tagline)}</p><p>${escape(summary)}</p>
${list([escape(project.period || project.startedAt), escape(project.stack.join(", ")), ...(project.url ? [link(project.url, project.url.replace(/^https:\/\//, ""))] : []), ...(project.repo ? [link(project.repo, "GitHub")] : [])])}
<p>${link(at("/"), "Lê Gia Huy (Hugo Wishpax)")} · ${link(at("/project"), copy.projects)}</p>`;
}

function render(route, lang) {
  const seo = seoFor(route, lang, lookup(lang));
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(seo.title)}</title>`)
    .replace("<!--seo-->", headHtml(seo))
    .replace('<div id="root"></div>', `<div id="root"><main class="prerender">${staticBody(route, lang)}</main></div>`);
}

// "/" stays Vietnamese; "/vi/..." is the same page under an explicit prefix (canonical points to the root URL).
const prefixes = { vi: ["", "/vi"], en: ["/en"] };
let written = 0;
for (const route of routes()) {
  for (const lang of LANGS) {
    for (const prefix of prefixes[lang]) {
      const dir = path.join(dist, prefix, route === "/" ? "" : route);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), render(route, lang));
      written += 1;
    }
  }
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes().flatMap((route) => LANGS.map((lang) => `  <url>
    <loc>${urlFor(route, lang)}</loc>
    <lastmod>${today}</lastmod>
${LANGS.map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${urlFor(route, code)}" />`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(route, "vi")}" />
  </url>`)).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

// llms.txt (llmstxt.org): a short, plain summary for AI assistants, linking to the pages that hold the details.
const en = COPY.en;
const tEn = lookup("en");
fs.writeFileSync(path.join(dist, "llms.txt"), `# Lê Gia Huy (Hugo Wishpax)

> ${en.bio}

- Award: ${en.award}
- Education: ${en.greenwich}
- High school: ${en.ndc}
- Community: ${en.community}
- Skills: ${skillGroups.filter((group) => !group.studied).flatMap((group) => group.items.map((name) => skillLabel[name] || name)).join(", ")}
- Languages: Vietnamese (native), English (VSTEP B2), Chinese (HSK 2)
- Contact: ${MAIL.replace("mailto:", "")}

## Pages

- [Home](${urlFor("/", "en")}): profile, education, skills and projects (Vietnamese: ${urlFor("/", "vi")})
- [Projects](${urlFor("/project", "en")}): every project with its stack and links
- [Journey](${urlFor("/journey", "en")}): education milestones and travels
- [CV, web track (PDF)](${ORIGIN}/CV_Le_Gia_Huy.pdf)
- [CV, mobile track (PDF)](${ORIGIN}/CV_Le_Gia_Huy_Mobile.pdf)

## Projects

${projects.map((project) => `- [${project.title}](${urlFor(`/project/${project.id}`, "en")}): ${projectText(project, tEn).tagline}`).join("\n")}

## Elsewhere

${SAME_AS.map((href) => `- ${href}`).join("\n")}
`);
console.log(`prerendered ${written} pages, sitemap with ${routes().length * LANGS.length} URLs`);
