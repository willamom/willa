import type {
  AffiliateProductCategory,
  AffiliateProductRetailer,
  AffiliateProductStatus,
} from '@/types/affiliate-products'

export type AffiliateOption<T extends string> = {
  value: T
  label: string
}

export const affiliateRetailerOptions: AffiliateOption<AffiliateProductRetailer>[] =
  [
    { value: 'amazon', label: 'Amazon' },
    { value: 'target', label: 'Target' },
    { value: 'walmart', label: 'Walmart' },
    { value: 'babylist', label: 'Babylist' },
    { value: 'kohls', label: "Kohl's" },
    { value: 'etsy', label: 'Etsy' },
    { value: 'other', label: 'Other' },
  ]

export const affiliateCategoryOptions: AffiliateOption<AffiliateProductCategory>[] =
  [
    { value: 'postpartum-recovery', label: 'Postpartum Recovery' },
    { value: 'feeding', label: 'Feeding' },
    { value: 'nursing', label: 'Nursing' },
    { value: 'pumping', label: 'Pumping' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'baby-gear', label: 'Baby Gear' },
    { value: 'nursery', label: 'Nursery' },
    { value: 'diapering', label: 'Diapering' },
    { value: 'bath', label: 'Bath' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'pregnancy', label: 'Pregnancy' },
    { value: 'hospital-bag', label: 'Hospital Bag' },
    { value: 'c-section-recovery', label: 'C-Section Recovery' },
    { value: 'mom-care', label: 'Mom Care' },
    { value: 'home-help', label: 'Home Help' },
    { value: 'books', label: 'Books' },
    { value: 'courses', label: 'Courses' },
    { value: 'other', label: 'Other' },
  ]

export const affiliateStatusOptions: AffiliateOption<AffiliateProductStatus>[] =
  [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ]

export function getAffiliateRetailerLabel(value: AffiliateProductRetailer) {
  return (
    affiliateRetailerOptions.find((option) => option.value === value)?.label ??
    'Other'
  )
}

export function getAffiliateCategoryLabel(value: AffiliateProductCategory) {
  return (
    affiliateCategoryOptions.find((option) => option.value === value)?.label ??
    'Other'
  )
}