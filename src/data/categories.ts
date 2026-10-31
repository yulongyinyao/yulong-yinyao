export const POST_CATEGORIES = [
  { slug: 'essay', label: '随笔', description: '一些不急着得出结论的文字。' },
  { slug: 'tech', label: '技术', description: '折腾过的工具、代码与踩坑记录。' },
  { slug: 'life', label: '生活', description: '日常里值得收好的小片段。' },
  { slug: 'creation', label: '创作', description: '关于画、故事与灵感的笔记。' },
] as const;

export const ILLUSTRATION_CATEGORIES = [
  { slug: 'original', label: '原创', description: '从空白画布开始的作品。' },
  { slug: 'practice', label: '练习', description: '练习、速写与过程稿。' },
  { slug: 'fanart', label: '同人', description: '献给喜欢的角色与作品。' },
  { slug: 'commission', label: '约稿', description: '接受委托完成的作品。' },
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number]['slug'];
export type IllustrationCategory = (typeof ILLUSTRATION_CATEGORIES)[number]['slug'];

export const POST_CATEGORY_SLUGS = POST_CATEGORIES.map((item) => item.slug) as [
  PostCategory,
  ...PostCategory[],
];

export const ILLUSTRATION_CATEGORY_SLUGS = ILLUSTRATION_CATEGORIES.map((item) => item.slug) as [
  IllustrationCategory,
  ...IllustrationCategory[],
];

export const ALL_CATEGORY_GROUPS = [
  { type: 'post' as const, label: '文章分类', items: POST_CATEGORIES },
  { type: 'illustration' as const, label: '插画分类', items: ILLUSTRATION_CATEGORIES },
];

export function categoryLabel(type: 'post' | 'illustration', slug: string): string {
  const list = type === 'post' ? POST_CATEGORIES : ILLUSTRATION_CATEGORIES;
  return list.find((item) => item.slug === slug)?.label ?? slug;
}
