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
git commit -m "Your commit message"
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
