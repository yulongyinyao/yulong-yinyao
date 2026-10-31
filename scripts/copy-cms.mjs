import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'node_modules', '@sveltia', 'cms', 'dist', 'sveltia-cms.js');
const target = path.join(root, 'public', 'admin', 'sveltia-cms.js');

export function copyCms() {
  if (!fs.existsSync(source)) {
    console.error(
      [
        '找不到 Sveltia CMS 的浏览器包：',
        `  ${source}`,
        '',
        '请先执行：',
        '  pnpm install',
        '然后重试：',
        '  pnpm cms:copy',
      ].join('\n'),
    );
    process.exitCode = 1;
    return false;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  const size = (fs.statSync(target).size / 1024).toFixed(0);
  console.log(`已复制 Sveltia CMS → public/admin/sveltia-cms.js (${size} KB)`);
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  copyCms();
}
