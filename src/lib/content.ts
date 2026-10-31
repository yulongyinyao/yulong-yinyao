import { getCollection, type CollectionEntry } from 'astro:content';
import {
  formatDate,
  illustrationHref,
  postHref,
  withBase,
} from '../consts';
import {
  ILLUSTRATION_CATEGORIES,
  POST_CATEGORIES,
  type IllustrationCategory,
  type PostCategory,
} from '../data/categories';

export type PostEntry = CollectionEntry<'posts'>;
export type IllustrationEntry = CollectionEntry<'illustrations'>;

export interface CategoryCount {
  slug: string;
  label: string;
  count: number;
}

export interface TagCount {
  name: string;
  count: number;
  href: string;
}

export interface RecentItem {
  title: string;
  href: string;
  date: string;
  type: 'post' | 'illustration';
}

export async function getPublishedPosts(): Promise<PostEntry[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export async function getPublishedIllustrations(): Promise<IllustrationEntry[]> {
  const illustrations = await getCollection('illustrations', ({ data }) => !data.draft);
  return illustrations.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

function countPostsByCategory(posts: PostEntry[]): CategoryCount[] {
  return POST_CATEGORIES.map((category) => ({
    slug: category.slug,
    label: category.label,
    count: posts.filter((post) => post.data.category === (category.slug as PostCategory)).length,
  }));
}

function countIllustrationsByCategory(illustrations: IllustrationEntry[]): CategoryCount[] {
  return ILLUSTRATION_CATEGORIES.map((category) => ({
    slug: category.slug,
    label: category.label,
    count: illustrations.filter(
      (illustration) => illustration.data.category === (category.slug as IllustrationCategory),
    ).length,
  }));
}

export function collectTags(
  posts: PostEntry[],
  illustrations: IllustrationEntry[],
): TagCount[] {
  const counts = new Map<string, number>();

  for (const entry of [...posts, ...illustrations]) {
    for (const tag of entry.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
      href: `${withBase('/archive/')}?tag=${encodeURIComponent(name)}`,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

export function collectRecent(
  posts: PostEntry[],
  illustrations: IllustrationEntry[],
): RecentItem[] {
  const items: RecentItem[] = [
    ...posts.map((post) => ({
      title: post.data.title,
      href: postHref(post.id),
      date: formatDate(post.data.date),
      type: 'post' as const,
      rawDate: post.data.date,
    })),
    ...illustrations.map((illustration) => ({
      title: illustration.data.title,
      href: illustrationHref(illustration.id),
      date: formatDate(illustration.data.date),
      type: 'illustration' as const,
      rawDate: illustration.data.date,
    })),
  ];

  return items
    .sort((a, b) => b.rawDate.localeCompare(a.rawDate))
    .slice(0, 6)
    .map(({ rawDate: _rawDate, ...item }) => item);
}

export async function getSiteData() {
  const [posts, illustrations] = await Promise.all([
    getPublishedPosts(),
    getPublishedIllustrations(),
  ]);

  const tags = collectTags(posts, illustrations);
  const recent = collectRecent(posts, illustrations);
  const postCategories = countPostsByCategory(posts);
  const illustrationCategories = countIllustrationsByCategory(illustrations);
  const dates = [...posts, ...illustrations].map((entry) => entry.data.date).sort();

  return {
    posts,
    illustrations,
    postCount: posts.length,
    illustrationCount: illustrations.length,
    categoryCount: POST_CATEGORIES.length + ILLUSTRATION_CATEGORIES.length,
    tagCount: tags.length,
    tags,
    recent,
    postCategories,
    illustrationCategories,
    latestDate: dates.at(-1) ?? '',
    earliestDate: dates[0] ?? '',
  };
}
