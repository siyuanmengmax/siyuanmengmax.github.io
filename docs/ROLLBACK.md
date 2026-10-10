# 重构前备份与回退

备份于 2026-10-11 创建，在删除旧主题前已验证。

- 旧版提交：`c371646d0dd8d017951c5d53e9e54fdf5931dab8`
- 远程标签：[`backup/pre-static-refactor-2026-10-11`](https://github.com/siyuanmengmax/siyuanmengmax.github.io/tree/backup/pre-static-refactor-2026-10-11)
- 本地目录：`/Users/siyuanmaxmeng/website-backups/portfolio-2026-10-11-c371646/`

## 本地归档

| 文件 | 内容 |
| --- | --- |
| `repository.bundle` | 完整 Git 历史与引用，可独立克隆；已通过 `git bundle verify` |
| `workspace.tar.gz` | 原源码、构建输出 `_site`、被忽略的 `Gemfile.lock`、原设计包等；省略可重新安装的 `node_modules` 和构建缓存 |
| `*.sha256` | 上述归档的 SHA-256 校验和 |
| `Max_Portfolio_UI_v2/` | 原先未纳入 Git 的设计包，完整移入此处 |

备份位于项目外，不会随新版构建发布，也不会让精简后的源码目录再次变大。

## 在独立目录查看旧版

```sh
git clone /Users/siyuanmaxmeng/website-backups/portfolio-2026-10-11-c371646/repository.bundle restored-portfolio
cd restored-portfolio
git switch --detach backup/pre-static-refactor-2026-10-11
```

如需原来的本地生成结果或未跟踪文件，可将 `workspace.tar.gz` 解压到另一个空目录。不要覆盖正在修改的工作目录。

## 将线上网站恢复为旧版

先保存当前工作，确认 `git status` 没有未提交的修改。在 `main` 上恢复旧版源码并创建一个新的恢复提交，保留所有历史：

```sh
git switch main
git pull --ff-only origin main
git fetch origin tag backup/pre-static-refactor-2026-10-11
git restore --source=backup/pre-static-refactor-2026-10-11 --staged --worktree .
git diff --cached --stat
git commit -m "Restore portfolio before static refactor"
git push origin main
```

此操作会一并恢复旧版 Jekyll 构建与部署配置。推送后查看 GitHub Actions，等待旧版重新构建并发布。它不需要强制推送，也不改变独立的 `tpwm-lab` 仓库。

`dist/` 是被忽略的本地生成目录；恢复旧版后，它不参与旧版构建。如需恢复原本的未跟踪设计包，可从上述本地备份复制回来。
