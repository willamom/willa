import { createClient } from '@/lib/supabase/client'

export type SavedNearMeProvider = {
  id: string
  type: string
  description: string
  distance: string
  href: string
  savedAt: string
}

export const SAVED_NEAR_ME_PROVIDERS_KEY = 'willa_saved_near_me_providers'
export const SAVED_NEAR_ME_UPDATED_EVENT = 'willa-saved-near-me-updated'

const MIGRATED_NEAR_ME_KEY_PREFIX = 'willa_near_me_migrated_'

type NearMeProviderRow = {
  provider_id: string
  type: string
  description: string
  distance: string
  href: string
  saved_at: string
}

export function slugifyNearMeProvider(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function buildNearMeProviderId(type: string, description: string) {
  return `provider-${slugifyNearMeProvider(`${type}-${description}`)}`
}

export function getSavedNearMeProviders(): SavedNearMeProvider[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(SAVED_NEAR_ME_PROVIDERS_KEY)

  if (!stored) return []

  try {
    return JSON.parse(stored) as SavedNearMeProvider[]
  } catch {
    return []
  }
}

export function saveNearMeProvider(
  provider: Omit<SavedNearMeProvider, 'savedAt'>
): SavedNearMeProvider[] {
  if (typeof window === 'undefined') return []

  const currentProviders = getSavedNearMeProviders()
  const alreadySaved = currentProviders.some((item) => item.id === provider.id)

  if (alreadySaved) return currentProviders

  const nextProviders: SavedNearMeProvider[] = [
    {
      ...provider,
      savedAt: new Date().toISOString(),
    },
    ...currentProviders,
  ]

  setLocalSavedNearMeProviders(nextProviders)
  dispatchSavedNearMeUpdated()

  return nextProviders
}

export function removeNearMeProvider(providerId: string): SavedNearMeProvider[] {
  if (typeof window === 'undefined') return []

  const nextProviders = getSavedNearMeProviders().filter(
    (provider) => provider.id !== providerId
  )

  setLocalSavedNearMeProviders(nextProviders)
  dispatchSavedNearMeUpdated()

  return nextProviders
}

export async function getSavedNearMeProvidersForCurrentUser(): Promise<
  SavedNearMeProvider[]
> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return getSavedNearMeProviders()
  }

  await migrateLocalNearMeProvidersToSupabase(user.id)

  const { data, error } = await supabase
    .from('near_me_saves')
    .select('provider_id, type, description, distance, href, saved_at')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  if (error) {
    console.error(error)
    return getSavedNearMeProviders()
  }

  const providers = (data || []).map(mapNearMeProviderRow)

  setLocalSavedNearMeProviders(providers)

  return providers
}

export async function saveNearMeProviderForCurrentUser(
  provider: Omit<SavedNearMeProvider, 'savedAt'>
): Promise<SavedNearMeProvider[]> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return saveNearMeProvider(provider)
  }

  const { error } = await supabase.from('near_me_saves').upsert(
    {
      user_id: user.id,
      provider_id: provider.id,
      type: provider.type,
      description: provider.description,
      distance: provider.distance,
      href: provider.href,
      saved_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,provider_id',
    }
  )

  if (error) {
    console.error(error)
    return saveNearMeProvider(provider)
  }

  const nextProviders = await getSavedNearMeProvidersForCurrentUser()

  dispatchSavedNearMeUpdated()

  return nextProviders
}

export async function removeNearMeProviderForCurrentUser(
  providerId: string
): Promise<SavedNearMeProvider[]> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return removeNearMeProvider(providerId)
  }

  const { error } = await supabase
    .from('near_me_saves')
    .delete()
    .eq('user_id', user.id)
    .eq('provider_id', providerId)

  if (error) {
    console.error(error)
    return removeNearMeProvider(providerId)
  }

  const nextProviders = await getSavedNearMeProvidersForCurrentUser()

  dispatchSavedNearMeUpdated()

  return nextProviders
}

export function dispatchSavedNearMeUpdated() {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(SAVED_NEAR_ME_UPDATED_EVENT))
}

function setLocalSavedNearMeProviders(providers: SavedNearMeProvider[]) {
  if (typeof window === 'undefined') return

  localStorage.setItem(
    SAVED_NEAR_ME_PROVIDERS_KEY,
    JSON.stringify(providers)
  )
}

async function migrateLocalNearMeProvidersToSupabase(userId: string) {
  if (typeof window === 'undefined') return

  const migrationKey = `${MIGRATED_NEAR_ME_KEY_PREFIX}${userId}`

  if (localStorage.getItem(migrationKey) === 'true') return

  const localProviders = getSavedNearMeProviders()

  if (localProviders.length === 0) {
    localStorage.setItem(migrationKey, 'true')
    return
  }

  const supabase = createClient()

  const { error } = await supabase.from('near_me_saves').upsert(
    localProviders.map((provider) => ({
      user_id: userId,
      provider_id: provider.id,
      type: provider.type,
      description: provider.description,
      distance: provider.distance,
      href: provider.href,
      saved_at: provider.savedAt,
    })),
    {
      onConflict: 'user_id,provider_id',
    }
  )

  if (error) {
    console.error(error)
    return
  }

  localStorage.setItem(migrationKey, 'true')
}

function mapNearMeProviderRow(row: NearMeProviderRow): SavedNearMeProvider {
  return {
    id: row.provider_id,
    type: row.type,
    description: row.description,
    distance: row.distance,
    href: row.href,
    savedAt: row.saved_at,
  }
}