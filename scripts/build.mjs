import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { document, esc, route } from "../src/components/shared.mjs";
import { home } from "../src/components/home.mjs";
import { innerPage, notFound } from "../src/components/pages.mjs";
import { sortedPapers } from "../src/components/publications.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const names = ["site", "profile", "framework", "publications", "projects", "news", "pages"];
const data = Object.fromEntries(
  await Promise.all(
    names.map(async (name) => [
      name,
      JSON.parse(await fs.readFile(path.join(root, "src/content", `${name}.json`), "utf8")),
    ]),
  ),
);
data.site.url = (process.env.SITE_URL || data.site.url).replace(/\/+$/, "");
const origin = new URL(data.site.url);
if (
  origin.protocol !== "https:" ||
  origin.pathname !== "/" ||
  origin.search ||
  origin.hash ||
  origin.username ||
  origin.password
)
  throw new Error("SITE_URL must be an HTTPS origin. Existing pages use root-relative URLs.");
for (const collection of ["publications", "projects", "news"]) {
  const ids = data[collection].map((item) => item.id);
  if (ids.length !== new Set(ids).size || ids.some((id) => !/^[a-zA-Z0-9_-]+$/.test(id)))
    throw new Error(`Invalid or duplicate ${collection} IDs.`);
}
const papers = sortedPapers(data);
for (const lang of ["en", "zh"]) {
  for (const key of [...data.framework[lang].map((s) => s.paper_key), data.site[lang].research.vision.paper_key]) {
    if (!papers.some((p) => p.id === key)) throw new Error(`Missing publication ${key}`);
  }
}

const dist = path.join(root, "dist"),
  stage = path.join(root, ".dist-build");
await fs.rm(stage, { recursive: true, force: true });
await fs.cp(path.join(root, "public"), stage, {
  recursive: true,
  filter: (source) => path.basename(source) !== ".DS_Store",
});
const write = async (name, text) => {
  const target = path.join(stage, name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, text);
};
await write(".nojekyll", "");
const assets = {};
const fingerprinted = [
  "assets/portfolio/portfolio.css",
  "assets/portfolio/english-typography.css",
  "assets/css/chinese-typography.css",
  "assets/site.js",
  "assets/portfolio/scene.js",
  "assets/portfolio/research-demo.js",
];
for (const name of fingerprinted) {
  const source = await fs.readFile(path.join(stage, name));
  const ext = path.extname(name),
    hash = createHash("sha256").update(source).digest("hex").slice(0, 12);
  const filename = `${name.slice(0, -ext.length)}.${hash}${ext}`;
  await write(filename, source);
  assets[`/${name}`] = `/${filename}`;
}
// Keep the old homepage script URL usable during the short HTML cache transition.
await write(
  "assets/portfolio/portfolio.js",
  (await fs.readFile(path.join(stage, "assets/site.js"), "utf8")) +
    "\n" +
    (await fs.readFile(path.join(stage, "assets/portfolio/scene.js"), "utf8")),
);
await write("assets/js/language.js", "/* Language handling is included in the portfolio script. */\n");
await write("assets/portfolio/publications.bib", papers.map((p) => p.bibtex).join("\n"));
const routes = [];
const pages = [
  "publications",
  "projects",
  "repositories",
  "teaching",
  "news",
  "cv",
  ...data.projects.map((p) => `projects/${p.id}`),
  ...data.news.map((n) => `news/${n.id}`),
];
for (const lang of ["en", "zh"]) {
  for (const page of ["", ...pages]) {
    const url = route(lang, page);
    const options = page ? innerPage(data, lang, page) : { home: true, body: home(data, lang) };
    await write(`${url.slice(1)}index.html`, document(data, lang, options, assets));
    routes.push(url);
  }
}
await write("404.html", notFound(data, assets));
await write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
    .map((url) => `<url><loc>${esc(data.site.url + url)}</loc></url>`)
    .join("")}</urlset>`,
);
await write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${data.site.url}/sitemap.xml\n`);
await write(
  "feed.xml",
  `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(
    data.site.name,
  )} — Research news</title><link>${
    data.site.url
  }/news/</link><description>Research news and publications</description>${data.news
    .map(
      (n) =>
        `<item><title>${esc(n.en.replace(/<[^>]+>/g, "").trim())}</title><link>${data.site.url}/news/${
          n.id
        }/</link><guid>${data.site.url}/news/${n.id}/</guid><pubDate>${new Date(
          `${n.date}T12:00:00Z`,
        ).toUTCString()}</pubDate><description>${esc(n.en)}</description></item>`,
    )
    .join("")}</channel></rss>`,
);
await write(
  "build-manifest.json",
  JSON.stringify(
    { routes, assets, counts: { publications: papers.length, projects: data.projects.length, news: data.news.length } },
    null,
    2,
  ) + "\n",
);
await fs.rm(dist, { recursive: true, force: true });
await fs.rename(stage, dist);
console.log(
  `Built ${routes.length} pages, ${papers.length} publications, ${data.projects.length} projects, ${data.news.length} news items. No network or dependencies required.`,
);
