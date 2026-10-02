import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL || 'http://localhost:3000';
  const pages = ['/', '/services', '/portfolio', '/about', '/faq', '/contact', '/quote'].map(path => ({ url: base + path }));
  const items = await db.portfolioItem.findMany({ where: { visible: true }, select: { id: true, updatedAt: true } }).catch(() => []);
  return [...pages, ...items.map(i => ({ url: `${base}/portfolio/${i.id}`, lastModified: i.updatedAt }))];
}
