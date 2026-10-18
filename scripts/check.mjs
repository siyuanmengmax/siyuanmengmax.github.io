import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { innerPage } from "../src/components/pages.mjs";
import { projectCard } from "../src/components/home.mjs";
import { esc } from "../src/components/shared.mjs";
import { paperCard, publication, titleCase } from "../src/components/publications.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const read = (name) => fs.readFile(path.join(dist, name), "utf8");
const content = async (name) => JSON.parse(await fs.readFile(path.join(root, "src/content", `${name}.json`), "utf8"));
const manifest = JSON.parse(await read("build-manifest.json"));
const [site, publications, projects, news] = await Promise.all(
  ["site", "publications", "projects", "news"].map(content),
);
const htmlByRoute = new Map();
for (const url of manifest.routes) htmlByRoute.set(url, await read(url.slice(1) + "index.html"));
const idsByRoute = new Map(
  [...htmlByRoute].map(([url, html]) => [url, [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])]),
);
let references = 0;
for (const [url, html] of htmlByRoute) {
  const lang = url.startsWith("/zh/") ? "zh" : "en";
  const ids = idsByRoute.get(url);
  assert.equal(ids.length, new Set(ids).size, `${url}: duplicate IDs`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${url}: expected one h1`);
  assert(html.includes(`lang="${lang === "zh" ? "zh-CN" : "en"}"`), `${url}: wrong language`);
  assert(html.includes(`href="${site[lang].lab.url}"`), `${url}: missing localized lab link`);
  assert(!html.includes("{%") && !html.includes("{{"), `${url}: unrendered template`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1].replaceAll("&amp;", "&");
    const target = new URL(raw, site.url + url);
    if (target.origin === new URL(site.url).origin && !target.pathname.startsWith("/tpwm-lab/")) {
      const file = path.join(dist, decodeURIComponent(target.pathname));
      const stat = await fs.stat(file).catch(() => {
        throw new Error(`${url}: missing ${raw}`);
      });
      if (stat.isDirectory()) await fs.access(path.join(file, "index.html"));
      if (target.hash && idsByRoute.has(target.pathname)) {
        assert(
          idsByRoute.get(target.pathname).includes(decodeURIComponent(target.hash.slice(1))),
          `${url}: missing anchor ${raw}`,
        );
      }
    }
    references++;
  }
  if (["/", "/zh/", "/publications/", "/zh/publications/"].includes(url)) {
    assert.equal((html.match(/class="pub"/g) || []).length, publications.length, `${url}: publication count`);
    for (const p of publications) {
      assert(ids.includes(`paper-${p.id}`) && ids.includes(p.id), `${url}: lost publication anchor ${p.id}`);
      if (lang === "zh" && p.zh) assert(html.includes(p.zh.title), `${url}: untranslated Chinese paper`);
      const card = html.split(`id="paper-${p.id}"`)[1].split("</article>")[0];
      assert.equal(card.includes('class="text-link code-link"'), Boolean(p.repository), `${url}/${p.id}: code availability`);
      if (p.repository) {
        assert(card.includes(`href="${esc(p.repository)}"`), `${url}/${p.id}: wrong code repository`);
        assert(card.includes(lang === "zh" ? "GitHub 代码 ↗" : "GitHub code ↗"), `${url}/${p.id}: code label language`);
        if (p.fields.doi) assert(card.includes(`href="https://doi.org/${p.fields.doi}"`), `${p.id}: code replaced paper link`);
      }
    }
    assert(html.includes('id="paper-search"') && html.includes('id="no-papers"'));
  }
  const alternate = url.startsWith("/zh/") ? url.slice(3) : "/zh" + url;
  assert(html.includes(`href="${site.url}${alternate}"`), `${url}: wrong alternate route`);
}
for (const p of publications) {
  assert(p.fields.title && p.fields.author && /^\d{4}$/.test(p.fields.year), `Incomplete publication: ${p.id}`);
  assert(["article", "inproceedings", "incollection", "conference", "unpublished"].includes(p.type));
}
for (const lang of ["en", "zh"]) {
  const prefix = lang === "zh" ? "/zh" : "";
  const homepage = htmlByRoute.get(`${prefix}/`);
  const cv = htmlByRoute.get(`${prefix}/cv/`);
  assert(homepage.includes('id="cv"'), `${lang}: missing homepage CV section`);
  assert(homepage.includes(`href="${prefix}/cv/"`), `${lang}: missing online CV link`);
  assert(cv.includes(`href="${prefix}/cv/" aria-current="page"`), `${lang}: missing active CV navigation`);
  for (const html of [homepage, cv]) {
    const downloads = [...html.matchAll(/href="(\/cv\/cv_(en|zh)\.pdf)" download="([^"]+)"/g)];
    assert.deepEqual(downloads.map((match) => match[2]), lang === "zh" ? ["zh", "en"] : ["en", "zh"],
      `${lang}: CV downloads must list the page language first, with both PDFs available`);
  }
  const pdf = await fs.readFile(path.join(dist, "cv", `cv_${lang}.pdf`));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-", `${lang}: invalid CV PDF`);
  assert.deepEqual(pdf, await fs.readFile(path.join(root, "public/cv", `cv_${lang}.pdf`)),
    `${lang}: published CV differs from the supplied PDF`);
}
for (const project of projects) {
  const ids = project.publication_ids || [];
  assert.equal(ids.length, new Set(ids).size, `${project.id}: duplicate publication links`);
  for (const id of ids) {
    const paper = publications.find((p) => p.id === id);
    assert(paper, `${project.id}: missing publication ${id}`);
    for (const lang of ["en", "zh"]) {
      const html = htmlByRoute.get(`${lang === "zh" ? "/zh" : ""}/projects/${project.id}/`);
      const title = lang === "zh" && paper.zh ? paper.zh.title : titleCase(paper.fields.title);
      assert(html.includes(esc(title)), `${project.id}/${lang}: missing current paper title`);
      if (paper.fields.doi)
        assert(html.includes(`href="https://doi.org/${esc(paper.fields.doi)}"`), `${project.id}: missing DOI`);
      if (paper.repository) {
        for (const view of [html, htmlByRoute.get(`${lang === "zh" ? "/zh" : ""}/repositories/`)])
          assert(view.includes(`href="${esc(paper.repository)}"`), `${project.id}/${lang}: missing project repository`);
      }
    }
  }
  if (ids.length)
    for (const lang of ["en", "zh"])
      assert(!/<strong>(?:Status:|状态：)/.test(project[lang].body), `${project.id}: duplicated paper status`);
}
// A publication update must reach project cards and details without editing project content.
const linkedProject = projects.find((p) => p.publication_ids?.length);
assert(linkedProject, "Expected a project linked to publications");
const fixture = { site, pages: await content("pages"), projects, publications: structuredClone(publications) };
const changedPaper = fixture.publications.find((p) => p.id === linkedProject.publication_ids[0]);
delete changedPaper.zh;
changedPaper.fields = {
  title: "Updated research title", author: "Meng, Siyuan", journal: "Updated journal",
  year: "2030", note: "Under Review",
};
for (const [note, year, labels] of [
  ["Under Review", "2030", ["Under review", "审稿中"]],
  ["Under Review after Major Revision", "2030", ["Under review after major revision", "大修后在审"]],
  ["Submitted", "2030", ["Submitted", "已投稿"]],
  ["", "2031", ["Published", "已发表"]],
]) {
  Object.assign(changedPaper.fields, { note, year });
  if (!note) Object.assign(changedPaper.fields, { doi: "10.1000/project-sync", volume: "0", number: "0" });
  for (const [index, lang] of ["en", "zh"].entries()) {
    const paper = publication(changedPaper);
    const category = note ? "manuscripts" : "journals";
    assert.equal(paper.category, category, `${note || "Published"}: wrong publication category`);
    const paperHtml = paperCard(paper, site[lang].publications, lang);
    assert(paperHtml.includes(`data-category="${category}"`));
    if (note) assert(paperHtml.includes(labels[index]), `${lang}: missing localized manuscript status`);
    const detail = innerPage(fixture, lang, `projects/${linkedProject.id}`).body;
    const card = projectCard(linkedProject, fixture, lang);
    for (const html of [detail, card]) assert(html.includes(`${labels[index]} · `) && html.includes(year));
    assert(detail.includes("Updated Research Title") && detail.includes("Updated journal"));
    assert(!detail.includes("0(0)"), "Unassigned volume/issue must not appear as 0(0)");
    assert(detail.includes(note ? `#paper-${changedPaper.id}` : "https://doi.org/10.1000/project-sync"));
  }
}
// Repository changes propagate through publications and projects independently of citation fields.
for (const repository of ["https://github.com/example/updated-code", undefined]) {
  changedPaper.repository = repository;
  for (const lang of ["en", "zh"]) {
    const views = [
      paperCard(publication(changedPaper), site[lang].publications, lang),
      projectCard(linkedProject, fixture, lang),
      innerPage(fixture, lang, `projects/${linkedProject.id}`).body,
      innerPage(fixture, lang, "repositories").body,
    ];
    for (const html of views)
      assert.equal(html.includes('href="https://github.com/example/updated-code"'), Boolean(repository),
        `${lang}: changed or removed repository did not propagate`);
  }
}
for (const lang of ["en", "zh"]) {
  const download = `/assets/portfolio/publications${lang === "zh" ? "-zh" : ""}.bib`;
  const bib = await read(download.slice(1));
  const entries = [...bib.matchAll(/^@(\w+)\{([^,]+),\n([\s\S]*?)^\}\n/gm)];
  assert.equal(entries.length, publications.length, `${lang}: BibTeX count`);
  assert(!bib.includes("<html"), "BibTeX must remain plain text");
  assert.equal(new Set(entries.map((entry) => entry[2])).size, publications.length, `${lang}: BibTeX IDs`);
  const prefix = lang === "zh" ? "/zh" : "";
  for (const url of [`${prefix}/`, `${prefix}/publications/`]) {
    const html = htmlByRoute.get(url);
    assert(html.includes(`href="${download}" download`), `${url}: wrong BibTeX download`);
    for (const [entry, type, id, body] of entries) {
      const paper = publications.find((p) => p.id === id);
      assert(paper, `${lang}: unknown BibTeX ID ${id}`);
      assert.equal(type, paper.type, `${id}: BibTeX type`);
      const fields = Object.fromEntries([...body.matchAll(/^  (\w+) = \{(.*)\},?$/gm)].map((m) => [m[1], m[2]]));
      if (lang === "zh" && paper.zh) {
        assert.equal(fields.title, paper.zh.title, `${id}: Chinese BibTeX title`);
        assert.deepEqual(fields.author.split(" and "), paper.zh.authors, `${id}: Chinese BibTeX authors`);
        assert.equal(fields.journal || fields.booktitle, paper.zh.venue, `${id}: Chinese BibTeX venue`);
        assert.equal(fields.note, "中文", `${id}: Chinese language note`);
        for (const key of ["doi", "year", "volume", "number", "pages"])
          assert.equal(fields[key], paper.fields[key], `${id}: changed ${key}`);
      } else {
        assert.deepEqual(fields, paper.fields, `${id}: original BibTeX metadata changed`);
      }
      const card = html.split(`id="paper-${id}"`)[1]?.split("</article>")[0];
      assert(card?.includes(`<pre>${esc(entry)}</pre>`), `${url}/${id}: inline and downloaded BibTeX differ`);
    }
  }
}
for (const [original, versioned] of Object.entries(manifest.assets)) {
  const bytes = await fs.readFile(path.join(dist, original));
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  assert(versioned.includes(`.${hash}.`), `Stale asset hash: ${original}`);
  assert.deepEqual(bytes, await fs.readFile(path.join(dist, versioned)));
}
async function files(folder) {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) => (e.isDirectory() ? files(path.join(folder, e.name)) : [path.join(folder, e.name)])),
    )
  ).flat();
}
for (const folder of ["scripts", "src/components", "public"]) {
  for (const file of await files(path.join(root, folder))) {
    if (/\.(mjs|js)$/.test(file)) execFileSync(process.execPath, ["--check", file]);
    if (file.endsWith(".css")) {
      const css = await fs.readFile(file, "utf8");
      for (const [, url] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        if (!url.startsWith("data:") && !/^https?:/.test(url)) await fs.access(path.resolve(path.dirname(file), url));
      }
    }
  }
}
for (const removed of ["Gemfile", "_config.yml", "_posts", "node_modules", ".DS_Store"])
  await assert.rejects(fs.access(path.join(dist, removed)));
await fs.access(path.join(dist, ".nojekyll"));
await fs.access(path.join(dist, "404.html"));
await fs.access(path.join(dist, "sitemap.xml"));
assert.equal(manifest.counts.projects, projects.length);
assert.equal(manifest.counts.news, news.length);
console.log(
  `PASS: ${manifest.routes.length} bilingual pages; ${references} references; ${publications.length} publications, ${projects.length} projects, ${news.length} news items; localized BibTeX, project/publication synchronization, metadata, legacy anchors, asset hashes, fonts, and JavaScript syntax.`,
);
