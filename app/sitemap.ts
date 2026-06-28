import type { MetadataRoute } from 'next'

import { guides } from '@/data/guides'
import { getPublishedProviders } from '@/lib/providers'
import { siteConfig } from '@/lib/site'

export const revalidate = 3600

const staticRoutes = [
  {
    path: '',
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    path: '/privacy',
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    path: '/terms',
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    path: '/cookies',
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    path: '/disclaimer',
    changeFrequency: 'monthly',
    priority: 0.4,
  },
] as const

const appRoutes = [
  {
    path: '/guides',
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    path: '/providers',
    changeFrequency: 'weekly',
    priority: 0.8,
  },
] as const

function buildUrl(path: string) {
  return `${siteConfig.url}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const isComingSoonMode = process.env.COMING_SOON_MODE === 'true'

  const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: buildUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  if (isComingSoonMode) {
    return routes
  }

  routes.push(
    ...appRoutes.map((route) => ({
      url: buildUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  )

  routes.push(
    ...guides.map((guide) => ({
      url: buildUrl(`/guides/${guide.slug}`),
      lastModified: guide.lastUpdated
        ? new Date(guide.lastUpdated)
        : now,
      changeFrequency: 'monthly' as const,
      priority: guide.featured ? 0.85 : 0.75,
    }))
  )

  try {
    const providers = await getPublishedProviders()

    routes.push(
      ...providers.map((provider) => ({
        url: buildUrl(`/providers/${provider.slug}`),
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: provider.isFeatured ? 0.75 : 0.65,
      }))
    )
  } catch (error) {
    console.error('Error building provider sitemap:', error)
  }

  return routes
}