# Siyuan (Max) Meng - Academic Website

Personal academic website built with [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme.

**Live site:** [https://siyuanmengmax.github.io](https://siyuanmengmax.github.io)

## Quick Start

### Local Preview

```bash
bundle install          # Install dependencies (first time only)
bundle exec jekyll serve
```

Then visit `http://localhost:4000`

### Deploy Changes

```bash
npx prettier . --write  # Fix formatting
git add .
git commit -m"update30"
git push
```

GitHub Actions will automatically build and deploy.

## Content Guide

### Update Personal Info

| File                      | Content                                     |
| ------------------------- | ------------------------------------------- |
| `_pages/about.md`         | Homepage bio and research interests         |
| `_config.yml`             | Name, site description, email               |
| `_data/socials.yml`       | Email, GitHub, ResearchGate, Google Scholar |
| `_data/cv.yml`            | CV page content                             |
| `assets/img/prof_pic.jpg` | Profile photo                               |

### Add Publications

Edit `_bibliography/papers.bib` in BibTeX format:

```bibtex
@article{meng2023example,
  abbr={Journal},
  bibtex_show={true},
  title={Your Paper Title},
  author={Meng, Siyuan and Coauthor, Name},
  journal={Journal Name},
  year={2023},
  doi={10.xxxx/xxxxx},
  selected={true}  # Shows on homepage
}
```

### Add News

Create `_news/announcement_X.md`:

```markdown
---
layout: post
date: 2025-01-15 09:00:00-0500
inline: true
related_posts: false
---

Your news content here with **markdown** support.
```

### Add Projects

Create `_projects/X_project.md`:

```markdown
---
layout: page
title: Project Name
description: Brief description
img: assets/img/project_thumb.jpg
importance: 1
category: research
---

Project details...
```

## File Structure

```
├── _bibliography/papers.bib    # Publications
├── _config.yml                 # Site settings
├── _data/
│   ├── cv.yml                  # CV content
│   └── socials.yml             # Social links
├── _news/                      # News items
├── _pages/
│   ├── about.md                # Homepage
│   ├── cv.md                   # CV page
│   └── publications.md         # Publications page
├── _projects/                  # Project pages
└── assets/img/                 # Images
```

## Troubleshooting

### Prettier Check Failed

```bash
npm install                     # Install prettier plugin
npx prettier . --write          # Auto-fix formatting
```

### Build Failed

Check the Actions tab on GitHub for error details.

## Resources

- [al-folio Documentation](https://github.com/alshedivat/al-folio)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [BibTeX Guide](https://www.bibtex.org/Format/)

## 中英文内容维护

英文页面沿用原有地址，中文页面位于 `/zh/`。导航栏的 `EN / 中文` 链接切换到对应页面；选择会保存在浏览器中，再次访问首页时优先进入所选语言。直接访问内页链接时保留链接指定的语言。禁用 JavaScript 或浏览器存储时，普通语言切换链接仍可使用。

- 核心英文页面位于 `_pages/`，中文页面位于 `_pages/zh/`。成对页面共用 `translation_key`，并设置 `lang`、`permalink_en` 和 `permalink_zh`。
- 公共界面文案位于 `_data/i18n.yml`；新增主导航页面时，请同时添加对应中文页。
- 新闻共用 `_news/` 中的日期与排序，中文正文写在 `content_zh` 字段中；未填写时回退到英文。
- 项目卡片的中文标题和简介位于 `_projects/` 的 `title_zh`、`description_zh` 字段；中文详情位于 `_pages/zh/project_*.md`。
- 论文继续共用 `_bibliography/` 数据，保留原始标题、作者与引用信息。GitHub 统计卡片等第三方内容保留原文。
- 本次翻译覆盖个人介绍、论文、项目及其详情、代码仓库、教学和新闻；未启用的模板示例、博客与 CV 暂未翻译。新增内容后应同步更新两个版本。

本地检查：`npx prettier . --check`；构建预览：`bundle exec jekyll serve`（Ruby / Bundler 版本参照现有部署工作流及 `Gemfile.lock`）。
