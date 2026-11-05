// Single source of SEO for every public route, in both hand-written languages.
// Used at runtime (useHeadMeta) and at build time (scripts/prerender-meta.mjs writes the same tags into
// static HTML per URL, because link-preview bots — Facebook, Zalo, Messenger, X, Slack — don't run JS).
// `t(key, fallback)` reads the route language's translation file; the build passes its own lookup.
import { projects } from "../data/projects.js";

export const ORIGIN = "https://portfolio.hugowishpax.studio";
export const LANGS = ["vi", "en"];
const LOCALE = { vi: "vi_VN", en: "en_US" };
const SAME_AS = [
  "https://github.com/Hugo-huy2004",
  "https://www.facebook.com/share/18jfh4AUPh/",
  "https://www.instagram.com/hugowishpax",
  "https://www.tiktok.com/@pethugowishpaxle",
];

// Vietnamese lives at the root (also served under /vi); English under /en.
export const urlFor = (path, lang) => `${ORIGIN}${lang === "en" ? "/en" : ""}${path === "/" && lang === "en" ? "" : path}`;
const ogImage = (name, lang) => `${ORIGIN}/og/${name}-${lang}.jpg`;

const COPY = {
  vi: {
    homeTitle: "Hugo Wishpax — Kỹ sư phần mềm Full-Stack Web & Mobile",
    homeDescription: "Portfolio của Lê Gia Huy (Hugo Wishpax): sản phẩm web và mobile làm trọn từ giao diện tới máy chủ với React, Next.js và Node.js. Xem các dự án thật đang chạy.",
    homeAlt: "Hugo Wishpax ngồi trước chữ HUGO trên nền xanh cobalt, kèm dòng Kỹ sư phần mềm Full-Stack",
    listTitle: "Dự án — Hành trình của Hugo Wishpax",
    listDescription: "Những dự án thật đang chạy, xếp theo hành trình: khách hàng thật, người dùng thật. Từ website studio cưới, trang sức cao cấp tới cổng thông tin giáo xứ.",
    listAlt: "Các màn hình dự án của Hugo Wishpax xếp như ảnh polaroid",
    projectSuffix: "Dự án của Hugo Wishpax",
    projects: "Dự án",
    home: "Trang chủ",
    jobTitle: "Kỹ sư phần mềm Full-Stack",
  },
  en: {
    homeTitle: "Hugo Wishpax — Full-Stack Web & Mobile Software Engineer",
    homeDescription: "Portfolio of Lê Gia Huy (Hugo Wishpax): web and mobile products built end to end, from interface to server, with React, Next.js and Node.js. See real projects running live.",
    homeAlt: "Hugo Wishpax sitting in front of the word HUGO on a cobalt background, with the line Full-Stack Software Engineer",
    listTitle: "Projects — Hugo Wishpax's journey",
    listDescription: "Real projects running live, told as a journey: real clients, real users. From a wedding studio site and fine jewellery to a parish portal.",
    listAlt: "Screens from Hugo Wishpax's projects laid out like polaroids",
    projectSuffix: "A project by Hugo Wishpax",
    projects: "Projects",
    home: "Home",
    jobTitle: "Full-Stack Software Engineer",
  },
};

const person = (lang) => ({
  "@type": "Person",
  "@id": `${ORIGIN}/#person`,
  name: "Lê Gia Huy",
  alternateName: "Hugo Wishpax",
  jobTitle: COPY[lang].jobTitle,
  url: urlFor("/", lang),
  image: `${ORIGIN}/hugo-portrait.png`,
  email: "mailto:hugowishpax@gmail.com",
  nationality: "Vietnam",
  alumniOf: [{ "@type": "CollegeOrUniversity", name: "University of Greenwich (Vietnam)" }, { "@type": "HighSchool", name: "THPT Nguyễn Đình Chiểu, Mỹ Tho" }],
  knowsAbout: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Firebase", "TypeScript", "Tailwind CSS", "React Native"],
  sameAs: SAME_AS,
});

const breadcrumbs = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, item], index) => ({ "@type": "ListItem", position: index + 1, name, item })),
});

/** Everything a page's <head> needs. `path` is the unprefixed route: "/", "/project" or "/project/:id". */
export function seoFor(path, lang, t = (key, fallback) => fallback) {
  const copy = COPY[lang] || COPY.vi;
  const alternates = Object.fromEntries(LANGS.map((code) => [code, urlFor(path, code)]));
  const base = { lang, locale: LOCALE[lang], url: urlFor(path, lang), alternates, imageWidth: 2400, imageHeight: 1260 };

  if (path === "/") {
    return {
      ...base,
      title: copy.homeTitle,
      description: copy.homeDescription,
      image: ogImage("home", lang),
      imageAlt: copy.homeAlt,
      type: "profile",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          person(lang),
          { "@type": "WebSite", "@id": `${ORIGIN}/#website`, url: urlFor("/", lang), name: "Hugo Wishpax", inLanguage: lang, author: { "@id": `${ORIGIN}/#person` } },
          { "@type": "ProfilePage", url: urlFor("/", lang), name: copy.homeTitle, inLanguage: lang, mainEntity: { "@id": `${ORIGIN}/#person` } },
        ],
      },
    };
  }

  if (path === "/project") {
    return {
      ...base,
      title: copy.listTitle,
      description: copy.listDescription,
      image: ogImage("projects", lang),
      imageAlt: copy.listAlt,
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage", url: base.url, name: copy.listTitle, description: copy.listDescription, inLanguage: lang,
            mainEntity: { "@type": "ItemList", itemListElement: projects.map((project, index) => ({ "@type": "ListItem", position: index + 1, url: urlFor(`/project/${project.id}`, lang), name: project.title })) },
          },
          breadcrumbs([[copy.home, urlFor("/", lang)], [copy.projects, base.url]]),
        ],
      },
    };
  }

  const id = path.split("/")[2];
  const project = projects.find((item) => item.id === id);
  if (!project) return seoFor("/", lang, t);
  const key = `projectsPage.items.${project.id}`;
  const tagline = t(`${key}.tagline`, project.tagline);
  const kind = t(`projectsPage.kinds.${project.kind}`, project.kind);
  return {
    ...base,
    title: `${project.title} · ${kind} | Hugo Wishpax`,
    description: `${tagline} ${copy.projectSuffix}.`,
    image: ogImage(`project-${project.id}`, lang),
    imageAlt: `${project.title} — ${tagline}`,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CreativeWork", name: project.title, headline: `${project.title} — ${tagline}`, description: t(`${key}.summary`, project.summary),
          url: base.url, image: `${ORIGIN}/project-screenshots/${project.id}/${project.shots[0].src}.webp`, inLanguage: lang,
          dateCreated: project.startedAt, keywords: project.stack.join(", "), author: { "@id": `${ORIGIN}/#person`, "@type": "Person", name: "Lê Gia Huy", alternateName: "Hugo Wishpax" },
          ...(project.url ? { sameAs: project.url } : {}), ...(project.repo ? { codeRepository: project.repo } : {}),
        },
        breadcrumbs([[copy.home, urlFor("/", lang)], [copy.projects, urlFor("/project", lang)], [project.title, base.url]]),
      ],
    },
  };
}

/** Every indexable route, for prerendering and the sitemap. */
export const routes = () => ["/", "/project", ...projects.map((project) => `/project/${project.id}`)];
