import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const isComingSoonMode = process.env.COMING_SOON_MODE === 'true'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: isComingSoonMode
        ? ['/guides', '/providers', '/admin']
        : ['/admin'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}