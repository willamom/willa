export type AffiliateProductRetailer =
  | 'amazon'
  | 'target'
  | 'walmart'
  | 'babylist'
  | 'kohls'
  | 'etsy'
  | 'other'

export type AffiliateProductCategory =
  | 'postpartum-recovery'
  | 'feeding'
  | 'nursing'
  | 'pumping'
  | 'sleep'
  | 'baby-gear'
  | 'nursery'
  | 'diapering'
  | 'bath'
  | 'clothing'
  | 'pregnancy'
  | 'hospital-bag'
  | 'c-section-recovery'
  | 'mom-care'
  | 'home-help'
  | 'books'
  | 'courses'
  | 'other'

export type AffiliateProductStatus = 'draft' | 'active' | 'archived'

export type AffiliateProduct = {
  id: string
  slug: string
  title: string
  description: string

  retailer: AffiliateProductRetailer
  category: AffiliateProductCategory
  tags: string[]

  affiliateUrl: string
  imageUrl?: string
  priceLabel?: string

  status: AffiliateProductStatus
  isFeatured: boolean

  source?: string
  notes?: string

  createdAt: string
  updatedAt: string
}