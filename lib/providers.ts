import { createClient } from '@/lib/supabase/server'
import type { ProviderCategory, WillaProvider } from '@/types/providers'

type ProviderRow = {
  id: string
  slug: string
  name: string
  category: string
  description: string
  specialties: string[] | null

  city: string
  state: string | null
  country: string
  address: string | null

  lat: number
  lng: number

  website: string | null
  instagram: string | null
  email: string | null
  phone: string | null

  image_url: string | null

  is_featured: boolean
  is_verified: boolean
}

const validProviderCategories = new Set<ProviderCategory>([
  'doula',
  'midwife',
  'obgyn',
  'lactation',
  'postpartum-care',
  'mental-health',
  'pelvic-floor-pt',
  'sleep-consultant',
  'childbirth-educator',
  'nutrition',
  'photography',
  'meal-service',
  'cleaning',
  'childcare',
  'baby-brand',
  'other',
])

function normalizeProviderCategory(category: string): ProviderCategory {
  if (validProviderCategories.has(category as ProviderCategory)) {
    return category as ProviderCategory
  }

  return 'other'
}

function toWillaProvider(row: ProviderRow): WillaProvider {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: normalizeProviderCategory(row.category),
    specialties: row.specialties ?? [],
    description: row.description,

    location: {
      city: row.city,
      state: row.state ?? undefined,
      country: row.country,
      address: row.address ?? undefined,
      lat: row.lat,
      lng: row.lng,
    },

    website: row.website ?? undefined,
    instagram: row.instagram ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,

    image: row.image_url ?? undefined,

    isFeatured: row.is_featured,
    isVerified: row.is_verified,
  }
}

export async function getPublishedProviders(): Promise<WillaProvider[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('providers')
    .select(
      `
      id,
      slug,
      name,
      category,
      description,
      specialties,
      city,
      state,
      country,
      address,
      lat,
      lng,
      website,
      instagram,
      email,
      phone,
      image_url,
      is_featured,
      is_verified
    `
    )
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('is_verified', { ascending: false })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error loading providers:', error)
    return []
  }

  return ((data ?? []) as ProviderRow[]).map(toWillaProvider)
}

export async function getProviderBySlug(
  slug: string
): Promise<WillaProvider | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('providers')
    .select(
      `
      id,
      slug,
      name,
      category,
      description,
      specialties,
      city,
      state,
      country,
      address,
      lat,
      lng,
      website,
      instagram,
      email,
      phone,
      image_url,
      is_featured,
      is_verified
    `
    )
    .eq('status', 'published')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error loading provider:', error)
    return null
  }

  return toWillaProvider(data as ProviderRow)
}