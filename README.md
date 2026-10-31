# 银曜的个人博客

一个用来存档文章、插画、说说和项目的私人小站。Astro 静态生成，自带一个轻量的 `/editor/` 编辑页，GitHub Actions 自动部署与备份。

- 站点名：`银曜的个人博客`
- 仓库名：`yulong-yinyao`
- 线上地址：`https://yulongyinyao.github.io/yulong-yinyao/`
- 编辑器：`https://yulongyinyao.github.io/yulong-yinyao/editor/`
- 备用后台：`https://yulongyinyao.github.io/yulong-yinyao/admin/`（Sveltia，可选）

> 这是一个 **public 仓库 + GitHub Pages** 的方案。页面做了 `noindex` + `robots.txt`，搜索引擎不应收录；但仓库源码、草稿、图片和备份分支对所有知道地址的人可见。`noindex` 不是访问控制。若要让陌生人完全看不到，请读 [`docs/DEPLOY.md`](docs/DEPLOY.md) 的“隐私说明”一节。

---

## 1. 先做三件事

1. 注册 GitHub（见 [`docs/DEPLOY.md`](docs/DEPLOY.md) 第 1 节）。
2. 新建一个 **Public** 仓库，名字必须是 `yulong-yinyao`，不要勾选初始化 README。
3. 在本项目目录运行：

```bash
pnpm install
pnpm setup
```

`pnpm setup` 会问你的 GitHub 用户名，并自动改写：

- `config/site.json` 的 `githubUsername`
- `public/admin/config.yml` 的 `repo`、`site_url`、`display_url`、`logo_url`、`public_folder`
- 如有自定义域名，生成 `public/CNAME`

然后启动本地预览：

```bash
pnpm dev
```

打开 <http://localhost:4321/yulong-yinyao/>，编辑器是 <http://localhost:4321/yulong-yinyao/editor/>。

> 本地 `pnpm dev` 没有 Pagefind 索引，搜索会显示“构建后可用”。要测试搜索，用 `pnpm build && pnpm preview`。

---

## 2. 环境要求

- Node.js **22 或更高**
- pnpm **10 或更高**（本项目用 `pnpm@11.28.5` 生成锁文件）
- Git

没有 pnpm 时：

```bash
corepack enable
corepack prepare pnpm@11.28.5 --activate
```

或者：

```bash
npm install -g pnpm
```

Windows PowerShell 如果提示 `pnpm.ps1 cannot be loaded`，改用 `pnpm.cmd install`，或执行：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## 3. 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 本地开发，热更新；无搜索索引 |
| `pnpm build` | 构建静态站 + 生成 Pagefind 索引到 `dist/` |
| `pnpm preview` | 预览 `dist/`，搜索可用 |
| `pnpm check` | Astro/TypeScript 检查（大项目可能吃内存） |
| `pnpm setup` | 写入 GitHub 用户名/仓库名/域名 |
| `pnpm cms:copy` | 把 Sveltia CMS 复制到 `public/admin/` |
| `pnpm format` | Prettier 格式化 |

`pnpm dev` 和 `pnpm build` 会自动执行 `cms:copy`，一般不需要手动跑。

如果 `pnpm check` 因内存不足退出：

```bash
NODE_OPTIONS=--max-old-space-size=6144 pnpm check
```

PowerShell：

```powershell
$env:NODE_OPTIONS="--max-old-space-size=6144"; pnpm check
```

---

## 4. 目录结构

```text
yulong-yinyao/
├─ config/
│  ├─ site.json              # 站点名、头像、简介、GitHub 用户名、域名
│  └─ categories.json        # 文章/插画分类（可在编辑器“站点”里改）
├─ public/
│  ├─ admin/
│  │  ├─ index.html          # /admin 入口
│  │  ├─ config.yml          # Sveltia CMS 配置
│  │  └─ sveltia-cms.js      # 构建时从 node_modules 复制，已 gitignore
│  ├─ uploads/
│  │  ├─ posts/              # 文章封面与正文图
│  │  ├─ illustrations/      # 插画图片
│  │  ├─ projects/           # 项目封面
│  │  └─ site/               # 站点头像
│  ├─ robots.txt             # 全站禁止爬虫
│  ├─ hero.svg               # 首页 Banner
│  ├─ avatar.svg             # 头像
│  ├─ favicon.svg
│  └─ og-default.svg
├─ scripts/
│  ├─ setup.mjs              # 首次配置
│  └─ copy-cms.mjs           # 复制 CMS 静态文件
├─ src/
│  ├─ components/            # Header/Hero/卡片/筛选/搜索/灯箱/日历/天气…
│  ├─ content/
│  │  ├─ posts/              # 文章 Markdown
│  │  ├─ illustrations/      # 插画 Markdown
│  │  ├─ notes/              # 说说 Markdown
│  │  └─ projects/           # 项目 Markdown
│  ├─ content.config.ts      # 内容模型与校验
│  ├─ data/
│  │  ├─ categories.ts       # 读取 config/categories.json
│  │  └─ friends.ts          # 友链静态数据
│  ├─ layouts/BaseLayout.astro
│  ├─ lib/content.ts         # 查询、统计、标签
│  ├─ pages/                 # 首页/文章/插画/说说/项目/照片墙/友链/归档/关于/404/editor
│  ├─ styles/global.css      # Tailwind 4 + 主题
│  └─ consts.ts              # 路径、日期、摘要等工具
├─ .github/workflows/
│  ├─ deploy.yml             # push main 自动部署
│  └─ backup.yml             # 每周 ZIP + bundle 备份
├─ docs/
│  ├─ DEPLOY.md              # 从注册 GitHub 到上线
│  ├─ BACKUP.md              # 自动/手动备份与恢复
│  └─ ACCEPTANCE.md          # 电脑/手机验收清单
├─ astro.config.mjs
├─ package.json
└─ pnpm-lock.yaml
```

---

## 5. 内容模型

### 文章 `src/content/posts/*.md`

```yaml
---
title: 标题
date: 2026-10-31
category: life        # 默认值，可在编辑器“站点”里增删改
tags:
  - 标签一
  - 标签二
cover: /uploads/posts/封面.svg   # 可选
draft: false
---

正文 Markdown。
```

### 插画 `src/content/illustrations/*.md`

```yaml
---
title: 标题
date: 2026-10-31
category: original    # 默认值，可在编辑器“站点”里增删改
tags:
  - 标签
images:
  - /uploads/illustrations/图1.webp
  - /uploads/illustrations/图2.webp
description: >-
  一段描述。
draft: false
---
```

### 说说 `src/content/notes/*.md`

```yaml
---
title: 可选标题
date: 2026-10-31
tags:
  - 日常
draft: false
---

一两句话，或者一小段 Markdown。
```

### 项目 `src/content/projects/*.md`

```yaml
---
title: 项目名
date: 2026-10-31
summary: 一句话说明这个项目。
tags:
  - Astro
link: https://example.com        # 可选
repo: https://github.com/...     # 可选
cover: /uploads/projects/封面.webp # 可选
featured: true                   # 首页精选
draft: false
---

项目正文 Markdown。
```

### 分类

分类数据在 `config/categories.json`，初始为：

| 类型 | slug | 中文 |
| --- | --- | --- |
| 文章 | `essay` | 随笔 |
| 文章 | `tech` | 技术 |
| 文章 | `life` | 生活 |
| 文章 | `creation` | 创作 |
| 插画 | `original` | 原创 |
| 插画 | `practice` | 练习 |
| 插画 | `fanart` | 同人 |
| 插画 | `commission` | 约稿 |

日常在编辑器顶部“站点”里增删改：名称显示在站点上，slug 用于 URL。已经有内容的分类不能删除或改 slug，避免文章“失去分类”。标签仍然自由输入，自动汇总。

### 图片路径规则

- 文件放在 `public/uploads/posts/`、`public/uploads/illustrations/` 或 `public/uploads/projects/`。
- Markdown 正文里写 `/uploads/...`，构建时 `rehypeBaseUploads()` 会自动补上项目页的 `/yulong-yinyao/` 前缀。
- 组件里的图片用 `withBase()` 补前缀。
- 不要写死 `https://<用户名>.github.io/...`，换域名会全部失效。

---

## 6. 编辑器怎么用

1. 打开 `/editor/`。
2. 粘贴 GitHub Fine-grained PAT（权限：Contents Read and write；Metadata Read）。
3. 顶部选“文章 / 插画 / 说说 / 项目”，或点“+ 文章 / + 插画 / + 说说 / + 项目”新建。
4. 标题、日期、分类（文章/插画）、标签直接在表单里填；正文用 Markdown；封面、插画多图和项目封面可以上传、从媒体库选、删除。
5. 点“保存并发布”，页面会直接 commit 到 `main`，GitHub Actions 自动重新构建。
6. 顶部“站点”里可以改左侧卡片的头像、简介，以及文章/插画分类；保存会同时提交 `config/site.json` 和 `config/categories.json`，只触发一次构建。

PAT 只存在当前浏览器 localStorage，不会提交到仓库。换浏览器/清除站点数据后要重新粘贴。

编辑器不依赖 Sveltia：文章和图片都通过 GitHub Contents API 直接读写。`/admin/` 仍然保留，作为可选的 Sveltia 后台；日常使用 `/editor/` 即可。

> 手机端上传调用系统文件选择器，可从相册选图或直接拍照；一次多选的支持取决于手机浏览器。PC 端可以一次批量选图，媒体库支持设为封面、加入插画、复制路径和删除。

### 友链和“此刻”

- 友链是静态数据，编辑 `src/data/friends.ts` 里的数组，下次构建生效；页面本身不会暴露后台。
- 右栏“此刻”用 Open-Meteo 免费接口显示北京天气，不需要 key；`config/site.json` 的 `nowPlaying` 填了 `title` 才会显示音乐块，不填就只显示天气。
- 天气请求失败时会显示“天气暂时没有回应”，不影响页面其余部分。

---

## 7. 部署

完整步骤见 [`docs/DEPLOY.md`](docs/DEPLOY.md)。最短路径：

```bash
git init
git add .
git commit -m "init blog"
git branch -M main
git remote add origin https://github.com/<用户名>/yulong-yinyao.git
git push -u origin main
```

然后到仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。

首次 Actions 跑完后访问：

```text
https://<用户名>.github.io/yulong-yinyao/
```

---

## 8. 备份

- 自动：`.github/workflows/backup.yml` 每周一 03:00 UTC 把 `latest.zip`（内容快照）和 `latest.bundle`（完整 Git 历史）推到 `backup` 分支。
- 手动：Actions → **Backup repository** → **Run workflow**。
- 下载/恢复/完整克隆：见 [`docs/BACKUP.md`](docs/BACKUP.md)。

`backup` 分支只保留最新一份，force-push 覆盖，不会无限增长。GitHub 对单个文件有 100MB 限制；图片多时建议压缩。

---

## 9. 隐私说明

已做：

- 所有页面 `<head>` 含 `noindex, nofollow, noarchive, nosnippet, noimageindex`。
- `public/robots.txt` 全站 `Disallow`。
- 没有 sitemap、RSS、评论、统计脚本。
- `/editor/`、`/admin/` 同样 noindex。

不能做：

- 阻止别人直接输入 URL 访问。
- 阻止别人浏览 public 仓库的源码、草稿、图片、备份分支。
- 保证 Google 永远不收录（已收录的页面需要在站长工具手动移除）。

需要更强隐私时，见 `docs/DEPLOY.md` 的升级方案：自定义域名 + Cloudflare Access，或 private 仓库 + Cloudflare Pages。

---

## 10. 当前状态

- [x] Astro 构建通过，本地生成 18 个页面（含 `/editor/`）；线上按实际内容生成。
- [x] Pagefind 中文索引生成，只索引已发布详情页。
- [x] 三栏布局、深色模式、分类/标签筛选、归档、搜索弹层、插画灯箱。
- [x] P1：说说、项目、照片墙、友链、日历侧栏、北京天气/此刻卡片。
- [x] `/editor/` 轻量编辑器：文章/插画/说说/项目新建、编辑、删除，图片上传、媒体库、Markdown 预览。
- [x] Sveltia CMS 配置保留为可选后台，PAT 登录说明。
- [x] robots.txt + 全局 noindex。
- [x] 自动部署 + 自动备份 workflow。
- [x] 部署/备份/验收文档。
- [x] 线上地址：`https://yulongyinyao.github.io/yulong-yinyao/`。
- [ ] 用现代浏览器做一次线上电脑/手机验收（`docs/ACCEPTANCE.md`）。
- [ ] 按需删除示例文章/插画，换成自己的内容。

---

## 11. 技术栈

- [Astro](https://astro.build/) 7
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Sveltia CMS](https://sveltiacms.app/)（可选后台）
- [YAML](https://eemeli.org/yaml/) + [marked](https://marked.js.org/)（`/editor/`）
- [Pagefind](https://pagefind.app/)
- GitHub Pages + GitHub Actions

---

站点内容与插画归 `银曜` 所有。未经允许，请勿转载。
