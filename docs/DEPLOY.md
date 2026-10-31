# 部署指南

这篇文档从“还没有 GitHub 账号”开始，按顺序做完就能得到一个可以浏览、可以在电脑和手机后台写文章/传插画的站点。

> 站点默认是 **GitHub Pages 项目页**：
> `https://<你的用户名>.github.io/yulong-yinyao/`
>
> 这是“隐私级别 A”：页面告诉搜索引擎不要收录，仓库本身是公开的。仓库里的 Markdown、图片和备份分支，知道地址的人仍然可以直接读。如果你要“陌生人连看都看不到”，看文末的“升级隐私”一节。

---

## 0. 先理解这套东西怎么工作

```text
电脑/手机浏览器
   │
   ├─ 访客：GitHub Pages 上的静态页面（Astro 构建）
   │
   └─ 你：/admin/ → Sveltia CMS → GitHub API
                         │
                         └─ 提交 Markdown + 图片到 main 分支
                                  │
                                  └─ GitHub Actions 自动构建 → Pages 更新
```

- **没有数据库、没有服务器**。内容就是仓库里的文件。
- 每次在后台点“保存/发布”，CMS 会向 GitHub 提交一次 commit。
- commit 触发 `.github/workflows/deploy.yml`，重新构建并发布。
- 每周一 03:00 UTC（北京时间 11:00），`.github/workflows/backup.yml` 把仓库打包到 `backup` 分支。
- 站内搜索由 Pagefind 在构建时生成，开发模式（`pnpm dev`）下没有索引，这是正常的。

---

## 1. 注册 GitHub

1. 打开 <https://github.com/signup>。
2. 填写邮箱、密码、用户名。
   - 用户名会变成网址的一部分，例如 `alice` → `https://alice.github.io/`。
   - 只能用字母、数字、连字符，不能以下划线开头/结尾；**不要用中文**。
   - 用户名一旦确定，后面改起来会影响网址，第一次就想好。
3. 完成邮箱验证码，验证邮箱。
4. 如果 GitHub 要求开启两步验证（2FA），按提示用手机验证器或通行密钥开启。找不到验证器就先装一个（1Password、Bitwarden、Microsoft Authenticator 都可以）。
5. 登录后点右上角头像 → **Your profile**，地址栏里的 `github.com/` 后面就是你的用户名。

> 不需要付费。GitHub Free 的公开仓库 + GitHub Pages 足够这个站点使用。

---

## 2. 创建仓库

1. 打开 <https://github.com/new>。
2. **Repository name** 填 `yulong-yinyao`。
3. 选择 **Public**。
4. **不要**勾选 “Add a README file”“Add .gitignore”“Choose a license”，保持空仓库。
5. 点 **Create repository**。

创建后页面会显示仓库地址，例如：

```text
https://github.com/alice/yulong-yinyao
```

---

## 3. 在本地配置站点信息

需要一台装了 Node.js 22+ 和 pnpm 的电脑（第一次部署必须用电脑；之后手机只负责写内容）。

在项目目录执行：

```bash
pnpm install
pnpm setup
```

`pnpm setup` 会依次询问：

```text
GitHub 用户名（例如 alice，不是邮箱）：
仓库名 [yulong-yinyao]：
自定义域名（没有就直接回车）：
```

它会做这些事：

- 更新 `config/site.json` 里的用户名、仓库名、域名；
- 更新 `public/admin/config.yml` 里的仓库地址、站点地址、图片目录；
- 没有域名时，图片公共路径写成 `/yulong-yinyao/uploads/...`；
- 有域名时，改成 `/uploads/...`，并生成 `public/CNAME`；
- 把 Sveltia CMS 的浏览器包复制到 `public/admin/sveltia-cms.js`。

如果不想交互，也可以：

```bash
GITHUB_USERNAME=alice REPO_NAME=yulong-yinyao pnpm setup
```

有域名时：

```bash
GITHUB_USERNAME=alice REPO_NAME=yulong-yinyao CUSTOM_DOMAIN=blog.example.com pnpm setup
```

> `config/site.json` 里的 `githubUsername` 默认是占位符 `your-github-username`。没有改它之前，站点会显示一条“运行 pnpm setup”的提示。

---

## 4. 本地跑起来

```bash
pnpm dev
```

打开：

- 站点：<http://localhost:4321/yulong-yinyao/>
- 后台：<http://localhost:4321/yulong-yinyao/admin/>

> 项目页必须带 `/yulong-yinyao/` 前缀。绑定自定义域名并重新 `pnpm setup` 后，地址才会变成根路径。

后台第一次打开会要求登录。先按下一节生成 Token。

### 本地构建检查

```bash
pnpm build
pnpm preview
```

`pnpm build` 会先复制 CMS，再构建 Astro，最后生成 Pagefind 索引。构建完成后搜索才可用。

> `pnpm check` 是可选类型检查；在部分 Windows 环境里可能很慢或内存不足，不影响构建。构建通过即可。

---

## 5. 生成 GitHub Token（PAT）

这是给 Sveltia CMS 用的“仓库钥匙”。**只保存在你浏览器的 localStorage 里，不会写进仓库。**

### 推荐：Fine-grained token

1. 打开 <https://github.com/settings/tokens?type=beta>。
2. 点 **Generate new token**。
3. **Token name**：`yulong-yinyao-cms`。
4. **Expiration**：90 天（到期重新生成；不要选 No expiration）。
5. **Resource owner**：选你自己。
6. **Repository access**：选 **Only select repositories** → `yulong-yinyao`。
7. **Permissions** → **Repository permissions**：
   - **Contents**：`Read and write`（必须）
   - **Metadata**：`Read-only`（选了仓库后通常自动带上）
   - 其他保持 No access。
8. 点 **Generate token**，立刻复制 `github_pat_...`。页面刷新后不会再显示。

### 如果 Fine-grained 报错

可以退回 Classic token：

1. 打开 <https://github.com/settings/tokens>。
2. **Generate new token (classic)**。
3. 勾选 `repo`（完整仓库权限）。
4. 设置 90 天过期，生成并复制。

Classic token 权限更大，能不用就不用。

### 登录后台

1. 打开 `/admin/`。
2. 选择 **Sign in with Token**（中文界面可能是“使用令牌登录”）。
3. 粘贴 Token。
4. 如果弹出仓库选择，选 `你的用户名/yulong-yinyao`，分支 `main`。

登录成功后，左侧会出现“文章 / 插画”两个集合。

> Token 只应输入到自己的站点后台。不要把 Token 截图、发群、写进 Issue。怀疑泄露就去 GitHub 设置里 Revoke，再生成新的。

---

## 6. 第一次推送到 GitHub

在项目目录执行（把 `alice` 换成你的用户名）：

```bash
git init
git add .
git commit -m "chore: initial yulong_yinyao blog"
git branch -M main
git remote add origin https://github.com/alice/yulong-yinyao.git
git push -u origin main
```

如果 Git 提示没有身份：

```bash
git config user.name "你的名字"
git config user.email "你的GitHub邮箱"
```

推送时如果要求登录，用 GitHub 的浏览器授权，或使用 Personal Access Token 作为密码（不是 GitHub 登录密码）。

---

## 7. 开启 GitHub Pages

1. 打开仓库 → **Settings** → 左侧 **Pages**。
2. **Build and deployment** → **Source** 选 **GitHub Actions**。
3. 打开 **Actions** 标签，应该能看到 `Deploy to GitHub Pages` 正在运行。
4. 第一次如果失败，点进去看日志；最常见的是 Pages 没启用、权限没开、或 `pnpm-lock.yaml` 没提交。
5. 成功后访问：

```text
https://<你的用户名>.github.io/yulong-yinyao/
```

> 如果 Actions 里没有自动运行，检查 `.github/workflows/deploy.yml` 是否已提交，以及默认分支是不是 `main`。

---

## 8. 在手机上使用后台

手机浏览器打开：

```text
https://<你的用户名>.github.io/yulong-yinyao/admin/
```

- 登录方式与电脑相同：Token。
- 新建插画时点“图片”→“添加图片”，会调用系统文件选择器，可以选相册或拍照。
- 不同手机浏览器对“一次选多张”的支持不一样；iPhone Safari 通常可以多选，部分 Android 浏览器一次只能选一张，多点几次“添加图片”即可。
- 触控编辑 Markdown 不如电脑舒服，建议手机上主要做：新建、选图、填标题/分类/标签、保存；长文回到电脑排版。

---

## 9. 认证方案：PAT 与 OAuth Worker 怎么选

### 默认：PAT（最简单）

- 优点：零后端、零额外账号、5 分钟搞定。
- 缺点：Token 存在浏览器 localStorage；换浏览器/清缓存要重新粘贴；到期要重新生成。
- 适合：个人站点、只有自己用。

### 可选：Cloudflare Worker OAuth

如果以后觉得每次粘贴 Token 麻烦，可以部署官方的 `sveltia/sveltia-cms-auth`。仍然免费，但多一个 Cloudflare 账号和 OAuth App。

1. 打开 <https://github.com/sveltia/sveltia-cms-auth>，按 README 点 **Deploy to Cloudflare Workers**。
2. 在 GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**：
   - Application name：`yulong-yinyao CMS`
   - Homepage URL：`https://<你的用户名>.github.io/yulong-yinyao/`
   - Authorization callback URL：`https://<worker名>.<账号>.workers.dev/callback`
3. 把 GitHub OAuth App 的 Client ID / Client Secret 填到 Worker 的环境变量：
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `ALLOWED_DOMAINS`：`<你的用户名>.github.io`（多个用逗号分隔）
4. 修改 `public/admin/config.yml` 的 `backend`：

```yaml
backend:
  name: github
  repo: alice/yulong-yinyao
  branch: main
  base_url: https://<worker名>.<账号>.workers.dev
```

5. 提交推送，重新打开 `/admin/`，选择 GitHub 登录。

> Worker 只负责 OAuth 换 token，不存内容。内容仍然直接提交到你的仓库。

---

## 10. 隐私说明（很重要）

站点已经做了两层：

1. 所有页面 `<head>` 里有：

```html
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, max-image-preview:none" />
```

2. `public/robots.txt` 对全部爬虫 `Disallow: /`。

但要注意：

- GitHub Pages **项目页**的 `robots.txt` 实际在 `https://<用户名>.github.io/yulong-yinyao/robots.txt`，不是域名根。爬虫只认 `https://<用户名>.github.io/robots.txt`。所以项目页模式下，主要靠 meta noindex。
- 绑定自定义域名后，`robots.txt` 才会部署到域名根，两层同时生效。
- `noindex` 是“请求搜索引擎不要展示”，不是访问控制。公开仓库里的源码、图片、草稿、备份，任何人知道地址都能读。
- 如果文章包含非常私人的信息，不要放进公开仓库；或者升级到下面的方案。

### 升级隐私（陌生人也不能看）

需要自定义域名 + Cloudflare（免费套餐即可）：

1. 买/已有域名，接入 Cloudflare DNS。
2. GitHub Pages 绑定域名，`pnpm setup` 填域名，重新推送。
3. 用 **Cloudflare Access** 给整个站点加邮箱一次性验证码/Google 登录，只允许你自己的邮箱。
4. 如果连 GitHub 仓库都不想公开：把仓库改成 Private，改用 **Cloudflare Pages** 连接私有仓库构建（GitHub Pages 免费版不支持私有仓库）。Cloudflare Pages 仍然可以免费托管静态站点。

这套方案步骤更多，但才是真正的“私人”。当前版本先保证简单、能跑、能备份。

---

## 11. 常见问题

### `/admin/` 404

- 确认 `public/admin/index.html`、`public/admin/config.yml`、`public/admin/sveltia-cms.js` 都存在。
- 本地先执行 `pnpm cms:copy`。
- 部署后确认 Actions 构建成功，`dist/admin/index.html` 在产物里。

### 后台提示“未定义媒体文件夹” / `Errors found in configuration`

Sveltia CMS 要求 `config.yml` **顶层**必须有 `media_folder`，即使每个 collection 已经单独配置了媒体目录。正确结构：

```yaml
media_folder: /public/uploads
public_folder: /yulong-yinyao/uploads

collections:
  - name: posts
    media_folder: /public/uploads/posts
    public_folder: /yulong-yinyao/uploads/posts
```

注意 collection 级别的 `media_folder` 要以 `/` 开头，表示从仓库根目录开始；写成 `public/uploads/posts` 会被当成相对于 `src/content/posts` 的路径。

### 后台提示仓库找不到 / 401

- `public/admin/config.yml` 里的 `repo` 必须是 `用户名/仓库名`，不是仓库 URL。
- Token 是否选了正确的仓库、Contents 是否为 Read and write、是否过期。
- Fine-grained token 的 Resource owner 必须是仓库所有者。

### 图片在站点上 404

- 项目页需要 `/yulong-yinyao/uploads/...`。CMS 的 `public_folder` 已由 `pnpm setup` 配好。
- 如果你手动改过仓库名/域名，重新跑 `pnpm setup`，并检查旧内容的图片路径。
- Markdown 正文里的 `/uploads/...` 会由 `astro.config.mjs` 的 rehype 插件补 base；组件图片走 `withBase()`。

### 搜索没有结果

- `pnpm dev` 没有 Pagefind 索引，正常。
- 运行 `pnpm build && pnpm preview` 再试。
- 确认文章详情页有 `data-pagefind-body`，列表页没有把正文重复索引。

### 手机上不能多选图片

- 这是浏览器/系统文件选择器的能力差异，不是 CMS 配置问题。可以多次点“添加图片”，或先用手机相册整理好再逐张上传。
- 图片建议长边 ≤2000px、WebP/JPEG、单张尽量 ≤500KB。CMS 不会自动压缩。

### GitHub Actions 备份没有按时跑

- GitHub 会在仓库连续 60 天没有活动后暂停定时 workflow。打开 Actions → `Backup repository` → **Enable workflow**，或手动 **Run workflow**。
- 也可以每周手动跑一次，见 `docs/BACKUP.md`。
