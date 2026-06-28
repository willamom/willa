import type { GuideCategory } from '@/types/guides'

export type GuideCategoryConfig = {
  label: GuideCategory
  slug: string
  description: string
}

export const guideCategories: GuideCategoryConfig[] = [
  {
    label: 'Pregnancy',
    slug: 'pregnancy',
    description:
      'Guides for symptoms, appointments, planning, and the final stretch before baby arrives.',
  },
  {
    label: 'Birth & Hospital Plan',
    slug: 'birth-hospital-plan',
    description:
      'Birth plans, hospital bags, labor questions, c-section prep, and discharge planning.',
  },
  {
    label: 'Fourth Trimester',
    slug: 'fourth-trimester',
    description:
      'Postpartum recovery, newborn life, visitors, warning signs, feeding, and support.',
  },
  {
    label: 'Mom Life',
    slug: 'mom-life',
    description:
      'The emotional, practical, and identity-shifting parts of becoming a mom.',
  },
  {
    label: 'Nesting',
    slug: 'nesting',
    description:
      'Home setup, registry ideas, recovery stations, baby essentials, and affiliate-friendly planning.',
  },
  {
    label: 'Support & Services',
    slug: 'support-services',
    description:
      'Doulas, lactation consultants, pelvic floor therapy, mental health, and local support.',
  },
]