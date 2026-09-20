import type { MetadataRoute } from 'next';
import { articles, events, projects } from '@/data/content';
import { SITE_URL } from '@/lib/site';

const staticRoutes = ['', '/about', '/projects', '/ideas', '/events', '/community', '/sigs', '/open-source', '/research', '/resources', '/blog', '/team', '/achievements', '/gallery', '/join', '/contribute', '/leaderboard', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map(route => ({ url: SITE_URL + route, changeFrequency: (route === '' ? 'weekly' : 'monthly') as const, priority: route === '' ? 1 : 0.7 })),
    ...projects.map(project => ({ url: SITE_URL + '/projects/' + project.slug, changeFrequency: 'monthly' as const, priority: 0.75 })),
    ...events.map(event => ({ url: SITE_URL + '/events/' + event.slug, changeFrequency: 'weekly' as const, priority: event.status === 'ARCHIVED' ? 0.45 : 0.8 })),
    ...articles.map(article => ({ url: SITE_URL + '/blog/' + article.slug, lastModified: article.date, changeFrequency: 'monthly' as const, priority: 0.65 })),
  ];
}
