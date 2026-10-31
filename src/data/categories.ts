import categoryData from '../../config/categories.json';

export interface Category {
  slug: string;
  label: string;
  description: string;
}

type CategoryInput = {
  slug: string;
  label: string;
  description?: string;
};

function normalize(items: CategoryInput[]): Category[] {
  return items.map((item) => ({
    slug: item.slug,
    label: item.label,
    description: item.description ?? '',
  }));
}

export const POST_CATEGORIES: Category[] = normalize(categoryData.posts);
export const ILLUSTRATION_CATEGORIES: Category[] = normalize(categoryData.illustrations);

export type PostCategory = string;
export type IllustrationCategory = string;

export const POST_CATEGORY_SLUGS = POST_CATEGORIES.map((item) => item.slug);
export const ILLUSTRATION_CATEGORY_SLUGS = ILLUSTRATION_CATEGORIES.map((item) => item.slug);

export const ALL_CATEGORY_GROUPS = [
  { type: 'post' as const, label: '文章分类', items: POST_CATEGORIES },
  { type: 'illustration' as const, label: '插画分类', items: ILLUSTRATION_CATEGORIES },
];

export function categoryLabel(type: 'post' | 'illustration', slug: string): string {
  const list = type === 'post' ? POST_CATEGORIES : ILLUSTRATION_CATEGORIES;
  return list.find((item) => item.slug === slug)?.label ?? slug;
}
