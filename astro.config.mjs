import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';

const siteConfig = JSON.parse(
  fs.readFileSync(new URL('./config/site.json', import.meta.url), 'utf8'),
);

const customDomain = String(siteConfig.customDomain ?? '').trim();
const username = String(siteConfig.githubUsername ?? '').trim();
const repoName = String(siteConfig.repoName ?? '').trim();

const defaultSite = customDomain
  ? `https://${customDomain}`
  : `https://${username}.github.io`;
const defaultBase = customDomain ? '/' : `/${repoName}`;

const rawBase = process.env.BASE_PATH ?? defaultBase;
const base = rawBase === '' ? '/' : rawBase;
const uploadBase = base === '/' ? '' : base.replace(/\/+$/, '');

/**
 * Markdown 里的图片通常写成 `/uploads/...`（这样内容与部署地址无关），
 * 但 GitHub Pages 项目页需要 `/yulong-yinyao/uploads/...`。这里在构建时补上 base。
 * 组件里的图片走 `withBase()`，两套路径互不干扰。
 */
function rehypeBaseUploads() {
  return (tree) => {
    const walk = (node) => {
      if (node?.type === 'element' && node.tagName === 'img' && node.properties?.src) {
        const src = String(node.properties.src);
        if (src.startsWith('/uploads/') && uploadBase) {
          node.properties.src = `${uploadBase}${src}`;
        } else if (src.startsWith('uploads/') && uploadBase) {
          node.properties.src = `${uploadBase}/${src}`;
        }
      }
      if (Array.isArray(node?.children)) node.children.forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: process.env.SITE_URL || defaultSite,
  base,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    rehypePlugins: [rehypeBaseUploads],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
