# Siyuan (Max) Meng · 蒙思源

个人学术网站：[English](https://siyuanmengmax.github.io/) · [中文](https://siyuanmengmax.github.io/zh/)

借鉴 [TPWM Lab](https://github.com/siyuanmengmax/tpwm-lab) 的轻量静态架构：结构化双语内容、共享页面组件、原生 CSS / JavaScript。保留原首页设计与页面地址，内页使用相同的绿色配色及中英文字体。

## 本地运行

需要 **Node.js 20 或更新版本**，推荐 Node.js 24。没有第三方依赖，**不需要 `npm install`**。

```sh
npm run build
npm run check
npm run dev
```

打开 `http://localhost:4173/` 或 `http://localhost:4173/zh/`。修改内容后，重新运行 `npm run build` 并刷新浏览器。端口被占用时可使用 `PORT=4174 npm run dev`。

构建过程完全离线。`dist/` 为自动生成的网站，不提交到 Git，也不直接编辑。关闭浏览器 JavaScript 后，所有正文、论文与项目仍可阅读。

## 目录

```text
src/
  content/              # 网站内容，日常更新主要在这里
    site.json           # 站点信息、双语首页文案、联系方式、实验室链接
    profile.json        # 个人简介、入职信息、教育、奖励与学术服务
    publications.json   # 全部论文及中文论文信息，BibTeX 的唯一数据来源
    projects.json       # 项目简介与完整中英文详情
    news.json           # 双语动态及日期
    framework.json      # 四项博士研究的说明与关联论文 ID
    pages.json          # 内页标题、简介、教学正文及分类名称
  components/           # 共享导航、页脚、首页、论文与内页模板
public/                 # 只保留实际使用的照片、字体、图标、样式和脚本
scripts/
  build.mjs             # 内容 → HTML、BibTeX、RSS、站点地图和版本化资源
  check.mjs             # 内容、链接、旧论文锚点、字体、资源版本与语法检查
  serve.mjs             # 本地静态预览服务器
.github/workflows/
  deploy.yml            # 校验并部署到现有 GitHub Pages
docs/                  # 重构记录与回退说明
```

## 更新内容

| 要修改的内容 | 对应文件 |
| --- | --- |
| 姓名、邮箱、社交链接、实验室网址 | `src/content/site.json` |
| 简介、职位、教育、荣誉、学术服务 | `src/content/profile.json` |
| 论文、作者、年份、DOI、状态 | `src/content/publications.json` |
| 研究项目及详情 | `src/content/projects.json` |
| 最新动态 | `src/content/news.json` |
| 博士研究框架 | `src/content/framework.json` |
| 教学经历、内页标题 | `src/content/pages.json` |
| 颜色与布局 | `public/assets/portfolio/portfolio.css` |
| 英文与中文字体 | `public/assets/portfolio/english-typography.css`、`public/assets/css/chinese-typography.css` |
| 照片 | `public/assets/portfolio/max-profile.jpg` |

双语内容使用 `en` 和 `zh` 字段，修改时请同步维护。`body`、`bio` 和动态正文等字段允许少量 HTML，例如 `<strong>`、`<em>`、`<a>`、`<p>` 和 `<ul>`；它们是经过信任的本站内容，不用于接收外部用户输入。

### 论文

每篇论文包含稳定的 `id`、BibTeX `type` 和 `fields`。作者字段保持 BibTeX 写法，例如 `Meng, Siyuan and Ai, Chengbo`。`note` 中的 `Under Review` / `Submitting` 会归入在研手稿；会议类型归入会议论文；arXiv / preprint 刊物归入预印本。其余归入期刊论文。

中文论文的 `zh` 字段保存原始中文题名、完整作者姓名和刊物名。年份、卷期、页码和 DOI 共用 `fields`。没有 DOI 的预印本可设置顶层 `url`。页面、筛选及下载文件均由这一份记录生成，不再另行维护 `.bib` 源文件。

构建生成的下载地址沿用 `/assets/portfolio/publications.bib`。保留已有论文 `id`，以免旧链接和研究框架的关联失效。原 `/publications/#论文ID` 和首页 `/#paper-论文ID` 均可继续使用。

### 项目与动态

项目 `id` 对应 `/projects/ID/` 与 `/zh/projects/ID/`，请保留已存在的 ID。动态日期使用 `YYYY-MM-DD`，表示事件的日历日期，不随开发电脑的时区偏移。

`/cv/` 与 `/zh/cv/` 从当前个人信息生成履历，不再维护另一份容易过时的个人介绍，也不包含旧模板中的示例人物或示例 PDF。

## 发布

保持既有的 **推送 main 自动发布** 工作方式：

```sh
npm run build
npm run check
git status
git diff
git add <本次实际修改的文件>
git commit -m "Update portfolio content"
git push origin main
```

GitHub Actions 使用 Node.js 24 构建、校验，然后将 `dist/` 发布至现有 `gh-pages` 分支。拉取请求只做构建与校验，不发布。无需更改 GitHub Pages 设置。`tpwm-lab` 保持独立仓库和独立部署。

CSS / JavaScript 文件名带内容哈希，更新时自动使用新资源。首次查看新发布的 HTML 时，如浏览器仍显示缓存，可强制刷新，或在地址后加 `?v=提交短哈希`。

## 备份与验证

2026-10-11 重构前的版本为 `c371646`。远程备份标签为 `backup/pre-static-refactor-2026-10-11`；本地完整归档及原设计包位于项目外的 `../website-backups/portfolio-2026-10-11-c371646/`。

- [备份内容与回退步骤](docs/ROLLBACK.md)
- [迁移范围及验证记录](docs/MIGRATION.md)

旧主题、示例博客与大体积演示素材已从当前工作目录移除。Git 历史完整保留，因此 `.git` 的历史体积不会随工作目录一同缩小。

## 许可与版权

网站源码继续采用 [MIT License](LICENSE)。版权声明包含 Siyuan (Max) Meng 的 2026 年声明，并保留原 al-folio 项目作者 Maruan Al-Shedivat 的声明。MIT 许可正文保持不变；构建时会将许可证复制到发布目录的 `LICENSE`。

Inter 字体独立采用 SIL Open Font License 1.1，原版权声明及完整许可保存在 [字体许可证](public/assets/fonts/inter/LICENSE.txt) 中。网站所链接的论文仍遵循各自的出版或开放获取许可。
