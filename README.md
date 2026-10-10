# Siyuan (Max) Meng · 蒙思源

**English** · [简体中文](README.zh-CN.md)

Personal academic website: [English](https://siyuanmengmax.github.io/) · [中文](https://siyuanmengmax.github.io/zh/)

A lightweight, bilingual static website with structured content, shared page components, and vanilla CSS and JavaScript. Its architecture follows [TPWM Lab](https://github.com/siyuanmengmax/tpwm-lab). The site preserves the portfolio homepage and existing page URLs, with consistent green styling and typography across the inner pages.

## Local development

Requires **Node.js 20 or later**; Node.js 24 is recommended. There are no third-party dependencies, so **`npm install` is not needed**.

```sh
npm run build
npm run check
npm run dev
```

Open `http://localhost:4173/` for English or `http://localhost:4173/zh/` for Chinese. After editing source files, run `npm run build` again and refresh the browser. To use another port, run `PORT=4174 npm run dev`.

The build works offline. The generated `dist/` directory is excluded from Git and should not be edited directly. All page content, publications, and project descriptions remain readable with JavaScript disabled.

## Project structure

```text
src/
  content/              # Website content; most updates belong here
    site.json           # Site settings, bilingual homepage copy, contact and lab links
    profile.json        # Biography, appointment, education, honors, and service
    publications.json   # Publication records and Chinese metadata; source for BibTeX
    projects.json       # Project summaries and full bilingual descriptions
    news.json           # Bilingual news items and dates
    framework.json      # Four doctoral studies and their publication IDs
    pages.json          # Inner-page titles, descriptions, teaching, and category labels
  components/           # Shared navigation, footer, homepage, publications, and inner pages
public/                 # Images, fonts, icons, styles, and browser scripts used by the site
scripts/
  build.mjs             # Content → HTML, BibTeX, RSS, sitemap, and versioned assets
  check.mjs             # Content, links, legacy anchors, fonts, hashes, and syntax checks
  serve.mjs             # Local static preview server
.github/workflows/
  deploy.yml            # Build, validate, and deploy to GitHub Pages
docs/                   # Migration and rollback notes (Chinese)
```

## Updating content

| What to update | File |
| --- | --- |
| Name, email, social links, and lab URLs | `src/content/site.json` |
| Biography, appointment, education, honors, and service | `src/content/profile.json` |
| Publications, authors, years, DOIs, and status | `src/content/publications.json` |
| Research projects and their full descriptions | `src/content/projects.json` |
| News | `src/content/news.json` |
| Doctoral research framework | `src/content/framework.json` |
| Teaching and inner-page titles | `src/content/pages.json` |
| Colors and layout | `public/assets/portfolio/portfolio.css` |
| English and Chinese typography | `public/assets/portfolio/english-typography.css`, `public/assets/css/chinese-typography.css` |
| Profile photo | `public/assets/portfolio/max-profile.jpg` |

Bilingual content uses `en` and `zh` fields. Keep both versions up to date. Fields such as `body`, `bio`, and news text support a small amount of HTML, including `<strong>`, `<em>`, `<a>`, `<p>`, and `<ul>`. These fields contain trusted website content and are not intended for external user input.

### Publications

Each publication has a stable `id`, a BibTeX `type`, and a `fields` object. The author field uses BibTeX notation, such as `Meng, Siyuan and Ai, Chengbo`. Records marked `Under Review` or `Submitting` in `note` appear under manuscripts; conference entry types appear under conferences; arXiv or preprint venues appear under preprints. Other records appear under journal articles.

For papers published in Chinese, the optional `zh` object provides the original Chinese title, full author names, and venue. Year, volume, issue, pages, and DOI are shared through `fields`. A preprint without a DOI can use a top-level `url`. The publication pages, filters, and downloadable BibTeX all use these records; there is no separate `.bib` source to maintain.

The generated download remains available at `/assets/portfolio/publications.bib`. Preserve existing publication IDs so links and research-framework references continue to work. Both `/publications/#PUBLICATION_ID` and `/#paper-PUBLICATION_ID` anchors are supported.

### Projects and news

A project ID determines its English and Chinese routes: `/projects/ID/` and `/zh/projects/ID/`. Preserve existing IDs when updating content. News dates use `YYYY-MM-DD` and represent calendar dates, independent of the development machine's time zone.

The `/cv/` and `/zh/cv/` pages are generated from the current profile data. They do not require a separate biography and do not include the old theme's sample person or PDF.

## Deployment

**Pushing to `main` automatically publishes the website.**

```sh
npm run build
npm run check
git status
git diff
git add <files-you-reviewed>
git commit -m "Update portfolio content"
git push origin main
```

Replace `<files-you-reviewed>` with the paths you intend to commit. GitHub Actions uses Node.js 24 to build and validate the site, then publishes `dist/` to the existing `gh-pages` branch. Pull requests run the build and checks without deploying. No changes to the existing GitHub Pages settings are required. The `tpwm-lab` repository and its deployment remain independent.

CSS and JavaScript filenames include content hashes so browsers request updated assets after a release. If a browser still shows cached HTML, use a hard refresh or append `?v=SHORT_COMMIT_HASH` to the page URL.

## Backups and validation

The version before the October 11, 2026 refactor is commit `c371646`, preserved under the remote tag `backup/pre-static-refactor-2026-10-11`. On the maintainer's machine, the full archive and original design package are stored outside this repository at `../website-backups/portfolio-2026-10-11-c371646/`.

- [Backup contents and rollback instructions (Chinese)](docs/ROLLBACK.md)
- [Migration scope and validation record (Chinese)](docs/MIGRATION.md)

The old theme, sample blog posts, and large demonstration assets have been removed from the working tree. Git history remains intact, so the size of `.git` does not shrink along with the current source files.

## License and attribution

The website source is distributed under the [MIT License](LICENSE). The copyright notices include Siyuan (Max) Meng's 2026 notice and the original al-folio author Maruan Al-Shedivat's notice. The MIT license terms remain unchanged. The build copies `LICENSE` into the published site.

Inter fonts are separately licensed under the SIL Open Font License 1.1. Their original copyright notice and full terms are included in the [font license](public/assets/fonts/inter/LICENSE.txt). Linked papers remain subject to their respective publication or open-access licenses.

[NOTICE.md](NOTICE.md) records website attribution, al-folio origins, the TPWM Lab architecture reference, and Inter font credits. It supplements the licenses and is included in the published site alongside `LICENSE`.
