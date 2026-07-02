'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export type ProviderInquiryStatus =
  | 'new'
  | 'reviewing'
  | 'sent'
  | 'failed'
  | 'archived'

export type AdminProviderInquiry = {
  id: string
  createdAt: string
  updatedAt: string

  providerId?: string
  providerSlug: string
  providerName: string
  providerEmail?: string

  senderName: string
  senderEmail: string
  senderStage?: string
  message: string

  consentToShare: boolean
  source: string
  status: ProviderInquiryStatus
}

type ProviderInquiryRow = {
  id: string
  created_at: string
  updated_at: string

  provider_id: string | null
  provider_slug: string
  provider_name: string
  provider_email: string | null

  sender_name: string
  sender_email: string
  sender_stage: string | null
  message: string

  consent_to_share: boolean
  source: string
  status: string
}

const validStatuses = new Set<ProviderInquiryStatus>([
  'new',
  'reviewing',
  'sent',
  'failed',
  'archived',
])

function getText(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === 'string' ? value.trim() : ''
}

function normalizeStatus(value: string): ProviderInquiryStatus {
  if (validStatuses.has(value as ProviderInquiryStatus)) {
    return value as ProviderInquiryStatus
  }

  return 'new'
}

function toAdminProviderInquiry(
  row: ProviderInquiryRow
): AdminProviderInquiry {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,

    providerId: row.provider_id ?? undefined,
    providerSlug: row.provider_slug,
    providerName: row.provider_name,
    providerEmail: row.provider_email ?? undefined,

    senderName: row.sender_name,
    senderEmail: row.sender_email,
    senderStage: row.sender_stage ?? undefined,
    message: row.message,

    consentToShare: row.consent_to_share,
    source: row.source,
    status: normalizeStatus(row.status),
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

export async function getAdminProviderInquiries() {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('provider_inquiries')
    .select(
      `
      id,
      created_at,
      updated_at,
      provider_id,
      provider_slug,
      provider_name,
      provider_email,
      sender_name,
      sender_email,
      sender_stage,
      message,
      consent_to_share,
      source,
      status
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as ProviderInquiryRow[]).map(toAdminProviderInquiry)
}

export async function updateProviderInquiryStatusAction(formData: FormData) {
  const supabase = await requireAdmin()

  const id = getText(formData, 'id')
  const status = normalizeStatus(getText(formData, 'status'))

  if (!id) {
    throw new Error('Missing inquiry id.')
  }

  const { error } = await supabase
    .from('provider_inquiries')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/provider-inquiries')
}