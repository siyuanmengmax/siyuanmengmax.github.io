import { esc, external, heading, route } from "./shared.mjs";
import { publications, sortedPapers } from "./publications.mjs";

export const newsRow = (item, lang) =>
  `<div class="news-row"><time datetime="${item.date}">${item.date}</time><div>${item[lang]}</div></div>`;
export const projectCard = (p, data, lang) =>
  `<article class="project-item"><span class="eyebrow">${
    data.pages[lang].categories[p.category] || esc(p.category)
  }</span><h3>${esc(p[lang].title)}</h3><p>${esc(p[lang].description)}</p><a class="text-link" href="${route(
    lang,
    `projects/${p.id}`,
  )}">${data.site[lang].projects.details} ↗</a></article>`;

export function framework(data, lang) {
  const ui = data.site[lang].framework,
    stages = data.framework[lang],
    papers = sortedPapers(data);
  return `<section class="section framework" id="framework" aria-labelledby="framework-title">${heading(
    ui,
    "framework-title",
  )}
  <div class="framework-steps" role="group" aria-label="${ui.choose}">${stages
    .map(
      (s, i) =>
        `<button type="button" class="stage-button${i === 0 ? " active" : ""}" data-stage="${i}" aria-pressed="${
          i === 0
        }" aria-controls="study-view"><span class="step-number">0${i + 1}</span><strong>${
          s.heading
        }</strong><span class="step-method">${s.method}</span><span class="step-description">${
          s.summary
        }</span></button>`,
    )
    .join("")}</div>
  <div class="quality-band"><strong>${ui.quality_label}</strong><span>${ui.quality}</span></div>
  <div class="study-view" id="study-view"><div class="study-visual"><div class="demo-top"><span id="demo-stage-label">${
    stages[0].method
  }</span><span>${ui.scene_label}</span></div>
  <canvas id="study-canvas" role="img" aria-label="${ui.canvas_label}" data-caption="${ui.canvas_caption}"></canvas>
  <div class="demo-controls"><button id="study-pause" type="button" aria-pressed="false" data-pause="${
    ui.pause
  }" data-play="${ui.play}">${
    ui.pause
  }</button><label><input id="study-overlay" type="checkbox" checked><span id="overlay-label">${
    stages[0].overlay
  }</span></label></div></div>
  <div class="study-copy" aria-live="polite">${stages
    .map((s, i) => {
      const paper = papers.find((p) => p.id === s.paper_key);
      return `<div class="study-panel" data-method="${esc(s.method)}" data-overlay="${esc(s.overlay)}"${
        i ? " hidden" : ""
      }><div class="eyebrow">${ui.study_label} 0${i + 1}</div><h3>${s.title}</h3><p>${
        s.description
      }</p><div class="study-question"><span>${ui.question_label}</span><p>${s.quality}</p></div>${
        paper.url
          ? external(paper.url, s.link, 'class="text-link"')
          : `<a class="text-link" href="#paper-${s.paper_key}">${s.link}</a>`
      }</div>`;
    })
    .join("")}<p class="demo-disclaimer">${ui.disclaimer}</p></div></div><p class="framework-note">${ui.note}</p>
  <noscript><style>.study-panel[hidden]{display:block!important;margin-top:2rem}.demo-controls,.framework-steps{display:none}</style><p class="framework-note">${
    data.site[lang].no_js
  }</p></noscript></section>`;
}

export function about(data, lang) {
  const ui = data.site[lang],
    p = data.profile.locales[lang];
  return `<section class="section" id="about" aria-labelledby="about-title">${heading(ui.about, "about-title")}
  <div class="about-grid"><div class="about-copy"><div class="profile-block"><img src="${
    data.profile.image
  }" alt="${esc(data.site.name)}" width="150" height="200" loading="lazy"><div><h3>${esc(
    data.site.name,
  )}</h3><p lang="zh-CN">${data.site.name_zh}</p><p>${p.role}</p></div></div>
  ${p.bio.map((text) => `<p>${text}</p>`).join("")}${
    data.profile.show_appointment
      ? `<div class="next"><div class="eyebrow">${ui.about.next}</div><p>${p.appointment}</p></div>`
      : ""
  }</div>
  <div class="education">${p.education
    .map(
      (d) => `<div class="edu"><span>${d.years}</span><strong>${d.institution}</strong><p>${d.description}</p></div>`,
    )
    .join("")}<div class="edu"><strong>${p.teaching_title}</strong><p>${
    p.teaching
  }</p><a class="text-link" href="${route(lang, "teaching")}">${ui.about.teaching_link}</a></div></div></div>
  <div class="background-grid">${p.background
    .map((b) => `<article><div class="eyebrow">${b.title}</div>${b.html}</article>`)
    .join("")}</div></section>`;
}

export function home(data, lang) {
  const ui = data.site[lang],
    p = data.profile.locales[lang],
    v = ui.research.vision;
  const visionPaper = sortedPapers(data).find((p) => p.id === v.paper_key);
  return `<section class="hero" aria-labelledby="hero-title"><div><div class="eyebrow availability"><span class="dot"></span>${
    ui.hero.eyebrow
  }</div>
  <h1 id="hero-title">${ui.hero.title}</h1><p class="intro">${ui.hero.intro}</p>
  <div class="hero-identity"><img src="${data.profile.image}" width="54" height="66" alt="${esc(
    data.site.name,
  )}" fetchpriority="high"><div><strong>${esc(data.site.name)} <span lang="zh-CN">${
    data.site.name_zh
  }</span></strong><p>${p.role}</p>${data.profile.show_appointment ? `<p>${p.appointment_short}</p>` : ""}</div></div>
  <div class="actions"><a class="primary" href="#framework">${
    ui.hero.primary
  } <span class="arrow">↘</span></a><a class="text-link" href="#contact">${ui.hero.secondary}</a></div></div>
  <div class="visual"><div class="visual-top"><span>${ui.scene.title}</span><span>${
    ui.scene.sensors
  }</span></div><canvas id="scene" role="img" aria-label="${ui.scene.alt}"></canvas><div class="visual-bottom"><p>${
    ui.scene.caption
  }<br><span class="scene-disclaimer">${
    ui.scene.disclaimer
  }</span></p><button id="pause" type="button" aria-pressed="false" data-pause="${ui.scene.pause}" data-play="${
    ui.scene.play
  }">${ui.scene.pause}</button></div></div></section>
  <div class="affiliation"><span><strong>${p.affiliation}</strong> · ${p.degree}</span>${
    data.profile.show_appointment ? `<span>${p.appointment}</span>` : ""
  }</div>
  <section class="section" id="research" aria-labelledby="research-title">${heading(
    ui.research,
    "research-title",
  )}<div class="research-grid">${ui.research.directions
    .map(
      (d) =>
        `<article class="research-item"><span class="number">${d.number}</span><h3>${d.title}</h3><p>${
          d.description
        }</p><div class="tags">${d.tags.map((tag) => `<span>${tag}</span>`).join("")}</div></article>`,
    )
    .join("")}</div>
  <div class="vision"><div><div class="eyebrow">${v.eyebrow}</div><h3>${v.title}</h3><p>${v.description}</p>${external(
    visionPaper.url,
    v.link,
    'class="text-link"',
  )}</div><div class="vision-note"><span>${v.breadth}</span><strong>${v.motto}</strong><span>${
    v.depth
  }</span></div></div></section>
  ${framework(data, lang)}
  <section class="section" id="projects" aria-labelledby="projects-title">${heading(
    ui.projects,
    "projects-title",
  )}<div class="project-grid">${data.projects
    .map((p) => projectCard(p, data, lang))
    .join("")}</div><div class="actions"><a class="text-link" href="${route(lang, "projects")}">${
    ui.projects.archive
  }</a></div></section>
  ${publications(data, lang)}${about(data, lang)}
  <section class="section" id="news" aria-labelledby="news-title">${heading(ui.news, "news-title")}${data.news
    .slice(0, 4)
    .map((n) => newsRow(n, lang))
    .join("")}
  ${
    data.news.length > 4
      ? `<details class="news-archive"><summary>${ui.news.earlier}<span>+</span></summary>${data.news
          .slice(4)
          .map((n) => newsRow(n, lang))
          .join("")}</details>`
      : ""
  }
  <div class="actions"><a class="text-link" href="${route(lang, "news")}">${ui.news.archive}</a></div></section>
  <section class="contact" id="contact" aria-labelledby="contact-title"><div><div class="eyebrow">${
    ui.contact.eyebrow
  }</div><h2 id="contact-title">${ui.contact.title}</h2><p>${ui.contact.description}</p><p>${external(
    ui.lab.url,
    ui.lab.call_to_action,
    `class="text-link" title="${esc(ui.lab.title)}"`,
  )}</p></div><a class="primary" href="mailto:${data.site.email}">${ui.contact.button}</a></section>`;
}
