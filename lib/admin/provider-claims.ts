'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export type ProviderClaimStatus =
  | 'new'
  | 'reviewing'
  | 'approved'
  | 'rejected'

export type AdminProviderClaim = {
  id: string
  createdAt: string

  providerId?: string
  providerSlug?: string
  providerName: string

  claimantName: string
  claimantEmail: string

  businessName?: string
  website?: string
  instagram?: string
  message?: string

  confirmOwner: boolean
  source: string
  status: ProviderClaimStatus
}

type ProviderClaimRow = {
  id: string
  created_at: string

  provider_id: string | null
  provider_slug: string | null
  provider_name: string

  claimant_name: string
  claimant_email: string

  business_name: string | null
  website: string | null
  instagram: string | null
  message: string | null

  confirm_owner: boolean
  source: string
  status: string
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function normalizeClaimStatus(status: string): ProviderClaimStatus {
  if (
    status === 'new' ||
    status === 'reviewing' ||
    status === 'approved' ||
    status === 'rejected'
  ) {
    return status
  }

  return 'new'
}

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('You must be signed in to access admin.')
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc(
    'is_willa_admin'
  )

  if (adminError || !isAdmin) {
    throw new Error('You do not have admin access.')
  }

  return supabase
}

function toAdminProviderClaim(row: ProviderClaimRow): AdminProviderClaim {
  return {
    id: row.id,
    createdAt: row.created_at,

    providerId: row.provider_id ?? undefined,
    providerSlug: row.provider_slug ?? undefined,
    providerName: row.provider_name,

    claimantName: row.claimant_name,
    claimantEmail: row.claimant_email,

    businessName: row.business_name ?? undefined,
    website: row.website ?? undefined,
    instagram: row.instagram ?? undefined,
    message: row.message ?? undefined,

    confirmOwner: row.confirm_owner,
    source: row.source,
    status: normalizeClaimStatus(row.status),
  }
}

export async function getAdminProviderClaims(): Promise<AdminProviderClaim[]> {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('provider_claims')
    .select(`
      id,
      created_at,
      provider_id,
      provider_slug,
      provider_name,
      claimant_name,
      claimant_email,
      business_name,
      website,
      instagram,
      message,
      confirm_owner,
      source,
      status
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as ProviderClaimRow[]).map(toAdminProviderClaim)
}

export async function updateProviderClaimStatusAction(formData: FormData) {
  const supabase = await requireAdmin()

  const id = getText(formData, 'id')
  const status = normalizeClaimStatus(getText(formData, 'status'))

  if (!id) {
    throw new Error('Missing claim id.')
  }

  const { data: claim, error: claimError } = await supabase
    .from('provider_claims')
    .select(`
      id,
      provider_id,
      provider_slug,
      provider_name,
      claimant_name,
      claimant_email
    `)
    .eq('id', id)
    .single()

  if (claimError || !claim) {
    throw new Error(claimError?.message ?? 'Claim not found.')
  }

  const { error } = await supabase
    .from('provider_claims')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  if (status === 'approved') {
    const providerUpdate = {
      is_claimed: true,
      is_verified: true,
      claimed_at: new Date().toISOString(),
      claimed_by_email: claim.claimant_email,
      claimed_by_name: claim.claimant_name,
    }

    if (claim.provider_id) {
      const { error: providerError } = await supabase
        .from('providers')
        .update(providerUpdate)
        .eq('id', claim.provider_id)

      if (providerError) {
        throw new Error(providerError.message)
      }
    } else if (claim.provider_slug) {
      const { error: providerError } = await supabase
        .from('providers')
        .update(providerUpdate)
        .eq('slug', claim.provider_slug)

      if (providerError) {
        throw new Error(providerError.message)
      }
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/provider-claims')
  revalidatePath('/admin/providers')
  revalidatePath('/providers')

  if (claim.provider_slug) {
    revalidatePath(`/providers/${claim.provider_slug}`)
  }
}