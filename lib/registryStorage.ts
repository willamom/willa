import { createClient } from '@/lib/supabase/client'
import type { RegistryItemType } from '@/data/registryCatalog'

export type SavedRegistryItem = {
  id: string
  title: string
  description: string
  category: string
  savedAt: string
  itemType?: RegistryItemType | 'custom'
  source?: 'willa_catalog' | 'custom' | 'external_url'
  catalogItemId?: string
  productUrl?: string
  affiliateUrl?: string
}

export const SAVED_REGISTRY_ITEMS_KEY = 'willa_saved_registry_items'
export const SAVED_REGISTRY_UPDATED_EVENT = 'willa-saved-registry-updated'

const MIGRATED_REGISTRY_ITEMS_KEY_PREFIX = 'willa_registry_items_migrated_'

type RegistryItemRow = {
  item_id: string
  title: string
  description: string
  category: string
  item_type: RegistryItemType | 'custom' | null
  source: 'willa_catalog' | 'custom' | 'external_url' | null
  catalog_item_id: string | null
  product_url: string | null
  affiliate_url: string | null
  saved_at: string
}

export function slugifyRegistryItem(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function buildRegistryItemId(title: string) {
  return `registry-${slugifyRegistryItem(title)}`
}

export function getSavedRegistryItems(): SavedRegistryItem[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(SAVED_REGISTRY_ITEMS_KEY)

  if (!stored) return []

  try {
    return JSON.parse(stored) as SavedRegistryItem[]
  } catch {
    return []
  }
}

export function saveRegistryItem(
  item: Omit<SavedRegistryItem, 'savedAt'>
): SavedRegistryItem[] {
  if (typeof window === 'undefined') return []

  const currentItems = getSavedRegistryItems()
  const alreadySaved = currentItems.some(
    (savedItem) => savedItem.id === item.id
  )

  if (alreadySaved) return currentItems

  const nextItems: SavedRegistryItem[] = [
    {
      ...item,
      savedAt: new Date().toISOString(),
    },
    ...currentItems,
  ]

  setLocalSavedRegistryItems(nextItems)
  dispatchSavedRegistryUpdated()

  return nextItems
}

export function removeRegistryItem(itemId: string): SavedRegistryItem[] {
  if (typeof window === 'undefined') return []

  const nextItems = getSavedRegistryItems().filter(
    (item) => item.id !== itemId
  )

  setLocalSavedRegistryItems(nextItems)
  dispatchSavedRegistryUpdated()

  return nextItems
}

export async function getSavedRegistryItemsForCurrentUser(): Promise<
  SavedRegistryItem[]
> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return getSavedRegistryItems()
  }

  await migrateLocalRegistryItemsToSupabase(user.id)

  const { data, error } = await supabase
    .from('registry_items')
    .select(
      'item_id, title, description, category, item_type, source, catalog_item_id, product_url, affiliate_url, saved_at'
    )
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  if (error) {
    console.error(error)
    return getSavedRegistryItems()
  }

  const items = (data || []).map(mapRegistryItemRow)

  setLocalSavedRegistryItems(items)

  return items
}

export async function saveRegistryItemForCurrentUser(
  item: Omit<SavedRegistryItem, 'savedAt'>
): Promise<SavedRegistryItem[]> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return saveRegistryItem(item)
  }

  const { error } = await supabase.from('registry_items').upsert(
    buildRegistryItemPayload(user.id, item, new Date().toISOString()),
    {
      onConflict: 'user_id,item_id',
    }
  )

  if (error) {
    console.error(error)
    return saveRegistryItem(item)
  }

  const nextItems = await getSavedRegistryItemsForCurrentUser()

  dispatchSavedRegistryUpdated()

  return nextItems
}

export async function removeRegistryItemForCurrentUser(
  itemId: string
): Promise<SavedRegistryItem[]> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return removeRegistryItem(itemId)
  }

  const { error } = await supabase
    .from('registry_items')
    .delete()
    .eq('user_id', user.id)
    .eq('item_id', itemId)

  if (error) {
    console.error(error)
    return removeRegistryItem(itemId)
  }

  const nextItems = await getSavedRegistryItemsForCurrentUser()

  dispatchSavedRegistryUpdated()

  return nextItems
}

export function dispatchSavedRegistryUpdated() {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(SAVED_REGISTRY_UPDATED_EVENT))
}

function setLocalSavedRegistryItems(items: SavedRegistryItem[]) {
  if (typeof window === 'undefined') return

  localStorage.setItem(SAVED_REGISTRY_ITEMS_KEY, JSON.stringify(items))
}

async function migrateLocalRegistryItemsToSupabase(userId: string) {
  if (typeof window === 'undefined') return

  const migrationKey = `${MIGRATED_REGISTRY_ITEMS_KEY_PREFIX}${userId}`

  if (localStorage.getItem(migrationKey) === 'true') return

  const localItems = getSavedRegistryItems()

  if (localItems.length === 0) {
    localStorage.setItem(migrationKey, 'true')
    return
  }

  const supabase = createClient()

  const { error } = await supabase.from('registry_items').upsert(
    localItems.map((item) =>
      buildRegistryItemPayload(userId, item, item.savedAt)
    ),
    {
      onConflict: 'user_id,item_id',
    }
  )

  if (error) {
    console.error(error)
    return
  }

  localStorage.setItem(migrationKey, 'true')
}

function buildRegistryItemPayload(
  userId: string,
  item: Omit<SavedRegistryItem, 'savedAt'>,
  savedAt: string
) {
  return {
    user_id: userId,
    item_id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    item_type: item.itemType || 'custom',
    source: item.source || 'custom',
    catalog_item_id: item.catalogItemId || null,
    product_url: item.productUrl || null,
    affiliate_url: item.affiliateUrl || null,
    saved_at: savedAt,
  }
}

function mapRegistryItemRow(row: RegistryItemRow): SavedRegistryItem {
  return {
    id: row.item_id,
    title: row.title,
    description: row.description,
    category: row.category,
    itemType: row.item_type || 'custom',
    source: row.source || 'custom',
    catalogItemId: row.catalog_item_id || undefined,
    productUrl: row.product_url || undefined,
    affiliateUrl: row.affiliate_url || undefined,
    savedAt: row.saved_at,
  }
}