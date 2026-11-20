"""Builds the CV: one page, single column, ATS-friendly (plain Helvetica, ASCII punctuation). Two tracks, two audiences:

    pip install reportlab
    python3 scripts/build-cv.py                      # public copies, no phone number:
                                                     #   public/CV_Le_Gia_Huy.pdf (web) + public/CV_Le_Gia_Huy_Mobile.pdf
    CV_PHONE="..." python3 scripts/build-cv.py       # also cv-private/CV_Le_Gia_Huy_{Web,Mobile}.pdf WITH the phone,
                                                     #   for sending to a recruiter directly (cv-private/ is gitignored)

The phone number never lives in this file: the repo and the public PDFs are readable by anyone (and by scrapers).
Check after editing: `pdfinfo` must say Pages: 1 for every output.
Grade line follows UoG Academic Regulations D6.1(c): 10% Stage 2 (all Level 5) + 90% best 90 credits of Stage 3,
rounded to a whole number. Source of truth: src/data/grades.js (node scripts/check-grades.mjs).
"""
import os
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable

ROOT = Path(__file__).resolve().parent.parent
M = 56.4
DARK, GRAY = HexColor("#1a1a1a"), HexColor("#444444")

def st(name, size, font="Helvetica", color=DARK, lead=None, **kw):
    return ParagraphStyle(name, fontName=font, fontSize=size, leading=lead or size * 1.32, textColor=color, **kw)

name = st("name", 18, lead=22)
title = st("title", 10.5, spaceBefore=2)
contact = st("contact", 9, lead=13)
head = st("head", 11, spaceBefore=5)
body = st("body", 9.4, lead=12.2)
item = st("item", 10, spaceBefore=3, lead=12.4)
meta = st("meta", 8.2, color=GRAY, lead=10.5)
bullet = st("bullet", 9.2, leftIndent=24, firstLineIndent=-8, lead=11.3, spaceBefore=0.5)

TRACKS = {
    "web": {
        "title": "Software Engineering Student - Full-Stack Web Developer",
        "summary": "Final-year Software Engineering student at the University of Greenwich (Vietnam), named Best Student in Mobile "
                   "Application Design and Development (Summer 2026). Builds and ships full-stack web apps with React, Next.js, "
                   "Node.js and MongoDB, from UI design to deployment, including one freelance client site and one site in use by a "
                   "parish community. Seeking a Frontend or Full-Stack Web Developer role.",
        "skills": [
            "Languages: TypeScript, JavaScript, Java, SQL",
            "Frontend: React, Next.js, Tailwind CSS, responsive and accessible UI, GSAP / Motion animation",
            "Backend and Data: Node.js, Express, MongoDB, Firebase / Firestore, SQLite, RESTful API design, MVC",
            "Auth, Payments and Tools: JWT, Google OAuth 2.0, bcrypt, PayPal, Facebook Graph API, Git, Vercel",
            "Also: Android (Java), React Native, Expo; studied PHP, Python, C#, C++ in coursework",
        ],
        "projects": ["hwj", "l3go", "mhike"],
    },
    "mobile": {
        "title": "Software Engineering Student - Mobile and Full-Stack Developer",
        "summary": "Final-year Software Engineering student at the University of Greenwich (Vietnam), named Best Student in Mobile "
                   "Application Design and Development (Summer 2026) for M-Hike, built both in native Android (Java) and in React "
                   "Native for Android and iOS. Also builds the backends apps need, with Node.js, Express, MongoDB and Firebase. "
                   "Seeking a Mobile Developer (Android / React Native) role.",
        "skills": [
            "Languages: Java, TypeScript, JavaScript, SQL",
            "Mobile: Android SDK (Java), React Native, Expo, SQLite, offline-first sync, GPS / location, OpenStreetMap",
            "Backend and Data: Firebase / Firestore, Node.js, Express, MongoDB, RESTful API design, MVC",
            "Auth and Tools: JWT, Google OAuth 2.0, bcrypt, PayPal, Git, Vercel",
            "Also: React, Next.js, Tailwind CSS; studied PHP, Python, C#, C++ in coursework",
        ],
        "projects": ["mhike", "hwj", "l3go"],
    },
}

PROJECTS = {
    "mhike": (
        "M-Hike - Hiking Trip Manager | Java, React Native, TypeScript, SQLite, Firebase | 07 - 08/2026",
        "Coursework COMP1786 | 77%, Best Student in the module | Live: hiking.hugowishpax.studio",
        ["Built the app twice: native Android in Java and cross-platform React Native running on Android and iOS, sharing one Firebase data branch.",
         "Designed an offline-first SQLite layer with foreign keys and cascade delete, parameterised multi-criteria search, GPS tracking, SOS and a bilingual UI."],
    ),
    "hwj": (
        "HWJ - Luxury Jewellery E-Commerce | React, TypeScript, Express, MongoDB, PayPal | 01 - 04/2026",
        "Coursework COMP1842 Web Programming 2 | Live: hwj-demo.hugowishpax.studio",
        ["Built a MERN store with Google OAuth, JWT, bcrypt, rate limiting and role-checked admin APIs, plus one dashboard for products, orders and appointments.",
         "Verified PayPal payments on the server, rejecting any order whose total differs from PayPal's."],
    ),
    "l3go": (
        "L3GO Coffee - Coffee Shop Website | React, TailwindCSS | 2026",
        "Live: legocoffee.hwagfu.dev | UI/UX design, in collaboration with Jason Phan (data layer and deployment)",
        ["Designed the UI/UX, including a 68-item menu filtered by mood instead of category so visitors choose faster."],
    ),
}


def build(track, out, phone=None):
    t = TRACKS[track]
    story = []
    P = lambda text, style: story.append(Paragraph(text, style))

    def section(text):
        P(text, head)
        story.append(HRFlowable(width="100%", thickness=0.8, color=DARK, spaceBefore=2, spaceAfter=4))

    def bullets(*items):
        for b in items:
            P("- " + b, bullet)

    P("Le Gia Huy", name)
    P(t["title"], title)
    story.append(Spacer(1, 4))
    P(" | ".join(x for x in ["Vietnam", phone, "hugowishpax@gmail.com"] if x), contact)
    P("Portfolio: portfolio.hugowishpax.studio | GitHub: github.com/Hugo-huy2004", contact)
    story.append(HRFlowable(width="100%", thickness=0.8, color=DARK, spaceBefore=6, spaceAfter=0))

    section("PROFESSIONAL SUMMARY")
    P(t["summary"], body)

    section("TECHNICAL SKILLS")
    for line in t["skills"]:
        P(line, body)

    # Real clients and real users come before coursework.
    section("EXPERIENCE")
    P("Freelance Web Developer - Minh Oi Media (wedding photo studio) | 03 - 04/2026", item)
    P("HTML, CSS, JavaScript | Live: minhoimedia.digital", meta)
    bullets("Built and deployed the studio's responsive marketing website for a paying client: portfolio, packages and pricing.")
    P("Volunteer Web Developer - Chanh Toa My Tho Parish Portal | 08/2026 - present", item)
    P("Next.js, React, TypeScript, Tailwind, Firebase | Live: chanhtoa.tnttgiaophanmytho.online | Source: github.com/HuynhDutruong/FAQ", meta)
    bullets("Designed, built and maintain a server-rendered parish portal used by the parish community: Mass times across 27 dioceses, the full Bible and catechism Q&amp;A.",
            "Synced the parish Facebook page into Firestore via the Graph API, so posts appear on the site without manual copying.")

    section("PROJECTS")
    for key in t["projects"]:
        heading, info, points = PROJECTS[key]
        P(heading, item)
        P(info, meta)
        bullets(*points)

    section("LEADERSHIP AND EXTRACURRICULAR ACTIVITIES")
    P("Youth Activity Coordinator (Huynh Truong) - Local Community Youth Group, My Tho", item)
    bullets("Lead weekly programmes, events and volunteer teams; built the group's website (Chanh Toa portal above).")

    section("EDUCATION")
    P("University of Greenwich - Vietnam", item)
    P("Bachelor of Computing - Software Engineering | Final-year student", body)
    P("Provisional classification mark (Greenwich 10:90 algorithm): 69%", body)
    P("Honors: Certificate of Merit - Best Student in Mobile Application Design and Development (MHike), Summer 2026", body)
    P("THPT Nguyen Dinh Chieu, My Tho (Coll&egrave;ge de Mytho) - High School Diploma", item)
    P("Languages: Vietnamese (native), English VSTEP B2 (Overall 6.5), Chinese HSK 2", body)

    out.parent.mkdir(parents=True, exist_ok=True)
    SimpleDocTemplate(str(out), pagesize=letter, leftMargin=M, rightMargin=M, topMargin=30, bottomMargin=22,
                      title="Le Gia Huy - CV", author="Le Gia Huy").build(story)
    print(out)


build("web", ROOT / "public" / "CV_Le_Gia_Huy.pdf")
build("mobile", ROOT / "public" / "CV_Le_Gia_Huy_Mobile.pdf")
if os.environ.get("CV_PHONE"):
    build("web", ROOT / "cv-private" / "CV_Le_Gia_Huy_Web.pdf", os.environ["CV_PHONE"])
    build("mobile", ROOT / "cv-private" / "CV_Le_Gia_Huy_Mobile.pdf", os.environ["CV_PHONE"])
