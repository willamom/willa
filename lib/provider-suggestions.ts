'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

function getText(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === 'string' ? value.trim() : ''
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function createProviderSuggestionAction(formData: FormData) {
  const company = getText(formData, 'company')

  if (company) {
    redirect('/providers/suggest?success=1')
  }

  const providerName = getText(formData, 'provider_name')
  const providerCategory = getText(formData, 'provider_category')
  const providerCity = getText(formData, 'provider_city')
  const providerState = getText(formData, 'provider_state')
  const providerCountry = getText(formData, 'provider_country') || 'USA'

  const providerWebsite = getText(formData, 'provider_website')
  const providerInstagram = getText(formData, 'provider_instagram')
  const providerEmail = getText(formData, 'provider_email')
  const providerPhone = getText(formData, 'provider_phone')
  const providerServices = getText(formData, 'provider_services')

  const suggestedByName = getText(formData, 'suggested_by_name')
  const suggestedByEmail = getText(formData, 'suggested_by_email')
  const relationship = getText(formData, 'relationship')
  const notes = getText(formData, 'notes')

  if (!providerName) {
    redirect('/providers/suggest?error=missing')
  }

  if (
    !providerCity &&
    !providerState &&
    !providerWebsite &&
    !providerEmail &&
    !providerInstagram
  ) {
    redirect('/providers/suggest?error=contact')
  }

  if (providerEmail && !isValidEmail(providerEmail)) {
    redirect('/providers/suggest?error=provider_email')
  }

  if (suggestedByEmail && !isValidEmail(suggestedByEmail)) {
    redirect('/providers/suggest?error=suggested_email')
  }

  const supabase = await createClient()

  const { error } = await supabase.from('provider_suggestions').insert({
    provider_name: providerName,
    provider_category: providerCategory || null,
    provider_city: providerCity || null,
    provider_state: providerState || null,
    provider_country: providerCountry,

    provider_website: providerWebsite || null,
    provider_instagram: providerInstagram || null,
    provider_email: providerEmail || null,
    provider_phone: providerPhone || null,
    provider_services: providerServices || null,

    suggested_by_name: suggestedByName || null,
    suggested_by_email: suggestedByEmail || null,
    relationship: relationship || null,

    notes: notes || null,
    status: 'new',
    source: 'public_suggest_form',
  })

  if (error) {
    redirect('/providers/suggest?error=server')
  }

  redirect('/providers/suggest?success=1')
}