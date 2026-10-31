export interface Friend {
  name: string;
  url: string;
  description: string;
  avatar?: string;
}

/**
 * 友链是静态数据，直接改这个文件即可。
 * 例：
 * { name: '朋友的名字', url: 'https://example.com', description: '一句话介绍' }
 */
export const friends: Friend[] = [];
