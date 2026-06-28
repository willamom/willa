import type { Guide } from '@/types/guides'

import { birthHospitalGuides } from './birth-hospital'
import { momLifeGuides } from './mom-life'
import { nestingGuides } from './nesting'
import { postpartumGuides } from './postpartum'
import { pregnancyGuides } from './pregnancy'
import { supportServicesGuides } from './support-services'

export { guideCategories } from './categories'

export const allGuides: Guide[] = [
  ...pregnancyGuides,
  ...birthHospitalGuides,
  ...postpartumGuides,
  ...momLifeGuides,
  ...nestingGuides,
  ...supportServicesGuides,
]

export const guides = allGuides
  .filter((guide) => guide.status === 'published')
  .sort((a, b) => {
    const orderA = a.sortOrder ?? 999
    const orderB = b.sortOrder ?? 999

    if (orderA !== orderB) {
      return orderA - orderB
    }

    return a.title.localeCompare(b.title)
  })

const duplicateSlugs = allGuides
  .map((guide) => guide.slug)
  .filter((slug, index, slugs) => slugs.indexOf(slug) !== index)

if (duplicateSlugs.length > 0) {
  throw new Error(
    `Duplicate guide slugs found: ${Array.from(new Set(duplicateSlugs)).join(
      ', '
    )}`
  )
}