'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function getOptionalText(formData: FormData, key: string) {
  const value = getText(formData, key)

  return value.length > 0 ? value : null
}

function getRedirectUrl(providerSlug: string, error?: string) {
  const params = new URLSearchParams()

  if (providerSlug) {
    params.set('provider', providerSlug)
  }

  if (error) {
    params.set('error', error)
  }

  const query = params.toString()

  return `/providers/claim${query ? `?${query}` : ''}`
}

export async function createProviderClaimAction(formData: FormData) {
  const supabase = await createClient()

  const honeypot = getText(formData, 'company')
  const providerId = getOptionalText(formData, 'provider_id')
  const providerSlug = getText(formData, 'provider_slug')
  const providerName = getText(formData, 'provider_name')

  const claimantName = getText(formData, 'claimant_name')
  const claimantEmail = getText(formData, 'claimant_email')

  const businessName = getOptionalText(formData, 'business_name')
  const website = getOptionalText(formData, 'website')
  const instagram = getOptionalText(formData, 'instagram')
  const message = getOptionalText(formData, 'message')
  const confirmOwner = formData.get('confirm_owner') === 'on'

  if (honeypot) {
    redirect('/providers/claim/success')
  }

  if (!providerName || !claimantName || !claimantEmail) {
    redirect(getRedirectUrl(providerSlug, 'missing'))
  }

  if (!claimantEmail.includes('@')) {
    redirect(getRedirectUrl(providerSlug, 'email'))
  }

  if (!confirmOwner) {
    redirect(getRedirectUrl(providerSlug, 'confirm'))
  }

  const { error } = await supabase.from('provider_claims').insert({
    provider_id: providerId || null,
    provider_slug: providerSlug || null,
    provider_name: providerName,

    claimant_name: claimantName,
    claimant_email: claimantEmail,

    business_name: businessName,
    website,
    instagram,
    message,

    confirm_owner: confirmOwner,
    source: 'provider_claim_form',
    status: 'new',
  })

  if (error) {
    console.error('Error creating provider claim:', error)
    redirect(getRedirectUrl(providerSlug, 'server'))
  }

  const successParams = new URLSearchParams()

  if (providerSlug) {
    successParams.set('provider', providerSlug)
  }

  redirect(`/providers/claim/success?${successParams.toString()}`)
}