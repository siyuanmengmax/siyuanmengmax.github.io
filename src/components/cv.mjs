import { esc, heading, route } from "./shared.mjs";

export function cvDownloads(data, lang) {
  const ui = data.site[lang].cv;
  const languages = lang === "zh" ? ["zh", "en"] : ["en", "zh"];
  return `<div class="cv-downloads" role="group" aria-label="${esc(ui.downloads_label)}">${languages
    .map(
      (language, index) =>
        `<a class="${index === 0 ? "primary" : "text-link"}" href="/cv/cv_${language}.pdf" download="Siyuan-Meng-CV-${language.toUpperCase()}.pdf" type="application/pdf" hreflang="${language === "zh" ? "zh-CN" : "en"}">${esc(ui[`download_${language}`])}</a>`,
    )
    .join("")}</div>`;
}

export function cvSection(data, lang) {
  const ui = data.site[lang].cv;
  return `<section class="section" id="cv" aria-labelledby="cv-title">${heading(ui, "cv-title")}
  <div class="cv-panel">${cvDownloads(data, lang)}<a class="text-link" href="${route(lang, "cv")}">${esc(ui.online)}</a></div></section>`;
}
