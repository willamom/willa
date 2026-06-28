import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { providerCategories } from '@/data/providers/categories'
import { createClient } from '@/lib/supabase/server'
import type { ProviderCategory, WillaProvider } from '@/types/providers'

export type ProviderStatus = 'draft' | 'published' | 'archived'

export type AdminProvider = WillaProvider & {
  status: ProviderStatus
  createdAt: string
  updatedAt: string
  source?: string
  notes?: string
}

type ProviderRow = {
  id: string
  created_at: string
  updated_at: string

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

  status: string
  is_featured: boolean
  is_verified: boolean

  source: string | null
  notes: string | null
}

const validCategories = new Set<ProviderCategory>(
  providerCategories.map((category) => category.slug)
)

const validStatuses = new Set<ProviderStatus>([
  'draft',
  'published',
  'archived',
])

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data, error } = await supabase.rpc('is_willa_admin')

  if (error || data !== true) {
    redirect('/')
  }

  return supabase
}

function normalizeCategory(value: string): ProviderCategory {
  if (validCategories.has(value as ProviderCategory)) {
    return value as ProviderCategory
  }

  return 'other'
}

function normalizeStatus(value: string): ProviderStatus {
  if (validStatuses.has(value as ProviderStatus)) {
    return value as ProviderStatus
  }

  return 'draft'
}

function toAdminProvider(row: ProviderRow): AdminProvider {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: normalizeCategory(row.category),
    description: row.description,
    specialties: row.specialties ?? [],

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

    status: normalizeStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    source: row.source ?? undefined,
    notes: row.notes ?? undefined,
  }
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function getOptionalText(formData: FormData, key: string) {
  const value = getText(formData, key)

  return value.length > 0 ? value : null
}

function getNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key))

  if (!Number.isFinite(value)) {
    throw new Error(`Invalid number for ${key}`)
  }

  return value
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === 'on'
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getSpecialties(formData: FormData) {
  return getText(formData, 'specialties')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getProviderPayload(formData: FormData) {
  const name = getText(formData, 'name')
  const enteredSlug = getText(formData, 'slug')
  const slug = enteredSlug || slugify(name)

  return {
    slug,
    name,
    category: normalizeCategory(getText(formData, 'category')),
    description: getText(formData, 'description'),
    specialties: getSpecialties(formData),

    city: getText(formData, 'city'),
    state: getOptionalText(formData, 'state'),
    country: getText(formData, 'country') || 'USA',
    address: getOptionalText(formData, 'address'),

    lat: getNumber(formData, 'lat'),
    lng: getNumber(formData, 'lng'),

    website: getOptionalText(formData, 'website'),
    instagram: getOptionalText(formData, 'instagram'),
    email: getOptionalText(formData, 'email'),
    phone: getOptionalText(formData, 'phone'),

    image_url: getOptionalText(formData, 'image_url'),

    status: normalizeStatus(getText(formData, 'status')),
    is_featured: getBoolean(formData, 'is_featured'),
    is_verified: getBoolean(formData, 'is_verified'),

    source: getOptionalText(formData, 'source'),
    notes: getOptionalText(formData, 'notes'),
  }
}

export async function getAdminProviders() {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('providers')
    .select(
      `
      id,
      created_at,
      updated_at,
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
      status,
      is_featured,
      is_verified,
      source,
      notes
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading admin providers:', error)
    return []
  }

  return ((data ?? []) as ProviderRow[]).map(toAdminProvider)
}

export async function getAdminProviderById(id: string) {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('providers')
    .select(
      `
      id,
      created_at,
      updated_at,
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
      status,
      is_featured,
      is_verified,
      source,
      notes
    `
    )
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return toAdminProvider(data as ProviderRow)
}

export async function createProviderAction(formData: FormData) {
  'use server'

  const supabase = await requireAdmin()
  const payload = getProviderPayload(formData)

  const { error } = await supabase.from('providers').insert(payload)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/providers')
  revalidatePath('/providers')
  redirect('/admin/providers')
}

export async function updateProviderAction(
  id: string,
  formData: FormData
) {
  'use server'

  const supabase = await requireAdmin()
  const payload = getProviderPayload(formData)

  const { error } = await supabase
    .from('providers')
    .update(payload)
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/providers')
  revalidatePath('/providers')
  redirect('/admin/providers')
}

export async function updateProviderStatusAction(formData: FormData) {
  'use server'

  const supabase = await requireAdmin()

  const id = getText(formData, 'id')
  const status = normalizeStatus(getText(formData, 'status'))

  const { error } = await supabase
    .from('providers')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/providers')
  revalidatePath('/providers')
}