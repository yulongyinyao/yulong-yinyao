import { writeFileSync } from 'node:fs';

// GitHub Actions 会注入 GITHUB_SHA；本地构建写 dev，页面不会触发自动刷新。
const version = process.env.PUBLIC_BUILD_VERSION || process.env.GITHUB_SHA || 'dev';

writeFileSync('dist/version.json', `${JSON.stringify({ version })}\n`);
console.log(`Wrote dist/version.json (${version.slice(0, 12)}).`);
