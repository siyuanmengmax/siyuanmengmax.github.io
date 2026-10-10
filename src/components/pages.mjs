import { esc, external, route } from "./shared.mjs";
import { about, newsRow, projectCard } from "./home.mjs";
import { publications } from "./publications.mjs";

export function innerPage(data, lang, page) {
  const ui = data.site[lang],
    zh = lang === "zh";
  let meta = data.pages[lang][page],
    content;
  if (page === "publications") content = publications(data, lang, { archive: true });
  if (page === "projects")
    content = `<div class="project-grid">${data.projects.map((p) => projectCard(p, data, lang)).join("")}</div>`;
  if (page === "news") content = `<div class="news-list">${data.news.map((n) => newsRow(n, lang)).join("")}</div>`;
  if (page === "teaching") content = `<div class="prose">${meta.body}</div>`;
  if (page === "repositories")
    content = `<div class="prose"><h2>GitHub</h2><p>${
      zh
        ? "研究代码与开源项目请访问我的 GitHub 主页。"
        : "Visit my GitHub profile for research code and open-source projects."
    }</p><p>${external(
      `https://github.com/${data.site.github}`,
      `${esc(data.site.github)} ↗`,
      'class="text-link"',
    )}</p><h2>TPWM Lab</h2><p>${external(ui.lab.url, ui.lab.call_to_action, 'class="text-link"')}</p></div>`;
  if (page === "cv") {
    meta = {
      title: zh ? "个人履历" : "Curriculum vitae",
      description: zh ? "教育经历、研究方向、教学与学术服务。" : "Education, research, teaching, and academic service.",
    };
    content = `${about(data, lang)}<div class="actions"><a class="text-link" href="${route(lang, "publications")}">${
      ui.publications.archive
    }</a><a class="text-link" href="${route(lang, "projects")}">${
      ui.projects.archive
    }</a><a class="text-link" href="mailto:${data.site.email}">${data.site.email}</a></div>`;
  }
  if (page.startsWith("projects/")) {
    const project = data.projects.find((p) => `projects/${p.id}` === page);
    meta = project[lang];
    content = `<article class="prose">${meta.body}</article><div class="actions"><a class="text-link" href="${route(
      lang,
      "projects",
    )}">${ui.projects.archive}</a></div>`;
  }
  if (page.startsWith("news/")) {
    const item = data.news.find((n) => `news/${n.id}` === page);
    meta = { title: zh ? "研究动态" : "Research news", description: item.date };
    content = `<article class="prose">${item[lang]}</article><div class="actions"><a class="text-link" href="${route(
      lang,
      "news",
    )}">${ui.news.archive}</a></div>`;
  }
  if (!meta || content === undefined) throw new Error(`Unknown page: ${lang}/${page}`);
  const title = meta.title[0].toUpperCase() + meta.title.slice(1);
  return {
    page,
    title: `${title} · ${data.site.name}`,
    description: meta.description,
    body: `<div class="page-heading"><a class="breadcrumb" href="${route(lang)}">← ${
      zh ? "个人主页" : "Home"
    }</a><h1>${esc(title)}</h1>${meta.description ? `<p>${esc(meta.description)}</p>` : ""}</div>${content}`,
  };
}

export function notFound(data, assets) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found · ${esc(
    data.site.name,
  )}</title><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="${
    assets["/assets/portfolio/portfolio.css"]
  }"></head><body><main class="wrap"><section class="section"><div class="eyebrow">404</div><h1>Page not found</h1><p lang="zh-CN">页面不存在，请通过以下链接继续浏览。</p><div class="actions"><a class="primary" href="/">English home</a><a class="text-link" href="/zh/" lang="zh-CN">中文主页</a></div></section></main></body></html>`;
}
