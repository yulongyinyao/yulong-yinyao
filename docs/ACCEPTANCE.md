# 双端验收清单

目标：**先保证电脑和手机都能浏览、登录、新建、上传、发布成功，再谈美化。**

建议顺序：

```bash
pnpm install
pnpm build
pnpm preview
```

然后打开 <http://localhost:4321/yulong-yinyao/>。后台是 <http://localhost:4321/yulong-yinyao/admin/>。

> 本地 `pnpm dev` 没有 Pagefind 索引，搜索会提示“构建后可用”。验收搜索必须用 `pnpm build && pnpm preview`。

---

## A. 电脑端浏览（Chrome / Edge，1440×900）

- [ ] 首页能打开，Hero 大图、标题 `yulong_yinyao`、副标题正常。
- [ ] 顶部导航吸顶；滚动时背景保持半透明毛玻璃。
- [ ] 左侧个人卡片显示头像、昵称、签名、社交图标。
- [ ] 中间分类卡片显示“文章 / 插画”及数量。
- [ ] 右侧统计卡片显示文章数、分类数、标签数。
- [ ] 页面没有横向滚动条。
- [ ] 点“文章”进入列表，卡片有标题、日期、分类、标签、摘要、缩略图。
- [ ] 点“插画”进入列表，卡片显示首图、多图数量、描述。
- [ ] 点“归档”能看到按年份分组的时间线。
- [ ] 点“关于”能看到头像、站点说明、分类、隐私说明。
- [ ] 点任意文章，详情页正文排版正常，封面、日期、分类、标签都在。
- [ ] 点任意插画，详情页多图排列正常；点图片能打开灯箱，左右箭头/键盘可切换，Esc 关闭。
- [ ] 点标签能跳到带 `?tag=` 的筛选结果。
- [ ] 点分类能跳到带 `?category=` 的筛选结果。
- [ ] 筛选后地址栏参数正确；点“清除筛选”能恢复全部。
- [ ] 浏览器后退能恢复上一次筛选。
- [ ] 点右上角月亮/太阳图标，整站切换深色/明亮；刷新后主题保持。
- [ ] 按 `Ctrl/⌘ + K` 打开搜索，输入 `Sveltia` 或 `花园` 有结果；点结果能跳转；Esc 关闭。
- [ ] 直接访问一个不存在的地址，出现 404 页面，能回首页。
- [ ] 查看网页源代码：`<head>` 里有 `noindex, nofollow`；`/robots.txt` 返回 `Disallow: /`。

---

## B. 电脑端后台（/admin/）

- [ ] 打开 `/admin/`，能看到 Sveltia 登录界面。
- [ ] 选择 **Sign in with Token**，粘贴 PAT 后能进入。
- [ ] 左侧出现“文章”“插画”两个集合。
- [ ] 新建文章：
  - [ ] 填标题、日期、分类。
  - [ ] 标签输入后按回车，能添加多个。
  - [ ] 封面：点选/拖拽图片到封面字段，能上传并显示缩略图。
  - [ ] 正文：直接拖图片进 Markdown 编辑区，能上传并插入图片语法。
  - [ ] 草稿开关默认关闭。
  - [ ] 点“发布/保存”，提示 commit 成功。
- [ ] 打开 GitHub 仓库，能看到刚才的 commit；Actions 里 `Deploy to GitHub Pages` 开始运行。
- [ ] 等 Actions 变绿，刷新线上文章列表，能看到新文章。
- [ ] 打开媒体库：
  - [ ] 能浏览 `uploads/posts` 和 `uploads/illustrations`。
  - [ ] 能一次选多张图片上传（批量）。
  - [ ] 能搜索、重命名、删除、复制图片 URL。
- [ ] 新建插画：
  - [ ] “图片”字段点“添加图片”，一次选多张。
  - [ ] 能调整图片顺序（如果界面提供拖拽手柄）。
  - [ ] 填描述、分类、标签，发布。
- [ ] 把一篇文章设为草稿并发布：
  - [ ] 首页、文章列表、归档、搜索里都不出现。
  - [ ] 直接访问它的 URL 应该 404（因为静态页面不会生成）。
- [ ] 删除一篇测试文章，确认线上列表同步消失（或至少不再构建该页面）。

---

## C. 手机端浏览（iPhone Safari / Android Chrome，390×844）

- [ ] 首页单列显示，左右侧边栏隐藏。
- [ ] 顶部只显示 Logo、搜索、主题、汉堡按钮；没有横向溢出。
- [ ] 点汉堡按钮，菜单展开；点导航项后菜单关闭。
- [ ] Hero 标题不溢出，按钮可点。
- [ ] 文章卡片图片不拉伸，文字不重叠。
- [ ] 插画卡片单列/双列自适应，缩略图不变形。
- [ ] 文章详情正文字号可读，代码块可横向滚动而不是撑破页面。
- [ ] 插画详情多图上下排列；灯箱可打开/关闭，左右滑动或按钮可切换。
- [ ] 页面底部能看到统计/标签卡片（移动端移到底部）。
- [ ] 深色模式切换正常。
- [ ] 搜索弹层占满可用宽度，输入法弹出时结果仍可滚动。
- [ ] 归档页类型按钮和标签下拉在触屏上可操作。

---

## D. 手机端后台（/admin/）

- [ ] 手机浏览器打开线上 `/admin/`，能登录（Token 方式）。
- [ ] 后台界面没有横向溢出，按钮可点。
- [ ] 新建文章：标题、日期、分类、标签可正常输入。
- [ ] 点封面上传，能打开系统选择器，从相册选图或拍照。
- [ ] 正文图片：点插入图片，能打开相册/相机；上传后编辑器里能看到图片。
- [ ] 新建插画：点“添加图片”，能一次选多张；部分浏览器只能单选的，重复添加也能成功。
- [ ] 图片上传过程中有进度/禁用状态，不会重复提交。
- [ ] 保存后 GitHub 有 commit；Actions 构建成功；手机刷新线上页面能看到新内容。
- [ ] 在手机上编辑一篇已有文章，修改标题/标签后保存，线上更新。
- [ ] 手机浏览器切到后台再回来，登录状态仍在（localStorage 未被清理的前提下）。

> 手机端不要用来排长文。建议手机负责：新建、选图、填元数据、保存；电脑负责正文精修。

---

## E. 隐私与安全

- [ ] 任意页面源代码含：
  ```html
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, max-image-preview:none">
  ```
- [ ] `/admin/` 页面也含 noindex。
- [ ] `/robots.txt` 内容为 `User-agent: * / Disallow: /`。
- [ ] 用 Google/Bing 的 `site:<你的域名>` 搜索，确认没有收录（新站可能需要几天到几周；已收录的要在站长工具提交移除）。
- [ ] 确认仓库是 Public 时，不要把隐私内容、密码、Token、身份证照片放进去。
- [ ] 确认 Token 没有出现在任何 commit、Issue、日志里。
- [ ] 如果绑定了自定义域名，确认 `https://<域名>/robots.txt` 可访问；项目页模式下 `robots.txt` 在子路径，不要误以为它在域名根。

---

## F. 备份

- [ ] 打开 Actions → `Backup repository` → **Run workflow**，运行成功。
- [ ] 仓库分支列表出现 `backup`。
- [ ] `backup` 分支里有 `latest.zip` 和 `latest.bundle`。
- [ ] 下载 `latest.zip`，解压后能看到 `src/content`、`public/uploads`、`docs`。
- [ ] 下载 `latest.bundle`，执行：
  ```bash
  git clone latest.bundle test-restore
  cd test-restore
  git log --oneline -3
  ```
  能看到完整历史。
- [ ] 确认 `latest.zip` 里的最新文章就是线上最新文章。
- [ ] 记录一次恢复演练日期，下一次三个月后再做。

---

## G. 构建与代码检查

```bash
pnpm build
```

- [ ] 构建成功，生成 `dist/`。
- [ ] `dist/pagefind/` 存在。
- [ ] `dist/robots.txt` 存在。
- [ ] `dist/admin/index.html`、`dist/admin/config.yml`、`dist/admin/sveltia-cms.js` 存在。
- [ ] 构建日志没有 Tailwind 未知类、未解析 import、内容 schema 错误。

可选：

```bash
pnpm check
```

如果 `astro check` 因内存不足退出，用：

```bash
NODE_OPTIONS=--max-old-space-size=6144 pnpm check
```

（Windows PowerShell：`$env:NODE_OPTIONS="--max-old-space-size=6144"; pnpm check`）

---

## H. 发布后回归（线上地址）

把 `<用户名>` 换成实际用户名：

- [ ] `https://<用户名>.github.io/yulong-yinyao/` 200。
- [ ] `https://<用户名>.github.io/yulong-yinyao/posts/` 200。
- [ ] `https://<用户名>.github.io/yulong-yinyao/illustrations/` 200。
- [ ] `https://<用户名>.github.io/yulong-yinyao/archive/` 200。
- [ ] `https://<用户名>.github.io/yulong-yinyao/about/` 200。
- [ ] `https://<用户名>.github.io/yulong-yinyao/admin/` 200。
- [ ] `https://<用户名>.github.io/yulong-yinyao/robots.txt` 200。
- [ ] 上述页面图片没有 404（打开 DevTools → Network，筛选 404）。
- [ ] 搜索能返回结果。
- [ ] 手机和电脑各发布一篇测试内容后，删除测试内容，确认线上恢复干净。

---

## 验收记录

| 项目 | 电脑 | 手机 | 备注 |
| --- | --- | --- | --- |
| 浏览首页 | ☐ | ☐ | |
| 分类/标签筛选 | ☐ | ☐ | |
| 站内搜索 | ☐ | ☐ | 需 preview/线上 |
| 登录后台 | ☐ | ☐ | PAT |
| 新建文章 | ☐ | ☐ | |
| 上传封面 | ☐ | ☐ | 手机相册/拍照 |
| 批量上传插画 | ☐ | ☐ | 浏览器差异 |
| 发布并自动构建 | ☐ | ☐ | Actions |
| noindex/robots | ☐ | ☐ | |
| 自动备份 | ☐ | — | 手动触发一次 |
| 手动恢复 | ☐ | — | 每季度 |

全部勾选后，再把站点发给未来的自己。
