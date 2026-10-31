# 备份与恢复

这个站点的内容不是存在数据库里，而是存在 Git 仓库里。所以“备份”有两层：

1. **每次保存就是一次 commit**：后台每保存一次，GitHub 上就多一条可回滚的记录。
2. **每周自动打包**：`.github/workflows/backup.yml` 把当前快照和完整 Git 历史推到 `backup` 分支，防止误删、误改、仓库异常。

---

## 1. 自动备份做了什么

工作流：`.github/workflows/backup.yml`

- 时间：每周一 03:00 UTC（北京时间 11:00）。
- 也可以手动触发：仓库 → **Actions** → **Backup repository** → **Run workflow**。
- 产出两个文件，提交到 `backup` 分支：

| 文件 | 内容 | 用途 |
| --- | --- | --- |
| `latest.zip` | 当前 `main` 分支的完整文件快照（不含 `.git`） | 快速拿走内容、换电脑、重新部署 |
| `latest.bundle` | `main` 的完整 Git 历史（所有 commit） | 完整恢复仓库，包括历史版本 |

- `backup` 是一个 **orphan 分支**（没有共同祖先），每次 force-push 覆盖，只保留最新一份，不会让仓库历史越来越臃肿。
- 备份分支不会触发 Pages 部署，也不会出现在站点导航里。

> GitHub 会在仓库连续 60 天没有活动后暂停定时 workflow。打开 Actions → `Backup repository` → 如果看到 “This workflow is disabled”，点 **Enable workflow**；或者每周手动 Run workflow 一次。

---

## 2. 手动下载自动备份（最简单）

1. 打开仓库：`https://github.com/<用户名>/yulong-yinyao`。
2. 点分支切换器（默认显示 `main`），选择 `backup`。
3. 进入后能看到 `latest.zip` 和 `latest.bundle`。
4. 点文件右上角的 **Download**（下载图标）。

也可以直接访问：

```text
https://github.com/<用户名>/yulong-yinyao/tree/backup
```

> 手机浏览器也能下载，但大文件建议用电脑。

---

## 3. 手动导出当前仓库（不依赖 Actions）

### 方式 A：GitHub 网页下载 ZIP

1. 仓库首页 → 绿色 **Code** 按钮 → **Download ZIP**。
2. 得到的是当前分支的文件快照，**不包含 Git 历史**。
3. 适合“我只想拿走文章和图片”，不适合回滚。

### 方式 B：完整克隆到本地（推荐）

```bash
git clone https://github.com/<用户名>/yulong-yinyao.git
```

这会得到完整历史。想连所有分支一起：

```bash
git clone --mirror https://github.com/<用户名>/yulong-yinyao.git yulong-yinyao.git
```

`--mirror` 是裸仓库，适合做冷备份；日常编辑用普通 clone 即可。

### 方式 C：本地生成 bundle

在仓库目录：

```bash
git bundle create yulong-yinyao-$(date +%Y%m%d).bundle --all
```

得到一个单文件，包含所有分支和标签。把它放到移动硬盘/网盘即可。

### 方式 D：只导出当前快照

```bash
git archive --format=zip --output=yulong-yinyao.zip HEAD
```

---

## 4. 从 ZIP 恢复

1. 解压 `latest.zip`（或 GitHub 下载的 ZIP）。
2. 进入目录，安装依赖：

```bash
pnpm install
pnpm dev
```

3. 打开 <http://localhost:4321/yulong-yinyao/> 检查内容。
4. 如果要重新发布，按 `docs/DEPLOY.md` 建仓库、推送、开 Pages。

> ZIP 里没有 `.git`，所以没有历史。要保留历史，用 bundle 或 clone。

---

## 5. 从 bundle 完整恢复

```bash
# 1. 从 bundle 克隆出一个完整仓库
git clone latest.bundle yulong-yinyao-restored
cd yulong-yinyao-restored

# 2. 检查分支和历史
git branch -a
git log --oneline -5

# 3. 换回原来的远程地址（如果仓库还在）
git remote set-url origin https://github.com/<用户名>/yulong-yinyao.git

# 4. 推送恢复
git push origin --all
git push origin --tags
```

如果原仓库已经删了，先在 GitHub 新建一个空仓库，再把 `origin` 指向新地址。

> bundle 里可能包含 `refs/remotes/origin/*`。恢复后如果看到多余的远程分支引用，不影响使用；需要清理可以 `git remote prune origin`。

---

## 6. 从 `backup` 分支恢复某次快照

`backup` 分支只保留最新一份，没有历史版本。如果需要“上周的版本”，只能从 `main` 的 commit 历史里找：

```bash
git log --oneline
git checkout <commit>
```

或者在 GitHub 网页上打开某次 commit → **Browse files** → 下载单个文件。

---

## 7. 重要限制

- **单文件 100MB**：GitHub 对单个文件有限制。`latest.bundle` 随历史增长可能变大；如果超过 100MB，备份会失败。届时可以：
  - 清理不必要的大文件（历史里的旧图仍占空间）；
  - 改用 Git LFS（需要额外配置，当前没有启用）；
  - 只保留 `latest.zip`，或把 bundle 上传到网盘。
- **仓库总大小**：GitHub 建议仓库尽量小于 1GB，Pages 站点也有 1GB 限制。插画上传前压缩，长边 ≤2000px、单张尽量 ≤500KB。
- **备份分支是公开的**：public 仓库的 `backup` 分支任何人都能下载。它和主仓库的隐私级别一样。
- **不要只依赖 GitHub**：建议每季度把 `latest.bundle` 下载到本地/移动硬盘，并实际恢复一次。没有验证过的备份不算备份。

---

## 8. 每季度 5 分钟检查

- [ ] 打开 Actions，确认 `Backup repository` 最近一次成功。
- [ ] 下载 `latest.zip`，解压后能正常 `pnpm install && pnpm dev`。
- [ ] 下载 `latest.bundle`，`git clone` 后 `git log` 有完整历史。
- [ ] 确认 `main` 上最新文章在 ZIP 里。
- [ ] 确认备份文件大小没有接近 100MB。
