import { esc, external, route } from "./shared.mjs";

export function publication(record) {
  const f = record.fields,
    venue = f.journal || f.booktitle || "";
  const category =
    /under review|submitting|in preparation|ongoing/i.test(f.note || "") || record.type === "unpublished"
      ? "manuscripts"
      : /arxiv|preprint/i.test(venue) || f.arxiv
        ? "preprints"
        : ["inproceedings", "incollection", "conference"].includes(record.type)
          ? "conferences"
          : "journals";
  const authors = f.author.split(/\s+and\s+/).map((author) => {
    const parts = author.split(",").map((p) => p.trim());
    const name = parts.length === 2 ? `${parts[1]} ${parts[0]}` : author;
    return { name, self: name === "Siyuan Meng" };
  });
  return {
    ...record,
    ...f,
    venue,
    category,
    authors,
    url: f.doi
      ? `https://doi.org/${f.doi}`
      : record.url || f.html || (f.arxiv ? `https://arxiv.org/abs/${f.arxiv}` : null),
    bibtex: `@${record.type}{${record.id},\n${Object.entries(f)
      .map(([key, value]) => `  ${key} = {${value}}`)
      .join(",\n")}\n}\n`,
  };
}

export const sortedPapers = (data) =>
  data.publications.map(publication).sort((a, b) => Number(b.year) - Number(a.year));

export function paperCard(paper, ui, lang) {
  const zh = lang === "zh" && paper.zh;
  const title = zh ? zh.title : paper.title;
  const authors = zh ? zh.authors.map((name) => ({ name, self: name === "蒙思源" })) : paper.authors;
  const venue = zh
    ? `${zh.venue}，${paper.year}${
        paper.volume ? `，${paper.volume}${paper.number ? `(${Number(paper.number)})` : ""}` : ""
      }${paper.pages ? `：${paper.pages.replaceAll("--", "–")}` : ""}`
    : `${paper.venue}${paper.note ? ` · ${paper.note}` : ""}`;
  return `<article class="pub" id="paper-${paper.id}" data-category="${paper.category}">
  <div class="year">${paper.year}</div><div class="pub-copy" id="${paper.id}"><h3>${esc(title)}</h3>
  <p>${authors.map((a) => (a.self ? `<strong>${esc(a.name)}</strong>` : esc(a.name))).join(zh ? "，" : ", ")}</p>
  <p class="venue">${esc(venue)}</p><details class="citation"><summary>BibTeX</summary><pre>${esc(
    paper.bibtex,
  )}</pre></details></div>
  ${
    paper.url ? external(paper.url, "↗", `class="paper-link" aria-label="${esc(`${ui.read}: ${title}`)}"`) : ""
  }</article>`;
}

export function publications(data, lang, { archive = false } = {}) {
  const ui = data.site[lang].publications,
    papers = sortedPapers(data);
  return `<section class="section" id="publications" ${
    archive ? `aria-label="${ui.search_label}"` : 'aria-labelledby="publications-title"'
  }>
  <div class="section-head">${
    archive ? "" : `<div><div class="eyebrow">${ui.eyebrow}</div><h2 id="publications-title">${ui.title}</h2></div>`
  }
  <div class="pub-controls" role="group" aria-label="${ui.filter_label}">${ui.filters
    .map(
      (f, i) =>
        `<button type="button" class="filter${i === 0 ? " active" : ""}" data-filter="${f.id}" aria-pressed="${
          i === 0
        }">${f.label}</button>`,
    )
    .join("")}</div></div>
  <div class="publication-search"><label for="paper-search">${
    ui.search_label
  }</label><input id="paper-search" type="search" placeholder="${
    ui.placeholder
  }" autocomplete="off"><span id="paper-count" role="status" data-suffix="${ui.count_suffix}">${papers.length} ${
    ui.count_suffix
  }</span></div>
  <div id="papers">${papers.map((p) => paperCard(p, ui, lang)).join("")}</div><p id="no-papers" hidden>${ui.empty}</p>
  <div class="actions"><a class="text-link" href="/assets/portfolio/publications.bib" download>${
    ui.download
  }</a>${external(data.site.scholar, "Google Scholar ↗", 'class="text-link"')}
  ${archive ? "" : `<a class="text-link" href="${route(lang, "publications")}">${ui.archive}</a>`}</div></section>`;
}
