"""Builds public/CV_Le_Gia_Huy.pdf: one page, single column, ATS-friendly (plain Helvetica, ASCII punctuation).

    pip install reportlab
    python3 scripts/build-cv.py            # writes public/CV_Le_Gia_Huy.pdf
    python3 scripts/build-cv.py out.pdf    # or anywhere else

Check after editing: `pdfinfo` must say Pages: 1.
Grade line follows UoG Academic Regulations D6.1(c): 10% Stage 2 (all Level 5) + 90% best 90 credits of Stage 3,
rounded to a whole number; US GPA from Appendix A of the same regulations.
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
P("Final-year Computing student at the University of Greenwich (Vietnam) with hands-on experience building full-stack "
  "web and mobile applications using React, Next.js, Node.js, Express and MongoDB. Experienced in RESTful API design, "
  "OAuth authentication, Firebase-backed applications, responsive design and the MVC pattern. Comfortable across "
  "JavaScript/TypeScript, PHP, Python, C# and C++. Seeking a Frontend, Backend or Full-Stack Developer role.", body)

section("TECHNICAL SKILLS")
for line in [
    "Programming Languages: JavaScript, TypeScript, PHP, Python, C#, C++, SQL",
    "Frontend: ReactJS, NextJS, TailwindCSS, Expo",
    "Backend: ExpressJS, NodeJS, Firebase",
    "Databases: MongoDB, SQL",
    "Tools and Platforms: Git, GitHub, Docker, Vercel, Render",
    "Concepts: RESTful API Design, OAuth, MVC Pattern, Responsive Design",
    "Core Skills: Teamwork, Task Coordination, Time Management, Planning",
]:
    P(line, body)

section("PROJECTS")
P("Minh Hoi Media - Wedding Photo Studio Website | HTML, JavaScript, CSS, Vercel", item)
P("Live: minhoimedia.digital | Freelance project", meta)
bullets("Built and deployed a marketing website for a wedding photography studio, showcasing portfolios and packages to prospective clients.",
        "Delivered a responsive, static front end hosted on Vercel as an independent freelance engagement.")
P("HWJ - Jewelry E-Commerce Platform | React, Express, Node.js, MongoDB, TailwindCSS", item)
P("Academic project - Web Programming 2 module | Deployed on Vercel (frontend) and Render (backend)", meta)
bullets("Built a full-stack jewelry storefront with a React front end and an Express/Node.js/MongoDB backend, following the MVC design pattern.",
        "Implemented OAuth-based authentication and a fully responsive UI with TailwindCSS.")
P("Chanh Toa FAQ - Parish Youth Ministry Website | Next.js, React, TypeScript, Firebase", item)
P("Live: chanhtoa.tnttgiaophanmytho.online | Source: github.com/HuynhDutruong/FAQ", meta)
bullets("Developed a content and FAQ site for a parish youth ministry group on Next.js (App Router) with TypeScript.",
        "Used Firebase (Firestore and Authentication, with the Admin SDK for server-side operations) for data storage and user access control, deployed on Vercel.")
P("L3GO Coffee - Coffee Shop Website | React, TailwindCSS", item)
P("Live: legocoffee.hwagfu.dev | UI/UX design, in collaboration with Jason Phan (data layer and deployment)", meta)
bullets("Designed the UI/UX: colour system, typographic rhythm and a photo-led layout of the space.",
        "Designed a 68-item menu filtered by mood instead of category, so visitors choose faster.")

section("LEADERSHIP AND EXTRACURRICULAR ACTIVITIES")
P("Youth Activity Coordinator (Huynh Truong) - Local Community Youth Group, My Tho", item)
bullets("Led and coordinated weekly programs and events for a community youth group, scheduling activities, organizing volunteer teams and managing timetables.",
        "Designed and built the group's official website (see Chanh Toa FAQ project above) to support its activities and outreach.")

section("EDUCATION")
P("University of Greenwich - Vietnam", item)
P("Bachelor of Computing - Software Engineering | Final-year student", body)
P("Provisional average (to date): 69% | US GPA equiv.: 3.80/4.00", body)
P("Honors: Outstanding Student - Summer 2026 (named to the University's Outstanding Student List)", body)
P("THPT Nguyen Dinh Chieu, My Tho (Coll&egrave;ge de Mytho)", item)
P("High School Diploma", body)
P("Languages: VSTEP English B2 (Overall 6.5), Chinese HSK 2", body)

SimpleDocTemplate(OUT, pagesize=letter, leftMargin=M, rightMargin=M, topMargin=30, bottomMargin=22,
                  title="Le Gia Huy - CV", author="Le Gia Huy").build(story)
