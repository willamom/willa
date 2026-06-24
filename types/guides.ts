export type GuideSection = {
  heading: string
  body: string
}

export type Guide = {
  slug: string
  title: string
  description: string
  category: string
  stage: string
  readTime: string
  featured?: boolean
  sections: GuideSection[]
}