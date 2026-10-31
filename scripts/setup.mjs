import fs from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';
import { copyCms } from './copy-cms.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitePath = path.join(root, 'config', 'site.json');
const cmsPath = path.join(root, 'public', 'admin', 'config.yml');
const cnamePath = path.join(root, 'public', 'CNAME');

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function normalizeUsername(value) {
  const username = String(value ?? '').trim();
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(username)) {
    fail('GitHub 用户名格式不对：只能包含字母、数字和连字符，且不能以连字符开头或结尾。');
  }
  return username;
}

function normalizeRepo(value) {
  const repo = String(value ?? '').trim();
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(repo) || repo === '.' || repo === '..') {
    fail('仓库名格式不对：只能包含字母、数字、点、下划线和连字符。');
  }
  return repo;
}

function normalizeDomain(value) {
  const raw = String(value ?? '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .toLowerCase();
  if (!raw) return '';
  if (
    raw.length > 253 ||
    !/^(?=.{1,253}$)(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/.test(raw)
  ) {
    fail('域名格式不对。示例：blog.example.com；没有域名就直接回车留空。');
  }
  return raw;
}

const current = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
const envUsername = process.env.GITHUB_USERNAME;
const envRepo = process.env.REPO_NAME;
const envDomain = process.env.CUSTOM_DOMAIN;

let username = envUsername ? normalizeUsername(envUsername) : '';
let repo = envRepo ? normalizeRepo(envRepo) : String(current.repoName || 'yulong-yinyao');
let domain = envDomain !== undefined ? normalizeDomain(envDomain) : String(current.customDomain || '');

const needsPrompt =
  !username ||
  current.githubUsername === 'your-github-username' ||
  envRepo === undefined ||
  envDomain === undefined;

if (needsPrompt && input.isTTY) {
  const rl = createInterface({ input, output });
  try {
    console.log('\n配置 yulong_yinyao 博客\n');
    console.log('这些信息只写入 config/site.json 和 public/admin/config.yml，不会上传到别处。\n');

    if (!username) {
      const answer = await rl.question('GitHub 用户名（例如 alice，不是邮箱）：');
      username = normalizeUsername(answer);
    }

    if (envRepo === undefined) {
      const answer = await rl.question(`仓库名 [${repo}]：`);
      if (answer.trim()) repo = normalizeRepo(answer);
    }

    if (envDomain === undefined) {
      const answer = await rl.question('自定义域名（没有就直接回车）：');
      domain = normalizeDomain(answer);
    }
  } finally {
    rl.close();
  }
}

if (!username) {
  fail(
    [
      '还没有填写 GitHub 用户名。',
      '可以交互运行：pnpm setup',
      '或者非交互运行：',
      '  GITHUB_USERNAME=你的用户名 REPO_NAME=yulong-yinyao pnpm setup',
    ].join('\n'),
  );
}

repo = normalizeRepo(repo);
domain = normalizeDomain(domain);

const base = domain ? '' : `/${repo}`;
const siteUrl = domain ? `https://${domain}/` : `https://${username}.github.io/${repo}/`;
const publicUploads = `${base}/uploads`;
const publicPosts = `${base}/uploads/posts`;
const publicIllustrations = `${base}/uploads/illustrations`;

const nextSite = {
  ...current,
  githubUsername: username,
  repoName: repo,
  customDomain: domain,
};
fs.writeFileSync(sitePath, `${JSON.stringify(nextSite, null, 2)}\n`, 'utf8');

let cms = fs.readFileSync(cmsPath, 'utf8');
cms = cms
  .replace(/^  repo:.*$/m, `  repo: ${username}/${repo}`)
  .replace(/^site_url:.*$/m, `site_url: ${siteUrl}`)
  .replace(/^display_url:.*$/m, `display_url: ${siteUrl}`)
  .replace(/^logo_url:.*\n?/m, '')
  .replace(/^(\s*src:\s*).*avatar\.svg.*$/m, `$1${siteUrl}avatar.svg`)
  .replace(/^media_folder:.*$/m, `media_folder: /public/uploads`)
  .replace(/^public_folder:.*$/m, `public_folder: ${publicUploads}`)
  .replace(/^(\s+)media_folder:.*uploads\/posts.*$/gm, `$1media_folder: /public/uploads/posts`)
  .replace(/^(\s+)public_folder:.*uploads\/posts.*$/gm, `$1public_folder: ${publicPosts}`)
  .replace(
    /^(\s+)media_folder:.*uploads\/illustrations.*$/gm,
    `$1media_folder: /public/uploads/illustrations`,
  )
  .replace(
    /^(\s+)public_folder:.*uploads\/illustrations.*$/gm,
    `$1public_folder: ${publicIllustrations}`,
  );
fs.writeFileSync(cmsPath, cms, 'utf8');

if (domain) {
  fs.writeFileSync(cnamePath, `${domain}\n`, 'utf8');
} else {
  fs.rmSync(cnamePath, { force: true });
}

copyCms();

console.log('\n✓ 配置完成');
console.log(`  站点：${siteUrl}`);
console.log(`  仓库：https://github.com/${username}/${repo}`);
console.log(`  后台：${siteUrl}admin/`);
console.log('\n接下来：');
const localAdmin = domain ? '/admin/' : `/${repo}/admin/`;
console.log('  1. pnpm install');
console.log(`  2. pnpm dev，打开 http://localhost:4321${localAdmin} 用 GitHub Token 登录`);
console.log('  3. 第一次推送前，先按 docs/DEPLOY.md 建仓库并开启 GitHub Pages');
console.log('  4. 提交并推送后，GitHub Actions 会自动构建和部署\n');
