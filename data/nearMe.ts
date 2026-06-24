export type SupportOption = {
  type: string
  category: string
  description: string
  distance: string
  href: string
}

export const supportOptions: SupportOption[] = [
  {
    type: 'Lactation consultant',
    category: 'Feeding',
    description:
      'Support with latch, pumping, bottle feeding, pain, supply questions, and feeding confidence.',
    distance: 'Near you',
    href: '#',
  },
  {
    type: 'Postpartum doula',
    category: 'Postpartum',
    description:
      'Practical help after birth: newborn care, recovery support, meals, rest, and emotional support.',
    distance: 'Local',
    href: '#',
  },
  {
    type: 'Pelvic floor therapist',
    category: 'Recovery',
    description:
      'Support for pregnancy and postpartum recovery, pelvic pain, leaking, core strength, and healing.',
    distance: 'Nearby',
    href: '#',
  },
  {
    type: 'Birth doula',
    category: 'Birth',
    description:
      'Support before and during birth with planning, advocacy, comfort measures, and emotional care.',
    distance: 'Near you',
    href: '#',
  },
  {
    type: 'Postpartum therapist',
    category: 'Mental health',
    description:
      'Mental health support for anxiety, overwhelm, identity shifts, birth processing, and postpartum mood.',
    distance: 'Local',
    href: '#',
  },
  {
    type: 'Meal support',
    category: 'Home help',
    description:
      'Meal trains, postpartum meal prep, grocery support, and practical food help for the first weeks.',
    distance: 'Nearby',
    href: '#',
  },
]