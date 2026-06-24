import type { WillaProfile } from '@/types/profile'

export const willaProfile: WillaProfile = {
  name: 'Silvia',
  dueDate: '2026-08-25',
  location: 'Pärnu, Estonia',
  note: 'Fourth baby · Planning for postpartum',
  focusItems: [
    'Start your postpartum recovery plan',
    'Think about feeding support',
    'Prepare visitor boundaries',
    'Add mom-focused support to your Willa',
  ],
  beforeBabyTasks: [
    { label: 'Prepare freezer meals', checked: true },
    { label: 'Pack hospital bag' },
    { label: 'Set up feeding station' },
    { label: 'Choose two people for practical help' },
  ],
  afterBabyTasks: [
    { label: 'Arrange meal help' },
    { label: 'Save lactation support contact' },
    { label: 'Plan visitor boundaries' },
    { label: 'Book postpartum check-in' },
  ],
  suggestedGuides: [
    {
      title: 'What do I actually need after birth?',
      description:
        'A practical guide to the first days home, recovery basics, and what support may actually help.',
      category: 'Postpartum',
      readTime: '7 min',
      href: '/guides/postpartum-first-week',
    },
    {
      title: 'How to ask for help after birth',
      description:
        'Simple ways to ask for meals, rest, house help, boundaries, and support without feeling awkward.',
      category: 'Support',
      readTime: '5 min',
      href: '/guides/visitor-boundaries',
    },
    {
      title: 'What to put on a registry for mom',
      description:
        'Mom-focused registry ideas for recovery, feeding, meals, services, and practical support.',
      category: 'Care Plan',
      readTime: '6 min',
      href: '/guides/mom-registry',
    },
  ],
  savedQuestions: [
    {
      question: 'What should I prepare before coming home from the hospital?',
      tag: 'Postpartum',
      href: '/guides/postpartum-first-week',
    },
    {
      question: 'Is it okay to add recovery items to a baby registry?',
      tag: 'Registry',
      href: '/guides/mom-registry',
    },
    {
      question: 'How do I set visitor boundaries after birth?',
      tag: 'Support',
      href: '/guides/visitor-boundaries',
    },
  ],
  registryIdeas: [
    {
      title: 'Postpartum recovery basket',
      description: 'Comfort items, pads, peri bottle, snacks, and cozy basics.',
      category: 'Recovery',
    },
    {
      title: 'Meal support',
      description: 'Gift cards, freezer meals, grocery help, or a meal train.',
      category: 'Home Help',
    },
    {
      title: 'Feeding support',
      description:
        'Lactation help, nursing station basics, bottles, or pumping support.',
      category: 'Feeding',
    },
  ],
  nearMeProviders: [
    {
      type: 'Lactation consultant',
      description: 'Feeding support for the first days and weeks.',
      distance: 'Near you',
      href: '#',
    },
    {
      type: 'Postpartum doula',
      description:
        'Practical help, recovery support, and newborn care guidance.',
      distance: 'Local',
      href: '#',
    },
    {
      type: 'Pelvic floor therapist',
      description: 'Recovery support before and after birth.',
      distance: 'Nearby',
      href: '#',
    },
  ],
}