import type { Guide } from '@/types/guides'

export const guideTemplate: Guide = {
  slug: 'example-guide-slug',
  title: 'Example Guide Title',
  description: 'Short description for the guide card and SEO preview.',
  category: 'Pregnancy',
  stage: 'Third Trimester',
  readTime: '8 min read',
  status: 'draft',
  featured: false,
  sortOrder: 100,

  seoTitle: 'Example Guide Title | Willa',
  seoDescription: 'Short SEO description for this guide.',
  lastUpdated: '2026-06-27',

  sections: [
    {
      heading: 'First section heading',
      body: 'Main paragraph for this section.',
    },
    {
      heading: 'Second section heading',
      body: 'Another paragraph.',
      bullets: [
        'Optional bullet one',
        'Optional bullet two',
        'Optional bullet three',
      ],
    },
  ],

  relatedSlugs: [],
  downloads: [],
  recommendedItems: [],
  affiliateDisclosure: false,
}