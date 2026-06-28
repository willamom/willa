export type ProviderCategory =
  | 'doula'
  | 'midwife'
  | 'obgyn'
  | 'lactation'
  | 'postpartum-care'
  | 'mental-health'
  | 'pelvic-floor-pt'
  | 'sleep-consultant'
  | 'childbirth-educator'
  | 'nutrition'
  | 'photography'
  | 'meal-service'
  | 'cleaning'
  | 'childcare'
  | 'baby-brand'
  | 'other'

export type ProviderLocation = {
  city: string
  state?: string
  country: string
  address?: string
  lat: number
  lng: number
}

export type WillaProvider = {
  id: string
  slug: string
  name: string
  category: ProviderCategory
  specialties: string[]
  description: string
  location: ProviderLocation

  website?: string
  instagram?: string
  email?: string
  phone?: string

  image?: string
  isFeatured?: boolean
  isVerified?: boolean

  isClaimed?: boolean
  claimedAt?: string
  claimedByEmail?: string
  claimedByName?: string
}