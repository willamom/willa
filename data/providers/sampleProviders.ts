import type { WillaProvider } from '@/types/providers'

export const sampleProviders: WillaProvider[] = [
  {
    id: '1',
    slug: 'gentle-birth-doula',
    name: 'Gentle Birth Doula',
    category: 'doula',
    specialties: ['Birth support', 'Postpartum planning', 'VBAC support'],
    description:
      'Warm, practical doula support for pregnancy, birth, and the first weeks at home.',
    location: {
      city: 'San Diego',
      state: 'CA',
      country: 'USA',
      lat: 32.7157,
      lng: -117.1611,
    },
    website: 'https://example.com',
    instagram: 'https://instagram.com/example',
    isFeatured: true,
    isVerified: true,
  },
  {
    id: '2',
    slug: 'coastal-lactation-support',
    name: 'Coastal Lactation Support',
    category: 'lactation',
    specialties: ['Latch support', 'Pumping', 'Bottle feeding'],
    description:
      'IBCLC support for feeding questions, pumping plans, and newborn weight concerns.',
    location: {
      city: 'La Jolla',
      state: 'CA',
      country: 'USA',
      lat: 32.8328,
      lng: -117.2713,
    },
    isVerified: true,
  },
  {
    id: '3',
    slug: 'rooted-pelvic-floor-therapy',
    name: 'Rooted Pelvic Floor Therapy',
    category: 'pelvic-floor-pt',
    specialties: ['Postpartum recovery', 'Pelvic pain', 'Core strength'],
    description:
      'Pelvic floor physical therapy for pregnancy, postpartum recovery, and return to movement.',
    location: {
      city: 'North Park',
      state: 'CA',
      country: 'USA',
      lat: 32.7488,
      lng: -117.1305,
    },
  },
  {
    id: '4',
    slug: 'motherhood-mental-health-studio',
    name: 'Motherhood Mental Health Studio',
    category: 'mental-health',
    specialties: ['Postpartum anxiety', 'Birth trauma', 'Identity shifts'],
    description:
      'Therapy for the emotional side of pregnancy, postpartum, and becoming a mother.',
    location: {
      city: 'Encinitas',
      state: 'CA',
      country: 'USA',
      lat: 33.0369,
      lng: -117.2919,
    },
  },
]