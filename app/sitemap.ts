import type { MetadataRoute } from 'next'

import { guides } from '@/data/guides'
import { siteConfig } from '@/lib/site'

const staticRoutes = [
  {
    route: '',
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    route: '/guides',
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    route: '/registry',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    route: '/near-me',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    route: '/privacy',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    route: '/terms',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    route: '/cookies',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    route: '/disclaimer',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
] satisfies Array<{
  route: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}>

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((item) => ({
    url: `${siteConfig.url}${item.route}`,
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }))

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${siteConfig.url}/guides/${guide.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticPages, ...guidePages]
}