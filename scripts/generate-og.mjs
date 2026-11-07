// Renders the link-preview images (public/og/*.jpg, 2400×1260 = 1200×630 at 2×) with headless Chrome.
// Run after changing project data or copy:  node scripts/generate-og.mjs
// Needs Google Chrome installed (CHROME env var overrides the macOS default path) and network for Google Fonts.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { projects } from "../src/data/projects.js";

const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const pub = path.resolve("public");
const out = path.join(pub, "og");
fs.mkdirSync(out, { recursive: true });
const asset = (relative) => pathToFileURL(path.join(pub, relative)).href;
const dict = (lang) => JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}/translation.json`, "utf8"));
const shot = (project, src) => asset(`project-screenshots/${project.id}/${src}${src.includes(".") ? "" : ".webp"}`);

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Fraunces:ital,opsz,wght@1,9..144,500&family=Nunito:wght@600;700;800&display=block" rel="stylesheet">`;
const BASE = `*{box-sizing:border-box;margin:0}html,body{width:1200px;height:630px;overflow:hidden}body{font-family:Nunito,sans-serif;-webkit-font-smoothing:antialiased}
.url{position:absolute;left:64px;bottom:48px;display:flex;align-items:center;gap:12px;font-size:20px;font-weight:700;opacity:.85}
.url i{width:12px;height:12px;border-radius:50%;background:#ffbf08}
.pill{display:inline-block;padding:8px 18px;border-radius:999px;background:#ffbf08;color:#0b0c10;font-size:20px;font-weight:800}
.serif{font-family:Fraunces,Georgia,serif;font-style:italic;font-weight:500;letter-spacing:-.02em}`;
const sticker = "drop-shadow(5px 0 0 #fbf8f1) drop-shadow(-5px 0 0 #fbf8f1) drop-shadow(0 5px 0 #fbf8f1) drop-shadow(0 -5px 0 #fbf8f1) drop-shadow(0 26px 30px rgb(10 16 70/.45))";
const browser = (src, label) => `<figure style="margin:0;overflow:hidden;border-radius:18px;background:#fff;box-shadow:0 40px 80px rgb(0 0 0/.5)">
  <div style="display:flex;height:34px;align-items:center;gap:7px;padding:0 14px;background:#eceef2"><i style="width:11px;height:11px;border-radius:50%;background:#f0645a"></i><i style="width:11px;height:11px;border-radius:50%;background:#f5bd4f"></i><i style="width:11px;height:11px;border-radius:50%;background:#5fc454"></i><b style="margin-left:10px;padding:3px 12px;border-radius:999px;background:#fff;color:#6b7280;font-size:13px">${label}</b></div>
  <img src="${src}" style="display:block;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top"></figure>`;
const polaroid = (src, style) => `<figure style="position:absolute;margin:0;padding:10px 10px 34px;border-radius:8px;background:rgb(255 255 255/.92);box-shadow:0 26px 50px rgb(0 0 0/.45);${style}"><img src="${src}" style="display:block;width:100%;aspect-ratio:4/3;object-fit:cover;object-position:top;border-radius:4px"></figure>`;

const pages = [];
for (const lang of ["vi", "en"]) {
  const t = dict(lang);
  const vi = lang === "vi";
  pages.push({ name: `home-${lang}`, html: `<body style="background:#283db7;color:#f4f6fb">
    <div style="position:absolute;right:120px;top:70px;width:460px;height:460px;border-radius:50%;background:#b4452a"></div>
    <div style="position:absolute;left:64px;top:70px;font-family:'Bricolage Grotesque';font-size:250px;font-weight:800;letter-spacing:-.06em;line-height:.8">Hugo</div>
    <img src="${asset("hugo-portrait.png")}" style="position:absolute;right:150px;bottom:-40px;height:610px;filter:${sticker}">
    <div style="position:absolute;left:64px;top:300px;width:560px">
      <div class="serif" style="font-size:58px;line-height:1.02;color:#ffbf08">${vi ? "Kỹ sư phần mềm<br>Full-Stack" : "Full-Stack<br>Software Engineer"}</div>
      <p style="margin-top:20px;font-size:24px;line-height:1.4;opacity:.9">${vi ? "Web &amp; mobile, làm trọn từ giao diện tới máy chủ." : "Web &amp; mobile, built end to end."}</p>
    </div>
    <div class="url"><i></i>portfolio.hugowishpax.studio${vi ? "" : "/en"}</div></body>` });

  const [a, b, c] = projects;
  pages.push({ name: `projects-${lang}`, html: `<body style="background:#0b0c10;color:#f4f6fb">
    <div style="position:absolute;inset:0;background:radial-gradient(500px 400px at 85% 40%,rgb(40 61 183/.55),transparent 70%),radial-gradient(420px 380px at 60% 100%,rgb(180 69 42/.45),transparent 70%)"></div>
    <div style="position:absolute;left:64px;top:84px;width:520px"><span class="pill">${vi ? "Dự án" : "Projects"}</span>
      <div class="serif" style="margin-top:24px;font-size:128px;line-height:.92">${vi ? "Hành<br>trình" : "The<br>journey"}</div>
      <p style="margin-top:22px;font-size:24px;line-height:1.4;opacity:.85">${vi ? "Những dự án tôi đã làm." : "Projects I have built."}</p></div>
    ${polaroid(shot(a, a.cover || a.shots[0].src), "right:380px;top:110px;width:340px;rotate:-8deg")}
    ${polaroid(shot(b, b.cover || b.shots[0].src), "right:70px;top:60px;width:360px;rotate:6deg")}
    ${polaroid(shot(c, c.cover || c.shots[0].src), "right:200px;top:300px;width:380px;rotate:-2deg")}
    <div class="url"><i></i>portfolio.hugowishpax.studio${vi ? "" : "/en"}/project</div></body>` });

  projects.forEach((project, index) => {
    const items = t.projectsPage.items[project.id] || {};
    const kind = t.projectsPage.kinds[project.kind] || project.kind;
    const cover = project.cover || project.shots[0].src;
    const second = project.shots.find((item) => item.src !== cover)?.src;
    pages.push({ name: `project-${project.id}-${lang}`, html: `<body style="background:#0b0c10;color:#f4f6fb">
      <img src="${shot(project, cover)}" style="position:absolute;inset:-60px;width:calc(100% + 120px);height:calc(100% + 120px);object-fit:cover;filter:blur(60px) saturate(1.3);opacity:.35">
      <div style="position:absolute;inset:0;background:linear-gradient(90deg,#0b0c10 30%,rgb(11 12 16/.4))"></div>
      <div style="position:absolute;left:64px;top:96px;width:470px">
        <span class="pill">${vi ? "Chặng" : "Stop"} ${String(index + 1).padStart(2, "0")}</span><span style="margin-left:14px;font-size:20px;font-weight:700;opacity:.8">${kind}</span>
        <div class="serif" style="margin-top:22px;font-size:${project.title.length > 18 ? 60 : project.title.length > 12 ? 70 : 84}px;line-height:1">${project.title}</div>
        <p style="margin-top:20px;font-size:23px;line-height:1.45;opacity:.85">${items.tagline || project.tagline}</p>
      </div>
      <div style="position:absolute;right:48px;top:92px;width:570px;rotate:-3deg">${browser(shot(project, cover), project.urlLabel || project.title)}</div>
      ${second ? polaroid(shot(project, second), "right:60px;bottom:30px;width:230px;rotate:7deg") : ""}
      <div class="url"><i></i>portfolio.hugowishpax.studio${vi ? "" : "/en"}</div></body>` });
  });
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "hugo-og-"));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${tmp}/profile`, "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ws;
for (let i = 0; i < 60 && !ws; i += 1) {
  try { ws = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((target) => target.type === "page")?.webSocketDebuggerUrl; } catch { /* Chrome still starting */ }
  await sleep(250);
}
const socket = new WebSocket(ws);
await new Promise((resolve) => { socket.onopen = resolve; });
let id = 0;
const pending = {};
socket.onmessage = (event) => { const message = JSON.parse(event.data); pending[message.id]?.(message.result); };
const send = (method, params = {}) => new Promise((resolve) => { pending[++id] = resolve; socket.send(JSON.stringify({ id, method, params })); });
await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 2, mobile: false });

for (const page of pages) {
  const file = path.join(tmp, `${page.name}.html`);
  fs.writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}</style></head>${page.html}</html>`);
  await send("Page.navigate", { url: pathToFileURL(file).href });
  await sleep(1800);
  await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))))", awaitPromise: true });
  const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 88 });
  fs.writeFileSync(path.join(out, `${page.name}.jpg`), Buffer.from(data, "base64"));
  console.log("og", page.name);
}
socket.close();
chrome.kill();
fs.rmSync(tmp, { recursive: true, force: true });
