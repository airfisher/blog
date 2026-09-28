import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../site';
export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({ title: site.title, description: site.description, site: context.site!,
    items: posts.map(post => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: `/posts/${post.id}/` })),
    customData: '<language>zh-cn</language>',
  });
}
