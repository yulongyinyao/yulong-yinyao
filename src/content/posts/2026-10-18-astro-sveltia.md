---
title: 用 Astro 和 Sveltia CMS 搭一个安静的小站
date: 2026-10-18
category: tech
tags:
  - Astro
  - Sveltia
  - 工具
cover: /uploads/posts/cover-code.svg
draft: false
---

这套站点的目标不是“做一个很厉害的博客”，而是“让记录这件事足够省力”。

## 为什么是 Astro

Astro 默认输出静态 HTML。对个人站点来说，这几乎是最省心的选择：

- 不需要数据库，也不需要一直开着一台服务器。
- 页面在构建时生成，访问速度快，维护成本低。
- 内容就是仓库里的 Markdown 文件，迁移和备份都很直接。

内容集合用 `src/content.config.ts` 定义。文章和插画各有一个 schema，分类使用固定的枚举，标签保持自由输入。

```ts
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.enum(['essay', 'tech', 'life', 'creation']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

## 为什么是 Sveltia CMS

我需要一个能在电脑和手机浏览器里打开的后台。Sveltia CMS 是纯前端应用，放在 `public/admin/` 就能用；它的 GitHub backend 会把每次保存变成一次 commit，随后由 GitHub Actions 重新构建站点。

电脑端的媒体库支持拖拽和批量上传，插画的 `images` 字段使用 `multiple: true` 一次选多张图。手机端会调用系统文件选择器，可以从相册选图或直接拍照。

## 登录方式

因为没有自定义域名和 Cloudflare 账号，第一版先用 GitHub Personal Access Token 登录。Token 只保存在浏览器本地，不写进仓库。

以后如果觉得手机端粘贴 token 麻烦，可以再部署一个免费的 `sveltia-cms-auth` Worker，把 OAuth 流程补上。那是体验优化，不是第一版必须。

## 最后

工具应该退到内容后面。希望这个站点搭好以后，我打开后台就能写，关掉页面就不用再想它。
