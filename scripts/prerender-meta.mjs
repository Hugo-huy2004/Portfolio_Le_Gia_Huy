// After `vite build`: one static HTML per public URL and language, each carrying its own title, description,
// Open Graph/Twitter card, canonical, hreflang and JSON-LD — link-preview bots read these without running JS.
// Also writes sitemap.xml (with hreflang alternates) and robots.txt.
import fs from "node:fs";
import path from "node:path";
import { LANGS, ORIGIN, routes, seoFor, urlFor } from "../src/seo/seo.js";
import { headHtml } from "../src/seo/head.js";

const dist = path.resolve("dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--seo-->")) throw new Error("dist/index.html is missing the <!--seo--> marker");

const dictionaries = Object.fromEntries(LANGS.map((lang) => [lang, JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}/translation.json`, "utf8"))]));
const lookup = (lang) => (key, fallback) => {
  const value = key.split(".").reduce((node, part) => (node == null ? undefined : node[part]), dictionaries[lang]);
  return typeof value === "string" ? value : fallback;
};
const escape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function render(route, lang) {
  const seo = seoFor(route, lang, lookup(lang));
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(seo.title)}</title>`)
    .replace("<!--seo-->", headHtml(seo));
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
console.log(`prerendered ${written} pages, sitemap with ${routes().length * LANGS.length} URLs`);
