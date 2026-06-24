import { willaProfile } from '@/data/profile'
import type { WillaProfile } from '@/types/profile'

type ProfileSearchParams = Record<string, string | string[] | undefined>

type StoredProfilePreview = {
  name?: string
  dueDate?: string
  location?: string
  babyNumber?: string
  concerns?: string[]
}

function getStringParam(
  params: ProfileSearchParams | undefined,
  key: string
) {
  const value = params?.[key]

  if (Array.isArray(value)) return value[0]

  return value
}

function getConcernsFromParams(params: ProfileSearchParams | undefined) {
  const value = getStringParam(params, 'concerns')

  if (!value) return []

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getBabyNote(value: string | undefined) {
  if (value === 'first') return 'First baby · Building a care plan'
  if (value === 'not-first') return 'Not your first baby · Planning for postpartum'

  return willaProfile.note
}

function parseProfileCookie(cookieValue?: string): StoredProfilePreview {
  if (!cookieValue) return {}

  try {
    return JSON.parse(decodeURIComponent(cookieValue)) as StoredProfilePreview
  } catch {
    return {}
  }
}

export function getProfileFromSearchParams(
  params?: ProfileSearchParams,
  profileCookie?: string
): WillaProfile {
  const storedProfile = parseProfileCookie(profileCookie)

  const name = getStringParam(params, 'name') || storedProfile.name
  const dueDate = getStringParam(params, 'dueDate') || storedProfile.dueDate
  const location = getStringParam(params, 'location') || storedProfile.location

  const babyNumber =
    getStringParam(params, 'babyNumber') || storedProfile.babyNumber

  const paramConcerns = getConcernsFromParams(params)
  const storedConcerns = storedProfile.concerns || []
  const concerns = paramConcerns.length > 0 ? paramConcerns : storedConcerns

  return {
    ...willaProfile,
    name: name || willaProfile.name,
    dueDate: dueDate || willaProfile.dueDate,
    location: location || willaProfile.location,
    note: getBabyNote(babyNumber),
    focusItems:
      concerns.length > 0
        ? concerns.map((concern) => `Make a plan for ${concern.toLowerCase()}`)
        : willaProfile.focusItems,
  }
}