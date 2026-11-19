"""Builds public/CV_Le_Gia_Huy.pdf: one page, single column, ATS-friendly (plain Helvetica, ASCII punctuation).

    pip install reportlab
    python3 scripts/build-cv.py            # writes public/CV_Le_Gia_Huy.pdf
    python3 scripts/build-cv.py out.pdf    # or anywhere else

Check after editing: `pdfinfo` must say Pages: 1.
Grade line follows UoG Academic Regulations D6.1(c): 10% Stage 2 (all Level 5) + 90% best 90 credits of Stage 3,
rounded to a whole number. Source of truth: src/data/grades.js (node scripts/check-grades.mjs).
"""
import sys
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable

OUT = sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).resolve().parent.parent / "public" / "CV_Le_Gia_Huy.pdf")
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

story = []
P = lambda t, s: story.append(Paragraph(t, s))

def section(t):
    P(t, head)
    story.append(HRFlowable(width="100%", thickness=0.8, color=DARK, spaceBefore=2, spaceAfter=4))

def bullets(*items):
    for b in items:
        P("- " + b, bullet)

P("Le Gia Huy", name)
P("Software Engineer - Full-Stack Web and Mobile Developer", title)
story.append(Spacer(1, 4))
P("Vietnam | 0839909399 | hugowishpax@gmail.com", contact)
P("Portfolio: portfolio.hugowishpax.studio | GitHub: github.com/Hugo-huy2004", contact)
story.append(HRFlowable(width="100%", thickness=0.8, color=DARK, spaceBefore=6, spaceAfter=0))

section("PROFESSIONAL SUMMARY")
P("Final-year Software Engineering student at the University of Greenwich (Vietnam), named Best Student in Mobile "
  "Application Design and Development (Summer 2026). Builds full-stack web apps with React, Next.js, Node.js and MongoDB, "
  "and mobile apps in native Android (Java) and React Native. Seeking a Frontend, Backend, Mobile or Full-Stack Developer role.", body)

section("TECHNICAL SKILLS")
for line in [
    "Languages: TypeScript, JavaScript, Java, SQL",
    "Web and Mobile: React, Next.js, Tailwind CSS, Android (Java), React Native, Expo",
    "Backend and Data: Node.js, Express, MongoDB, Firebase, SQLite",
    "Integrations and Tools: JWT, Google OAuth 2.0, PayPal, Git, Vercel",
    "Concepts: RESTful API Design, MVC Pattern, Offline-first Sync, Responsive Design",
    "Also studied (coursework): PHP, Python, C#, C++",
]:
    P(line, body)

section("PROJECTS")
P("Chanh Toa My Tho - Parish Portal | Next.js, React, TypeScript, Tailwind, Firebase | 08/2026 - present", item)
P("Live: chanhtoa.tnttgiaophanmytho.online | Source: github.com/HuynhDutruong/FAQ", meta)
bullets("Built a server-rendered parish portal (Mass times across 27 dioceses, full Bible, catechism Q&amp;A) that syncs the parish Facebook page into Firestore via the Graph API.")
P("M-Hike - Hiking Trip Manager | Java, React Native, TypeScript, SQLite, Firebase | 07 - 08/2026", item)
P("Coursework COMP1786 | 77%, Best Student in the module | Live: hiking.hugowishpax.studio", meta)
bullets("Built the app twice: native Android in Java and cross-platform React Native running on Android and iOS, sharing one Firebase data branch.",
        "Designed an offline-first SQLite layer with foreign keys and cascade delete, parameterised multi-criteria search, GPS tracking, SOS and a bilingual UI.")
P("L3GO Coffee - Coffee Shop Website | React, TailwindCSS | 2026", item)
P("Live: legocoffee.hwagfu.dev | UI/UX design, in collaboration with Jason Phan (data layer and deployment)", meta)
bullets("Designed the UI/UX, including a 68-item menu filtered by mood instead of category so visitors choose faster.")
P("Minh Oi Media - Wedding Photo Studio Website | HTML, CSS, JavaScript | 03 - 04/2026", item)
P("Live: minhoimedia.digital | Freelance project", meta)
bullets("Built and deployed a responsive marketing website for a wedding photography studio, presenting its portfolio, packages and pricing.")
P("HWJ - Luxury Jewellery E-Commerce | React, TypeScript, Express, MongoDB, PayPal | 01 - 04/2026", item)
P("Coursework COMP1842 Web Programming 2 | Live: hwj-demo.hugowishpax.studio", meta)
bullets("Built a MERN store with Google OAuth, JWT, bcrypt, rate limiting and role-checked admin APIs, plus one dashboard for products, orders and appointments.",
        "Verified PayPal payments on the server, rejecting any order whose total differs from PayPal's.")

section("LEADERSHIP AND EXTRACURRICULAR ACTIVITIES")
P("Youth Activity Coordinator (Huynh Truong) - Local Community Youth Group, My Tho", item)
bullets("Lead weekly programmes, events and volunteer teams; built the group's website (Chanh Toa project above).")

section("EDUCATION")
P("University of Greenwich - Vietnam", item)
P("Bachelor of Computing - Software Engineering | Final-year student", body)
P("Provisional classification mark (Greenwich 10:90 algorithm): 69%", body)
P("Honors: Certificate of Merit - Best Student in Mobile Application Design and Development (MHike), Summer 2026", body)
P("THPT Nguyen Dinh Chieu, My Tho (Coll&egrave;ge de Mytho) - High School Diploma", item)
P("Languages: Vietnamese (native), English VSTEP B2 (Overall 6.5), Chinese HSK 2", body)

SimpleDocTemplate(OUT, pagesize=letter, leftMargin=M, rightMargin=M, topMargin=30, bottomMargin=22,
                  title="Le Gia Huy - CV", author="Le Gia Huy").build(story)
