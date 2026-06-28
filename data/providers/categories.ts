import type { ProviderCategory } from '@/types/providers'

export type ProviderCategoryConfig = {
  slug: ProviderCategory
  label: string
  description: string
  color: string
}

export const providerCategories: ProviderCategoryConfig[] = [
  {
    slug: 'doula',
    label: 'Doulas',
    description: 'Birth and postpartum support before, during, and after baby.',
    color: '#a45f51',
  },
  {
    slug: 'midwife',
    label: 'Midwives',
    description: 'Pregnancy, birth, and postpartum care providers.',
    color: '#7d8a5f',
  },
  {
    slug: 'obgyn',
    label: 'OB/GYNs',
    description: 'Medical pregnancy and birth care.',
    color: '#6d7f91',
  },
  {
    slug: 'lactation',
    label: 'Lactation Consultants',
    description: 'Breastfeeding, pumping, latch, and feeding support.',
    color: '#c58b7c',
  },
  {
    slug: 'postpartum-care',
    label: 'Postpartum Care',
    description: 'In-home recovery, newborn, and family support.',
    color: '#9b6f8f',
  },
  {
    slug: 'mental-health',
    label: 'Mental Health',
    description: 'Therapists and emotional support for pregnancy and postpartum.',
    color: '#7b6fa8',
  },
  {
    slug: 'pelvic-floor-pt',
    label: 'Pelvic Floor PT',
    description: 'Pelvic floor recovery, pain, strength, and body support.',
    color: '#5f8f82',
  },
  {
    slug: 'sleep-consultant',
    label: 'Sleep Consultants',
    description: 'Baby and family sleep support.',
    color: '#6f7898',
  },
  {
    slug: 'childbirth-educator',
    label: 'Childbirth Educators',
    description: 'Classes and preparation for labor, birth, and newborn life.',
    color: '#b88a54',
  },
  {
    slug: 'nutrition',
    label: 'Nutrition',
    description: 'Pregnancy, postpartum, and family nutrition support.',
    color: '#8d9b61',
  },
  {
    slug: 'photography',
    label: 'Photographers',
    description: 'Maternity, birth, newborn, and family photography.',
    color: '#a98568',
  },
  {
    slug: 'meal-service',
    label: 'Meal Services',
    description: 'Meal delivery, postpartum meal prep, and family food support.',
    color: '#d0955f',
  },
  {
    slug: 'cleaning',
    label: 'Cleaning Services',
    description: 'Home help for pregnancy and postpartum life.',
    color: '#8f9b9a',
  },
  {
    slug: 'childcare',
    label: 'Childcare',
    description: 'Sibling care, newborn care, and family support.',
    color: '#c27c85',
  },
  {
    slug: 'baby-brand',
    label: 'Brands',
    description: 'Mom, baby, home, recovery, and wellness brands.',
    color: '#b07958',
  },
  {
    slug: 'other',
    label: 'Other',
    description: 'Other pregnancy, birth, postpartum, and family support.',
    color: '#8a8277',
  },
]

export function getProviderCategoryConfig(category: ProviderCategory) {
  return (
    providerCategories.find((item) => item.slug === category) ??
    providerCategories[providerCategories.length - 1]
  )
}