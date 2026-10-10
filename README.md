# Siyuan (Max) Meng - Academic Website

Personal academic website built with [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme.

**Live site:** [https://siyuanmengmax.github.io](https://siyuanmengmax.github.io)

## Quick Start

### Local Preview

```bash
bundle install          # Install dependencies (first time only)
bundle exec jekyll serve --config _config.yml,_config.local.yml --host 127.0.0.1
```

Then visit `http://127.0.0.1:4000` (English) or `http://127.0.0.1:4000/zh/` (中文).
The local configuration skips external demo blog feeds, the Twitter sample post, and ImageMagick conversion; production settings are unchanged.

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

| File                               | Content                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `_data/profile.json`               | Bilingual homepage biography, education, photo, and appointment visibility |
| `_data/portfolio.json`             | Bilingual homepage sections, research directions, and interface labels     |
| `_data/research_framework.json`    | Four research stages and their publication keys                            |
| `_config.yml`                      | Name, site description, email                                              |
| `_data/socials.yml`                | Email, GitHub, ResearchGate, Google Scholar                                |
| `_data/cv.yml`                     | CV page content                                                            |
| `assets/portfolio/max-profile.jpg` | Profile photo                                                              |

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

本地检查：`npx prettier . --check`；构建预览：`bundle exec jekyll serve --config _config.yml,_config.local.yml`（Ruby / Bundler 版本参照现有部署工作流及 `Gemfile.lock`）。

## Portfolio homepage

`/` 与 `/zh/` 共用 `_layouts/portfolio.liquid` 和 `_includes/portfolio/`。新版首页样式及动画位于 `assets/portfolio/`；原有论文、项目、教学、新闻等内页仍使用既有路由。

- 个人介绍、教育经历与入职信息：`_data/profile.json`。`show_appointment` 控制两个语言版本是否显示即将入职信息；姓名与联系方式继续读取 `_config.yml` 和 `_data/socials.yml`。
- 首页文案与研究方向：`_data/portfolio.json`；博士研究框架：`_data/research_framework.json`。`paper_key` 对应 `_bibliography/papers.bib` 中的条目键。
- 论文列表、类别、状态、链接和 BibTeX 下载由 `_plugins/portfolio-publications.rb` 在构建时从现有 BibTeX 生成，不维护第二份论文清单。
- 新闻直接读取 `_news/`，项目直接读取 `_projects/` 的双语标题、简介和既有详情路由。
- 动画为合成概念演示，不运行论文算法，也不计算 TTC/PET。脚本只负责动画、阶段切换与论文筛选，研究说明由 Jekyll 直接生成。
- `Max_Portfolio_UI_v2/` 仅为设计参考，已从 Jekyll 构建输出中排除。

本地构建：`bundle exec jekyll build --config _config.yml,_config.local.yml`。
