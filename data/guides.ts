import type { Guide } from '@/types/guides'

export const guides: Guide[] = [
  {
    slug: 'postpartum-first-week',
    title: 'What do I actually need after birth?',
    description:
      'A calm guide to the first week postpartum: recovery, feeding, meals, visitors, and support.',
    category: 'Postpartum',
    stage: 'Third trimester',
    readTime: '7 min',
    featured: true,
    sections: [
      {
        heading: 'The first week is about recovery, not hosting',
        body:
          'The first days after birth are not the time to prove you can do everything. Your body is recovering, your baby is adjusting, and your household needs softness, food, and fewer expectations.',
      },
      {
        heading: 'Start with practical support',
        body:
          'Meals, laundry, groceries, school runs, pet care, and short visits with actual help are often more useful than another newborn outfit.',
      },
      {
        heading: 'Prepare a small recovery station',
        body:
          'Keep water, snacks, pads, feeding supplies, burp cloths, medication if advised by your provider, and a phone charger within reach.',
      },
    ],
  },
  {
    slug: 'mom-registry',
    title: 'What to put on a registry for mom',
    description:
      'Registry ideas that support the mother too: recovery, meals, feeding, rest, and help at home.',
    category: 'Registry',
    stage: 'Pregnancy',
    readTime: '6 min',
    featured: true,
    sections: [
      {
        heading: 'A registry can include care, not just gear',
        body:
          'The baby needs things, but the mother also needs recovery, nourishment, and support. A mom-focused registry can make those needs easier to name.',
      },
      {
        heading: 'Think in categories',
        body:
          'Recovery items, feeding support, meal help, cleaning help, postpartum clothing, mental health support, and local services can all belong in a thoughtful plan.',
      },
      {
        heading: 'Make help specific',
        body:
          'People often want to help but do not know how. Specific requests like dinner delivery, grocery drop-off, or a lactation consultant contribution are easier to act on.',
      },
    ],
  },
  {
    slug: 'visitor-boundaries',
    title: 'How to set visitor boundaries after birth',
    description:
      'Gentle scripts and practical rules for protecting your recovery and newborn bubble.',
    category: 'Support',
    stage: 'Postpartum',
    readTime: '5 min',
    featured: false,
    sections: [
      {
        heading: 'Boundaries are not rude',
        body:
          'A boundary is a way to protect recovery, feeding, bonding, sleep, and your nervous system. It is not a rejection of people who love you.',
      },
      {
        heading: 'Decide before the baby arrives',
        body:
          'Think about when visitors can come, how long they can stay, whether they can hold the baby, and what kind of help would actually be welcome.',
      },
      {
        heading: 'Use clear language',
        body:
          'Simple messages work best. Try: “We are keeping visits short while we recover, but we would love help with a meal drop-off.”',
      },
    ],
  },
  {
    slug: 'feeding-support',
    title: 'When to get feeding support',
    description:
      'How to know when feeding feels normal, when to ask for help, and what support can look like.',
    category: 'Feeding',
    stage: 'Pregnancy & postpartum',
    readTime: '6 min',
    featured: false,
    sections: [
      {
        heading: 'Feeding support is not only for emergencies',
        body:
          'You do not have to wait until you are overwhelmed to ask for help. Feeding support can be useful for preparation, latch questions, pumping, combo feeding, bottle feeding, or pain.',
      },
      {
        heading: 'Know who can help',
        body:
          'Depending on your needs, support may come from a midwife, pediatrician, lactation consultant, feeding therapist, or postpartum doula.',
      },
      {
        heading: 'Add it to your care plan',
        body:
          'Saving a local feeding support contact before birth can make the first week feel less frantic.',
      },
    ],
  },
]