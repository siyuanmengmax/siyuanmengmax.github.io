export const esc = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
export const prefix = (lang) => (lang === "zh" ? "/zh" : "");
export const route = (lang, page = "") => `${prefix(lang)}/${page ? `${page}/` : ""}`;
export const external = (url, label, attributes = "") =>
  `<a href="${esc(url)}" target="_blank" rel="noopener" ${attributes}>${label}</a>`;
export const heading = (section, id) =>
  `<div class="section-head"><div><div class="eyebrow">${section.eyebrow}</div><h2 id="${id}">${
    section.title
  }</h2></div>${section.intro ? `<p>${section.intro}</p>` : ""}</div>`;

export function navigation(data, lang, page = "") {
  const ui = data.site[lang],
    home = !page;
  const labels =
    lang === "zh"
      ? ["关于我", "论文成果", "研究项目", "代码仓库", "教学经历", "动态"]
      : ["About", "Publications", "Projects", "Code", "Teaching", "News"];
  const paths = ["#about", "publications/", "projects/", "repositories/", "teaching/", "news/"];
  const links = home ? ui.nav : paths.map((path, i) => ({ href: `${route(lang)}${path}`, label: labels[i] }));
  return `<header><nav class="wrap" aria-label="${esc(ui.navigation_label)}">
  <a class="logo" href="${route(lang)}">MAX MENG<span>${esc(data.site.name_zh)}</span></a>
  <div class="links">${links
    .map(
      (link) =>
        `<a href="${esc(link.href)}"${link.href === "#contact" ? ' class="nav-contact"' : ""}${
          page && link.href === route(lang, page) ? ' aria-current="page"' : ""
        }>${esc(link.label)}</a>`,
    )
    .join("")}
  ${external(ui.lab.url, esc(ui.lab.label), `title="${esc(ui.lab.title)}"`)}
  <a class="language-switch" data-language="${lang === "zh" ? "en" : "zh-CN"}" href="${route(
    lang === "zh" ? "en" : "zh",
    page,
  )}" lang="${lang === "zh" ? "en" : "zh-CN"}" hreflang="${lang === "zh" ? "en" : "zh-CN"}" aria-label="${esc(
    ui.language_accessible,
  )}">${ui.language_label}</a>
  </div></nav></header>`;
}

export function footer(data, lang) {
  return `<footer><div class="wrap footer-inner"><span>© ${new Date().getUTCFullYear()} ${esc(data.site.name)} · ${esc(
    data.site.name_zh,
  )}</span>
  <div class="social">${data.site.socials
    .map((link) => external(link.url, `${esc(link.label)} ↗`))
    .join("")}<a href="mailto:${esc(data.site.email)}">${data.site[lang].email} ↗</a></div></div></footer>`;
}

export function document(data, lang, { page = "", title, description, body, home = false }, assets) {
  const ui = data.site[lang];
  const url = route(lang, page);
  const origin = data.site.url.replace(/\/$/, "");
  const asset = (name) => esc(assets[name] || name);
  const label = title || `${data.site.name} · ${ui.research.title}`;
  return `<!doctype html>
<html lang="${lang === "zh" ? "zh-CN" : "en"}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(label)}</title><meta name="description" content="${esc(description || (lang === "zh" ? ui.hero.intro : data.site.description))}">
<link rel="canonical" href="${origin}${url}">
<link rel="alternate" hreflang="en" href="${origin}${route("en", page)}">
<link rel="alternate" hreflang="zh-CN" href="${origin}${route("zh", page)}">
<link rel="alternate" hreflang="x-default" href="${origin}${route("en", page)}">
<meta property="og:title" content="${esc(label)}"><meta property="og:description" content="${esc(
    description || ui.hero.intro,
  )}"><meta property="og:type" content="website">
<meta property="og:url" content="${origin}${url}"><meta property="og:image" content="${origin}${
    data.profile.image
  }"><meta name="theme-color" content="#f5f4ef">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"><link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="${asset("/assets/portfolio/portfolio.css")}">
${
  lang === "en"
    ? `<link rel="preload" href="/assets/fonts/inter/InterVariable.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${asset(
        "/assets/portfolio/english-typography.css",
      )}">`
    : `<link rel="stylesheet" href="${asset("/assets/css/chinese-typography.css")}">`
}
<script defer src="${asset("/assets/site.js")}"></script>
${
  home
    ? `<script defer src="${asset("/assets/portfolio/scene.js")}"></script><script defer src="${asset(
        "/assets/portfolio/research-demo.js",
      )}"></script>`
    : ""
}
</head><body class="${lang === "zh" ? "zh " : ""}${home ? "" : "inner-page"}">
<a class="skip-link" href="#main">${ui.skip}</a>${navigation(data, lang, page)}
<main class="wrap" id="main">${body}</main>${footer(data, lang)}</body></html>`;
}
