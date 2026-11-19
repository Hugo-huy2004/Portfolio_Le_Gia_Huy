// Single source of SEO for every public route, in both hand-written languages.
// Used at runtime (useHeadMeta) and at build time (scripts/prerender-meta.mjs writes the same tags into
// static HTML per URL, because link-preview bots — Facebook, Zalo, Messenger, X, Slack — don't run JS).
// `t(key, fallback)` reads the route language's translation file; the build passes its own lookup.
import { projects } from "../data/projects.js";
import { skillGroups } from "../data/skills.js";

export const ORIGIN = "https://portfolio.hugowishpax.studio";
export const LANGS = ["vi", "en"];
const LOCALE = { vi: "vi_VN", en: "en_US" };
export const SAME_AS = [
  "https://github.com/Hugo-huy2004",
  "https://www.facebook.com/share/18jfh4AUPh/",
  "https://www.instagram.com/hugowishpax",
  "https://www.tiktok.com/@pethugowishpaxle",
  "https://www.youtube.com/@By_Hugo_Hi",
  "https://chanhtoa.tnttgiaophanmytho.online/gioi-thieu/xu-doan?bio=bdh-le-gia-huy",
];

// Vietnamese lives at the root (also served under /vi); English under /en.
export const urlFor = (path, lang) => `${ORIGIN}${lang === "en" ? "/en" : ""}${path === "/" && lang === "en" ? "" : path}`;
const ogImage = (name, lang) => `${ORIGIN}/og/${name}-${lang}.jpg`;

export const COPY = {
  vi: {
    homeTitle: "Lê Gia Huy (Hugo Wishpax) — Kỹ sư phần mềm Full-Stack Web & Mobile",
    homeDescription: "Portfolio của Lê Gia Huy (Hugo Wishpax), sinh viên năm cuối Kỹ thuật phần mềm tại Greenwich Việt Nam: học vấn, kỹ năng và các dự án web, mobile đã làm.",
    homeAlt: "Hugo Wishpax ngồi trước chữ HUGO trên nền xanh cobalt, kèm dòng Kỹ sư phần mềm Full-Stack",
    listTitle: "Dự án — Hành trình của Hugo Wishpax",
    listDescription: "Những dự án Lê Gia Huy đã làm, kể theo hành trình: từ cổng thông tin giáo xứ, website studio cưới tới nền tảng trang sức.",
    listAlt: "Các màn hình dự án của Hugo Wishpax xếp như ảnh polaroid",
    journeyTitle: "Hành trình — Học vấn và những chuyến đi của Hugo Wishpax",
    journeyDescription: "Những bước ngoặt học vấn của Lê Gia Huy, từ THPT Nguyễn Đình Chiểu tới giải Sinh viên xuất sắc nhất môn Mobile App tại Greenwich, cùng những nơi đã đặt chân đến.",
    journey: "Hành trình",
    projectSuffix: "Dự án của Hugo Wishpax",
    projects: "Dự án",
    home: "Trang chủ",
    jobTitle: "Kỹ sư phần mềm Full-Stack",
    // Plain facts, written once: the prerendered page copy and llms.txt both quote these.
    bio: "Lê Gia Huy, còn được biết đến với tên Hugo Wishpax, là sinh viên năm cuối ngành Kỹ thuật phần mềm (Bachelor of Computing) tại University of Greenwich (Việt Nam). Lê Gia Huy làm website và ứng dụng di động cho khách hàng thật bằng React, Next.js, Node.js và React Native, và là Huynh trưởng Thiếu Nhi Thánh Thể tại Mỹ Tho, Tiền Giang.",
    award: "Sinh viên xuất sắc nhất học phần Thiết kế và Phát triển Ứng dụng Di động (COMP1786, dự án M-Hike), University of Greenwich (Việt Nam), kỳ Summer 2026.",
    education: "Học vấn",
    skills: "Kỹ năng",
    contact: "Liên hệ",
    greenwich: "University of Greenwich (Việt Nam) — Cử nhân Kỹ thuật phần mềm (Bachelor of Computing), sinh viên năm cuối.",
    ndc: "THPT Nguyễn Đình Chiểu (Collège de Mytho), Mỹ Tho, Tiền Giang — tốt nghiệp THPT, niên khoá 2019–2022.",
    community: "Huynh trưởng Thiếu Nhi Thánh Thể, Xứ đoàn Các Thánh Tử Đạo Việt Nam, Giáo xứ Chánh Tòa Mỹ Tho.",
  },
  en: {
    homeTitle: "Lê Gia Huy (Hugo Wishpax) — Full-Stack Web & Mobile Software Engineer",
    homeDescription: "Portfolio of Lê Gia Huy (Hugo Wishpax), a final-year Software Engineering student at Greenwich Vietnam: education, skills and web and mobile projects.",
    homeAlt: "Hugo Wishpax sitting in front of the word HUGO on a cobalt background, with the line Full-Stack Software Engineer",
    listTitle: "Projects — Hugo Wishpax's journey",
    listDescription: "The projects Lê Gia Huy has built, told as a journey: from a parish portal and a wedding studio site to a jewellery platform.",
    listAlt: "Screens from Hugo Wishpax's projects laid out like polaroids",
    journeyTitle: "Journey — Hugo Wishpax's education and travels",
    journeyDescription: "Lê Gia Huy's turning points in education, from Nguyễn Đình Chiểu High School to Best Student in Mobile App Development at Greenwich, and the places along the way.",
    journey: "Journey",
    projectSuffix: "A project by Hugo Wishpax",
    projects: "Projects",
    home: "Home",
    jobTitle: "Full-Stack Software Engineer",
    bio: "Lê Gia Huy, also known as Hugo Wishpax, is a final-year Software Engineering (Bachelor of Computing) student at the University of Greenwich (Vietnam). Lê Gia Huy builds websites and mobile apps for real clients with React, Next.js, Node.js and React Native, and is a Eucharistic Youth leader in Mỹ Tho, Tiền Giang, Vietnam.",
    award: "Best Student in Mobile Application Design and Development (COMP1786, M-Hike project), University of Greenwich (Vietnam), Summer 2026.",
    education: "Education",
    skills: "Skills",
    contact: "Contact",
    greenwich: "University of Greenwich (Vietnam) — Bachelor of Computing in Software Engineering, final year.",
    ndc: "Nguyễn Đình Chiểu High School (Collège de Mytho), Mỹ Tho, Tiền Giang — high school diploma, class of 2019–2022.",
    community: "Eucharistic Youth leader, Vietnamese Martyrs chapter, Mỹ Tho Cathedral parish.",
  },
};

const person = (lang) => ({
  "@type": "Person",
  "@id": `${ORIGIN}/#person`,
  name: "Lê Gia Huy",
  alternateName: ["Hugo Wishpax", "Le Gia Huy"],
  givenName: "Huy",
  additionalName: "Gia",
  familyName: "Lê",
  description: COPY[lang].bio,
  jobTitle: COPY[lang].jobTitle,
  url: urlFor("/", lang),
  image: `${ORIGIN}/hugo-portrait.webp`,
  email: "mailto:hugowishpax@gmail.com",
  nationality: { "@type": "Country", name: "Vietnam" },
  homeLocation: { "@type": "Place", name: "Mỹ Tho, Tiền Giang, Vietnam" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University of Greenwich (Vietnam)", url: "https://greenwich.edu.vn" },
    { "@type": "HighSchool", name: "Trường THPT Nguyễn Đình Chiểu (Collège de Mytho)", alternateName: "Collège de Mytho", url: "https://ndc.edu.vn", foundingDate: "1879-03-17" },
  ],
  award: COPY[lang].award,
  memberOf: { "@type": "Organization", name: "Thiếu Nhi Thánh Thể Việt Nam", alternateName: "Vietnamese Eucharistic Youth Movement" },
  knowsLanguage: ["vi", "en", "zh"],
  knowsAbout: skillGroups.flatMap((group) => group.items).concat(["Full-stack web development", "Mobile application development", "RESTful API design"]),
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

  if (path === "/journey") {
    return {
      ...base,
      title: copy.journeyTitle,
      description: copy.journeyDescription,
      image: ogImage("home", lang), // ponytail: shares the home card; add og/journey-*.jpg in generate-og.mjs if previews need their own
      imageAlt: copy.homeAlt,
      type: "website",
      jsonLd: { "@context": "https://schema.org", "@graph": [breadcrumbs([[copy.home, urlFor("/", lang)], [copy.journey, base.url]])] },
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
          ...(project.id === "mhike" ? { award: copy.award } : {}),
        },
        breadcrumbs([[copy.home, urlFor("/", lang)], [copy.projects, urlFor("/project", lang)], [project.title, base.url]]),
      ],
    },
  };
}

/** Every indexable route, for prerendering and the sitemap. */
export const routes = () => ["/", "/project", "/journey", ...projects.map((project) => `/project/${project.id}`)];
