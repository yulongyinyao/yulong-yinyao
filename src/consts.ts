import siteConfig from '../config/site.json';

export const site = siteConfig;

export const BASE_PATH = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL.slice(0, -1)
  : import.meta.env.BASE_URL;

/** Prefix an absolute public path with Astro's configured base path. */
export function withBase(path = '/'): string {
  if (!path) return BASE_PATH || '/';
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('#')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // CMS 的 public_folder 可能已经带上了项目页 base，避免重复前缀。
  if (BASE_PATH && (cleanPath === BASE_PATH || cleanPath.startsWith(`${BASE_PATH}/`))) {
    return cleanPath;
  }

  // 从项目页迁移到自定义域名时，旧内容里可能还留着 /<repo>/ 前缀。
  if (!BASE_PATH && cleanPath.startsWith(`/${site.repoName}/`)) {
    return cleanPath.slice(site.repoName.length + 1);
  }

  return `${BASE_PATH}${cleanPath}` || '/';
}

export function postHref(id: string): string {
  return withBase(`/posts/${encodeURIComponent(id)}/`);
}

export function illustrationHref(id: string): string {
  return withBase(`/illustrations/${encodeURIComponent(id)}/`);
}

export function projectHref(id: string): string {
  return withBase(`/projects/${encodeURIComponent(id)}/`);
}

export function categoryHref(type: 'post' | 'illustration', slug: string): string {
  const section = type === 'post' ? 'posts' : 'illustrations';
  return withBase(`/${section}/?category=${encodeURIComponent(slug)}`);
}

export function tagHref(type: 'post' | 'illustration', tag: string): string {
  const section = type === 'post' ? 'posts' : 'illustrations';
  return withBase(`/${section}/?tag=${encodeURIComponent(tag)}`);
}

export function formatDate(value: string): string {
  const iso = String(value).slice(0, 10);
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return iso;
  return `${year}.${month}.${day}`;
}

export function formatDateLong(value: string): string {
  const iso = String(value).slice(0, 10);
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return iso;
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

export function yearOf(value: string): string {
  return String(value).slice(0, 4);
}

/** A small, dependency-free Markdown-to-plain-text helper for excerpts. */
export function stripMarkdown(markdown = ''): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/[*_~]{1,3}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerpt(markdown = '', length = 120): string {
  const text = stripMarkdown(markdown);
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export function readingTime(markdown = ''): number {
  const text = stripMarkdown(markdown);
  const cjk = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const words = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(cjk / 350 + words / 200));
}

export function isConfigured(): boolean {
  return site.githubUsername !== 'your-github-username';
}
