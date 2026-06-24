import { createClient } from '@/lib/supabase/client'
import type { SavedGuideItem } from '@/types/saved-guide'

export const SAVED_GUIDES_KEY = 'willa_saved_guides'
export const SAVED_GUIDES_UPDATED_EVENT = 'willa-saved-guides-updated'

const MIGRATED_SAVED_GUIDES_KEY_PREFIX = 'willa_saved_guides_migrated_'

type SavedGuideRow = {
  slug: string
  title: string
  description: string
  category: string
  read_time: string
  saved_at: string
}

export function getSavedGuides(): SavedGuideItem[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(SAVED_GUIDES_KEY)

  if (!stored) return []

  try {
    return JSON.parse(stored) as SavedGuideItem[]
  } catch {
    return []
  }
}

export function saveGuide(
  guide: Omit<SavedGuideItem, 'savedAt'>
): SavedGuideItem[] {
  if (typeof window === 'undefined') return []

  const currentGuides = getSavedGuides()
  const alreadySaved = currentGuides.some((item) => item.slug === guide.slug)

  if (alreadySaved) return currentGuides

  const nextGuides: SavedGuideItem[] = [
    {
      ...guide,
      savedAt: new Date().toISOString(),
    },
    ...currentGuides,
  ]

  setLocalSavedGuides(nextGuides)
  dispatchSavedGuidesUpdated()

  return nextGuides
}

export function removeSavedGuide(slug: string): SavedGuideItem[] {
  if (typeof window === 'undefined') return []

  const nextGuides = getSavedGuides().filter((guide) => guide.slug !== slug)

  setLocalSavedGuides(nextGuides)
  dispatchSavedGuidesUpdated()

  return nextGuides
}

export function isGuideSaved(slug: string) {
  return getSavedGuides().some((guide) => guide.slug === slug)
}

export async function getSavedGuidesForCurrentUser(): Promise<
  SavedGuideItem[]
> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return getSavedGuides()
  }

  await migrateLocalSavedGuidesToSupabase(user.id)

  const { data, error } = await supabase
    .from('saved_guides')
    .select('slug, title, description, category, read_time, saved_at')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  if (error) {
    console.error(error)
    return getSavedGuides()
  }

  const guides = (data || []).map(mapSavedGuideRow)

  setLocalSavedGuides(guides)

  return guides
}

export async function saveGuideForCurrentUser(
  guide: Omit<SavedGuideItem, 'savedAt'>
): Promise<SavedGuideItem[]> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return saveGuide(guide)
  }

  const { error } = await supabase.from('saved_guides').upsert(
    {
      user_id: user.id,
      slug: guide.slug,
      title: guide.title,
      description: guide.description,
      category: guide.category,
      read_time: guide.readTime,
      saved_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,slug',
    }
  )

  if (error) {
    console.error(error)
    return saveGuide(guide)
  }

  const nextGuides = await getSavedGuidesForCurrentUser()

  dispatchSavedGuidesUpdated()

  return nextGuides
}

export async function removeSavedGuideForCurrentUser(
  slug: string
): Promise<SavedGuideItem[]> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return removeSavedGuide(slug)
  }

  const { error } = await supabase
    .from('saved_guides')
    .delete()
    .eq('user_id', user.id)
    .eq('slug', slug)

  if (error) {
    console.error(error)
    return removeSavedGuide(slug)
  }

  const nextGuides = await getSavedGuidesForCurrentUser()

  dispatchSavedGuidesUpdated()

  return nextGuides
}

export async function isGuideSavedForCurrentUser(slug: string) {
  const guides = await getSavedGuidesForCurrentUser()

  return guides.some((guide) => guide.slug === slug)
}

export function dispatchSavedGuidesUpdated() {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(SAVED_GUIDES_UPDATED_EVENT))
}

function setLocalSavedGuides(guides: SavedGuideItem[]) {
  if (typeof window === 'undefined') return

  localStorage.setItem(SAVED_GUIDES_KEY, JSON.stringify(guides))
}

async function migrateLocalSavedGuidesToSupabase(userId: string) {
  if (typeof window === 'undefined') return

  const migrationKey = `${MIGRATED_SAVED_GUIDES_KEY_PREFIX}${userId}`

  if (localStorage.getItem(migrationKey) === 'true') return

  const localGuides = getSavedGuides()

  if (localGuides.length === 0) {
    localStorage.setItem(migrationKey, 'true')
    return
  }

  const supabase = createClient()

  const { error } = await supabase.from('saved_guides').upsert(
    localGuides.map((guide) => ({
      user_id: userId,
      slug: guide.slug,
      title: guide.title,
      description: guide.description,
      category: guide.category,
      read_time: guide.readTime,
      saved_at: guide.savedAt,
    })),
    {
      onConflict: 'user_id,slug',
    }
  )

  if (error) {
    console.error(error)
    return
  }

  localStorage.setItem(migrationKey, 'true')
}

function mapSavedGuideRow(row: SavedGuideRow): SavedGuideItem {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    readTime: row.read_time,
    savedAt: row.saved_at,
  }
}