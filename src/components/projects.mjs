import { esc, external, repositoryLink, route } from "./shared.mjs";
import { publication, publicationStatus } from "./publications.mjs";

export function projectPapers(project, data) {
  return (project.publication_ids || []).map((id) => {
    const record = data.publications.find((paper) => paper.id === id);
    if (!record) throw new Error(`Project ${project.id}: missing publication ${id}`);
    return publication(record);
  });
}

function citation(paper, lang) {
  const venue = lang === "zh" && paper.zh ? paper.zh.venue : paper.venue;
  // Online-first records may use 0(0) before an issue is assigned.
  const volume = paper.volume && paper.volume !== "0" ? paper.volume : "";
  const issue = volume && paper.number && paper.number !== "0" ? `(${Number(paper.number)})` : "";
  return `${esc(venue)}${volume ? `, ${esc(volume)}${esc(issue)}` : ""}${
    paper.pages ? `, ${esc(paper.pages.replaceAll("--", "–"))}` : ""
  } (${esc(paper.year)})`;
}

export function projectStatus(project, data, lang, { compact = false } = {}) {
  const paper = projectPapers(project, data)[0];
  if (!paper) return "";
  return `<p class="project-status"><strong>${lang === "zh" ? "论文状态：" : "Paper status:"}</strong> ${
    publicationStatus(paper, lang)
  } · ${compact ? esc(paper.year) : citation(paper, lang)}</p>`;
}

export function projectCode(project, data, lang) {
  const repositories = new Set(projectPapers(project, data).map((paper) => paper.repository).filter(Boolean));
  return [...repositories].map((url) => repositoryLink(url, lang)).join("");
}

export function projectReferences(project, data, lang) {
  const papers = projectPapers(project, data);
  if (!papers.length) return "";
  return `<h2>${lang === "zh" ? "相关论文" : "Related publications"}</h2><ul>${papers
    .map((paper) => {
      const localized = lang === "zh" && paper.zh;
      const title = localized ? paper.zh.title : paper.title;
      const authors = localized
        ? paper.zh.authors.map((name) => ({ name, self: name === "蒙思源" }))
        : paper.authors;
      const authorText = authors
        .map((a) => (a.self ? `<strong>${esc(a.name)}</strong>` : esc(a.name)))
        .join(localized ? "，" : ", ");
      const link = paper.url
        ? external(paper.url, esc(title))
        : `<a href="${route(lang, "publications")}#paper-${paper.id}">${esc(title)}</a>`;
      return `<li>${authorText}. ${link}. <em>${citation(paper, lang)}</em>. ${publicationStatus(paper, lang)}.</li>`;
    })
    .join("")}</ul>`;
}
