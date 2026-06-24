export type RegistryItemType = 'product' | 'support' | 'service'

export type RegistryCatalogItem = {
  id: string
  title: string
  category: string
  description: string
  itemType: RegistryItemType
  keywords: string[]
  productUrl?: string
  affiliateUrl?: string
}

export const registryCatalogItems: RegistryCatalogItem[] = [
  {
    id: 'postpartum-recovery-basket',
    title: 'Postpartum recovery basket',
    category: 'Recovery',
    description:
      'A small basket for bathroom recovery with essentials like pads, peri care, and comfort items.',
    itemType: 'product',
    keywords: [
      'recovery',
      'bathroom',
      'bleeding',
      'pads',
      'after birth',
      'postpartum',
      'sore',
      'healing',
    ],
  },
  {
    id: 'peri-bottle',
    title: 'Peri bottle',
    category: 'Recovery',
    description:
      'Helpful for gentle cleaning after birth, especially during the first bathroom trips.',
    itemType: 'product',
    keywords: [
      'peri',
      'bathroom',
      'recovery',
      'tearing',
      'stitches',
      'pee',
      'birth',
      'healing',
    ],
  },
  {
    id: 'postpartum-pads',
    title: 'Postpartum pads',
    category: 'Recovery',
    description:
      'Heavy-duty pads for bleeding and comfort during the first days and weeks after birth.',
    itemType: 'product',
    keywords: [
      'pads',
      'bleeding',
      'recovery',
      'bathroom',
      'postpartum bleeding',
      'hospital',
      'after birth',
    ],
  },
  {
    id: 'witch-hazel-pads',
    title: 'Witch hazel pads',
    category: 'Recovery',
    description:
      'Cooling pads many moms use for soreness, swelling, and bathroom comfort after birth.',
    itemType: 'product',
    keywords: [
      'witch hazel',
      'cooling',
      'sore',
      'swelling',
      'tearing',
      'stitches',
      'bathroom',
      'recovery',
    ],
  },
  {
    id: 'nipple-cream',
    title: 'Nipple cream',
    category: 'Feeding',
    description:
      'A small comfort item for early breastfeeding, pumping, latch soreness, or dry skin.',
    itemType: 'product',
    keywords: [
      'breastfeeding',
      'nursing',
      'nipple',
      'pain',
      'sore nipples',
      'feeding',
      'latch',
      'pumping',
    ],
  },
  {
    id: 'silver-nursing-cups',
    title: 'Silver nursing cups',
    category: 'Feeding',
    description:
      'Reusable cups some breastfeeding moms use for nipple comfort between feeds.',
    itemType: 'product',
    keywords: [
      'breastfeeding',
      'nursing',
      'nipple pain',
      'sore nipples',
      'feeding',
      'latch',
      'silver cups',
    ],
  },
  {
    id: 'lactation-consultant-visit',
    title: 'Lactation consultant visit',
    category: 'Feeding',
    description:
      'Professional feeding support for latch, supply, pumping, bottle feeding, or feeding anxiety.',
    itemType: 'service',
    keywords: [
      'breastfeeding',
      'feeding',
      'lactation',
      'latch',
      'milk supply',
      'pumping',
      'bottle',
      'nursing',
    ],
  },
  {
    id: 'meal-train',
    title: 'Meal train',
    category: 'Meals',
    description:
      'A simple way for friends or family to help with dinners during the first weeks home.',
    itemType: 'support',
    keywords: [
      'food',
      'meals',
      'dinner',
      'cooking',
      'meal train',
      'help',
      'postpartum',
      'first week',
    ],
  },
  {
    id: 'grocery-delivery',
    title: 'Grocery delivery',
    category: 'Meals',
    description:
      'Groceries delivered without needing to pack the baby, leave the house, or think too hard.',
    itemType: 'support',
    keywords: [
      'groceries',
      'food',
      'meals',
      'shopping',
      'delivery',
      'help',
      'home',
    ],
  },
  {
    id: 'freezer-meal-containers',
    title: 'Freezer meal containers',
    category: 'Meals',
    description:
      'Useful for prepping meals before birth or receiving ready-to-freeze meals from others.',
    itemType: 'product',
    keywords: [
      'freezer meals',
      'meal prep',
      'food',
      'containers',
      'dinner',
      'cooking',
      'postpartum prep',
    ],
  },
  {
    id: 'house-cleaning-help',
    title: 'House cleaning help',
    category: 'Home Help',
    description:
      'A practical support request for dishes, laundry, floors, bathrooms, or a reset before baby.',
    itemType: 'support',
    keywords: [
      'cleaning',
      'house',
      'laundry',
      'dishes',
      'home help',
      'chores',
      'mess',
      'support',
    ],
  },
  {
    id: 'school-pickup-help',
    title: 'School pickup help',
    category: 'Home Help',
    description:
      'Help with older kids’ school runs, activities, or errands during late pregnancy or postpartum.',
    itemType: 'support',
    keywords: [
      'older kids',
      'school',
      'pickup',
      'siblings',
      'errands',
      'childcare',
      'help',
    ],
  },
  {
    id: 'postpartum-doula-hours',
    title: 'Postpartum doula hours',
    category: 'Services',
    description:
      'Support with newborn care, recovery, rest, meals, emotional support, and household flow.',
    itemType: 'service',
    keywords: [
      'doula',
      'postpartum doula',
      'night help',
      'newborn',
      'support',
      'recovery',
      'rest',
    ],
  },
  {
    id: 'pelvic-floor-therapy',
    title: 'Pelvic floor therapy',
    category: 'Services',
    description:
      'Support for healing, leaking, core recovery, pelvic pain, and feeling more at home in your body.',
    itemType: 'service',
    keywords: [
      'pelvic floor',
      'recovery',
      'leaking',
      'pain',
      'core',
      'therapy',
      'healing',
      'body',
    ],
  },
  {
    id: 'visitor-boundary-help',
    title: 'Visitor boundary help',
    category: 'Visitors & Boundaries',
    description:
      'Support with communicating visitor limits, rest time, and what kind of help is actually welcome.',
    itemType: 'support',
    keywords: [
      'visitors',
      'boundaries',
      'family',
      'in laws',
      'guests',
      'rules',
      'rest',
      'message',
    ],
  },
  {
    id: 'nursing-friendly-pajamas',
    title: 'Nursing-friendly pajamas',
    category: 'Rest',
    description:
      'Soft, easy-access pajamas for feeding, recovery, hospital photos, and couch nesting.',
    itemType: 'product',
    keywords: [
      'pajamas',
      'nursing',
      'breastfeeding',
      'hospital bag',
      'rest',
      'sleep',
      'comfort',
    ],
  },
]