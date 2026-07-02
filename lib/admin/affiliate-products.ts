'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import type {
  AffiliateProduct,
  AffiliateProductCategory,
  AffiliateProductRetailer,
  AffiliateProductStatus,
} from '@/types/affiliate-products'

type AffiliateProductRow = {
  id: string
  created_at: string
  updated_at: string

  slug: string
  title: string
  description: string

  retailer: string
  category: string
  tags: string[] | null

  affiliate_url: string
  image_url: string | null
  price_label: string | null

  status: string
  is_featured: boolean

  source: string | null
  notes: string | null
}

const validRetailers = new Set<AffiliateProductRetailer>([
  'amazon',
  'target',
  'walmart',
  'babylist',
  'kohls',
  'etsy',
  'other',
])

const validCategories = new Set<AffiliateProductCategory>([
  'postpartum-recovery',
  'feeding',
  'nursing',
  'pumping',
  'sleep',
  'baby-gear',
  'nursery',
  'diapering',
  'bath',
  'clothing',
  'pregnancy',
  'hospital-bag',
  'c-section-recovery',
  'mom-care',
  'home-help',
  'books',
  'courses',
  'other',
])

const validStatuses = new Set<AffiliateProductStatus>([
  'draft',
  'active',
  'archived',
])

function getText(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === 'string' ? value.trim() : ''
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === 'on' || formData.get(key) === 'true'
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeRetailer(value: string): AffiliateProductRetailer {
  if (validRetailers.has(value as AffiliateProductRetailer)) {
    return value as AffiliateProductRetailer
  }

  return 'other'
}

function normalizeCategory(value: string): AffiliateProductCategory {
  if (validCategories.has(value as AffiliateProductCategory)) {
    return value as AffiliateProductCategory
  }

  return 'other'
}

function normalizeStatus(value: string): AffiliateProductStatus {
  if (validStatuses.has(value as AffiliateProductStatus)) {
    return value as AffiliateProductStatus
  }

  return 'draft'
}

function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function toAffiliateProduct(row: AffiliateProductRow): AffiliateProduct {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,

    slug: row.slug,
    title: row.title,
    description: row.description,

    retailer: normalizeRetailer(row.retailer),
    category: normalizeCategory(row.category),
    tags: row.tags ?? [],

    affiliateUrl: row.affiliate_url,
    imageUrl: row.image_url ?? undefined,
    priceLabel: row.price_label ?? undefined,

    status: normalizeStatus(row.status),
    isFeatured: row.is_featured,

    source: row.source ?? undefined,
    notes: row.notes ?? undefined,
  }
}

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/admin')
  }

  const { data: isAdmin, error } = await supabase.rpc('is_willa_admin')

  if (error || !isAdmin) {
    redirect('/admin')
  }

  return supabase
}

const affiliateProductSelect = `
  id,
  created_at,
  updated_at,
  slug,
  title,
  description,
  retailer,
  category,
  tags,
  affiliate_url,
  image_url,
  price_label,
  status,
  is_featured,
  source,
  notes
`

export async function getAdminAffiliateProducts() {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('affiliate_products')
    .select(affiliateProductSelect)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as AffiliateProductRow[]).map(toAffiliateProduct)
}

export async function getAdminAffiliateProductById(id: string) {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('affiliate_products')
    .select(affiliateProductSelect)
    .eq('id', id)
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Affiliate product not found.')
  }

  return toAffiliateProduct(data as AffiliateProductRow)
}

function getAffiliateProductPayload(formData: FormData) {
  const title = getText(formData, 'title')
  const rawSlug = getText(formData, 'slug')
  const slug = normalizeSlug(rawSlug || title)
  const description = getText(formData, 'description')
  const affiliateUrl = getText(formData, 'affiliate_url')

  if (!title) {
    throw new Error('Title is required.')
  }

  if (!slug) {
    throw new Error('Slug is required.')
  }

  if (!description) {
    throw new Error('Description is required.')
  }

  if (!affiliateUrl) {
    throw new Error('Affiliate URL is required.')
  }

  return {
    slug,
    title,
    description,

    retailer: normalizeRetailer(getText(formData, 'retailer')),
    category: normalizeCategory(getText(formData, 'category')),
    tags: parseTags(getText(formData, 'tags')),

    affiliate_url: affiliateUrl,
    image_url: getText(formData, 'image_url') || null,
    price_label: getText(formData, 'price_label') || null,

    status: normalizeStatus(getText(formData, 'status')),
    is_featured: getBoolean(formData, 'is_featured'),

    source: getText(formData, 'source') || null,
    notes: getText(formData, 'notes') || null,
  }
}

export async function createAffiliateProductAction(formData: FormData) {
  const supabase = await requireAdmin()
  const payload = getAffiliateProductPayload(formData)

  const { error } = await supabase.from('affiliate_products').insert(payload)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/affiliate-products')
  revalidatePath('/guides')

  redirect('/admin/affiliate-products')
}

export async function updateAffiliateProductAction(formData: FormData) {
  const supabase = await requireAdmin()

  const id = getText(formData, 'id')
  const payload = getAffiliateProductPayload(formData)

  if (!id) {
    throw new Error('Missing affiliate product id.')
  }

  const { error } = await supabase
    .from('affiliate_products')
    .update(payload)
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/affiliate-products')
  revalidatePath(`/admin/affiliate-products/${id}/edit`)
  revalidatePath('/guides')

  redirect('/admin/affiliate-products')
}

export async function updateAffiliateProductStatusAction(formData: FormData) {
  const supabase = await requireAdmin()

  const id = getText(formData, 'id')
  const status = normalizeStatus(getText(formData, 'status'))

  if (!id) {
    throw new Error('Missing affiliate product id.')
  }

  const { error } = await supabase
    .from('affiliate_products')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/affiliate-products')
  revalidatePath('/guides')
}

export async function updateAffiliateProductFeaturedAction(
  formData: FormData
) {
  const supabase = await requireAdmin()

  const id = getText(formData, 'id')
  const isFeatured = getBoolean(formData, 'is_featured')

  if (!id) {
    throw new Error('Missing affiliate product id.')
  }

  const { error } = await supabase
    .from('affiliate_products')
    .update({ is_featured: isFeatured })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/affiliate-products')
  revalidatePath('/guides')
}