export type GuideCategory =
  | 'Pregnancy'
  | 'Birth & Hospital Plan'
  | 'Fourth Trimester'
  | 'Mom Life'
  | 'Nesting'
  | 'Support & Services'

export type GuideStatus = 'draft' | 'published'

export type GuideImage = {
  src: string
  alt: string
}

export type GuideSection = {
  heading: string
  body: string | string[]
  bullets?: string[]
  related?: string
}

export type GuideDownload = {
  title: string
  description: string
  href: string
}

export type GuideRecommendedItem = {
  title: string
  description: string
  href?: string
  affiliate?: boolean
}

export type Guide = {
  slug: string
  title: string
  description: string
  category: GuideCategory
  stage: string
  readTime: string

  status: GuideStatus
  featured?: boolean
  sortOrder?: number

  seoTitle?: string
  seoDescription?: string
  lastUpdated?: string

  image?: GuideImage

  intro?: string[]
  sections: GuideSection[]
  closing?: string[]

  relatedSlugs?: string[]
  downloads?: GuideDownload[]
  recommendedItems?: GuideRecommendedItem[]
  affiliateDisclosure?: boolean
}