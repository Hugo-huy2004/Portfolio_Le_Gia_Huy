// One list of <head> tags per page, from a seoFor() result. The browser upserts them on client-side
// navigation; the build serialises the same list into each prerendered HTML file.
const SITE_NAME = "Hugo Wishpax";
const ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const name = (key, content) => ({ tag: "meta", key: `name="${key}"`, attrs: { name: key, content } });
const property = (key, content) => ({ tag: "meta", key: `property="${key}"`, attrs: { property: key, content } });

export function headTags(seo) {
  return [
    name("description", seo.description),
    name("author", "Lê Gia Huy (Hugo Wishpax)"),
    name("robots", ROBOTS),
    property("og:type", seo.type),
    property("og:site_name", SITE_NAME),
    property("og:locale", seo.locale),
    property("og:locale:alternate", seo.locale === "vi_VN" ? "en_US" : "vi_VN"),
    property("og:url", seo.url),
    property("og:title", seo.title),
    property("og:description", seo.description),
    property("og:image", seo.image),
    property("og:image:secure_url", seo.image),
    property("og:image:type", "image/jpeg"),
    property("og:image:width", seo.imageWidth),
    property("og:image:height", seo.imageHeight),
    property("og:image:alt", seo.imageAlt),
    name("twitter:card", "summary_large_image"),
    name("twitter:title", seo.title),
    name("twitter:description", seo.description),
    name("twitter:image", seo.image),
    name("twitter:image:alt", seo.imageAlt),
    { tag: "link", key: 'rel="canonical"', attrs: { rel: "canonical", href: seo.url } },
    ...Object.entries(seo.alternates).map(([code, href]) => ({ tag: "link", key: `rel="alternate"][hreflang="${code}"`, attrs: { rel: "alternate", hreflang: code, href } })),
    { tag: "link", key: 'rel="alternate"][hreflang="x-default"', attrs: { rel: "alternate", hreflang: "x-default", href: seo.alternates.vi } },
    { tag: "script", key: 'type="application/ld+json"', attrs: { type: "application/ld+json" }, text: JSON.stringify(seo.jsonLd) },
  ];
}

/** Browser: update <html lang>, <title> and every tag in place. */
export function applyHead(document, seo) {
  document.documentElement.setAttribute("lang", seo.lang);
  document.title = seo.title;
  for (const { tag, key, attrs, text } of headTags(seo)) {
    let element = document.head.querySelector(`${tag}[${key}]`);
    if (!element) {
      element = document.createElement(tag);
      document.head.appendChild(element);
    }
    for (const [attr, value] of Object.entries(attrs)) element.setAttribute(attr, String(value));
    if (text !== undefined) element.textContent = text;
  }
}

const escape = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Build: the same tags as HTML. JSON-LD keeps its text raw except for "</" (cannot close the script early). */
export function headHtml(seo) {
  return headTags(seo).map(({ tag, attrs, text }) => {
    const attributes = Object.entries(attrs).map(([attr, value]) => `${attr}="${escape(value)}"`).join(" ");
    if (tag === "meta" || tag === "link") return `<${tag} ${attributes} />`;
    return `<${tag} ${attributes}>${text.replace(/<\//g, "<\\/")}</${tag}>`;
  }).join("\n    ");
}
