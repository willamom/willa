'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import {
  registryCatalogItems,
  type RegistryCatalogItem,
  type RegistryItemType,
} from '@/data/registryCatalog'
import {
  getSavedRegistryItemsForCurrentUser,
  removeRegistryItemForCurrentUser,
  saveRegistryItemForCurrentUser,
  SAVED_REGISTRY_UPDATED_EVENT,
  type SavedRegistryItem,
} from '@/lib/registryStorage'

const exampleSearches = [
  'bathroom recovery',
  'breastfeeding pain',
  'meals',
  'older kids',
  'visitor boundaries',
]

const itemTypeLabels: Record<RegistryItemType, string> = {
  product: 'Product',
  support: 'Support',
  service: 'Service',
}

export default function MomRegistryBuilder() {
  const [items, setItems] = useState<SavedRegistryItem[]>([])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [savingItemId, setSavingItemId] = useState('')

  useEffect(() => {
    let isMounted = true

    async function refreshItems() {
      const savedItems = await getSavedRegistryItemsForCurrentUser()

      if (!isMounted) return

      setItems(savedItems)
      setIsLoading(false)
    }

    refreshItems()

    window.addEventListener(SAVED_REGISTRY_UPDATED_EVENT, refreshItems)
    window.addEventListener('storage', refreshItems)

    return () => {
      isMounted = false
      window.removeEventListener(SAVED_REGISTRY_UPDATED_EVENT, refreshItems)
      window.removeEventListener('storage', refreshItems)
    }
  }, [])

  const savedItemIds = useMemo(
    () => new Set(items.map((item) => item.id)),
    [items]
  )

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(registryCatalogItems.map((item) => item.category))
    )

    return ['All', ...uniqueCategories]
  }, [])

  const matchedCatalogItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return registryCatalogItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory

      const searchableText = [
        item.title,
        item.category,
        item.description,
        item.itemType,
        ...item.keywords,
      ]
        .join(' ')
        .toLowerCase()

      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  async function handleSaveCatalogItem(item: RegistryCatalogItem) {
    const itemId = buildCatalogRegistryItemId(item.id)

    setSavingItemId(itemId)

    const nextItems = await saveRegistryItemForCurrentUser({
      id: itemId,
      title: item.title,
      description: item.description,
      category: item.category,
      itemType: item.itemType,
      source: 'willa_catalog',
      catalogItemId: item.id,
      productUrl: item.productUrl,
      affiliateUrl: item.affiliateUrl,
    })

    setItems(nextItems)
    setSavingItemId('')
  }

  async function handleRemoveItem(itemId: string) {
    setSavingItemId(itemId)

    const nextItems = await removeRegistryItemForCurrentUser(itemId)

    setItems(nextItems)
    setSavingItemId('')
  }

  return (
    <section className="pt-10 sm:pt-12">
      <div className="grid gap-8 border-b border-[#ded3c3] pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Registry ideas
          </p>

          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-[#211f1b] sm:text-5xl">
            Start with what mom may need.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5f574d] sm:text-base">
            Search by need, stage, worry, or the kind of help people never know
            how to offer.
          </p>
        </div>

        <div>
          <div className="rounded-full border border-[#d8cabb] bg-white/72 px-5 py-3 shadow-[0_10px_30px_rgba(61,50,38,0.035)]">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#a45f51]">⌕</span>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search recovery, feeding, meals, bathroom..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#211f1b] outline-none placeholder:text-[#8a8277] sm:text-base"
              />

              {query.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="text-xs font-semibold text-[#a45f51] transition hover:text-[#211f1b]"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <span className="text-[#8a8277]">Try:</span>

            {exampleSearches.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="font-semibold text-[#4f5d3d] underline decoration-[#c8bdae] underline-offset-4 transition hover:text-[#211f1b]"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
        {categories.map((category) => {
          const isActive = category === activeCategory

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`text-sm font-semibold transition ${
                isActive
                  ? 'text-[#211f1b] underline decoration-[#a45f51] decoration-2 underline-offset-8'
                  : 'text-[#6d6459] hover:text-[#211f1b]'
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>

      {matchedCatalogItems.length > 0 ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {matchedCatalogItems.map((item) => {
            const registryItemId = buildCatalogRegistryItemId(item.id)
            const isSaved = savedItemIds.has(registryItemId)

            return (
              <CatalogItemCard
                key={item.id}
                item={item}
                isSaved={isSaved}
                isSaving={savingItemId === registryItemId}
                onSave={() => handleSaveCatalogItem(item)}
                onRemove={() => handleRemoveItem(registryItemId)}
              />
            )
          })}
        </div>
      ) : (
        <div className="mt-12 border-t border-[#ded3c3] pt-8">
          <p className="font-serif text-3xl text-[#211f1b]">
            No matching ideas yet.
          </p>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#5f574d]">
            Try another search or clear the filters. Willa is still adding more
            registry ideas.
          </p>
        </div>
      )}

      <p className="mt-12 border-t border-[#ded3c3] pt-6 text-xs leading-6 text-[#6d6459]">
        {isLoading
          ? 'Loading saved ideas...'
          : items.length > 0
            ? `${items.length} idea${items.length === 1 ? '' : 's'} saved.`
            : 'Save features are in early preview. You can still browse ideas and use them as a starting point for your registry.'}
      </p>
    </section>
  )
}

function CatalogItemCard({
  item,
  isSaved,
  isSaving,
  onSave,
  onRemove,
}: {
  item: RegistryCatalogItem
  isSaved: boolean
  isSaving: boolean
  onSave: () => void | Promise<void>
  onRemove: () => void | Promise<void>
}) {
  const productHref = item.affiliateUrl || item.productUrl

  return (
    <article className="flex min-h-[18rem] flex-col rounded-[1.6rem] border border-[#e2d7c8] bg-white/78 p-5 shadow-[0_12px_35px_rgba(61,50,38,0.04)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_48px_rgba(61,50,38,0.065)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-[#f5ded5] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
          {item.category}
        </span>

        <span className="rounded-full bg-[#eef0e6] px-2.5 py-1 text-[0.68rem] font-semibold text-[#4f5d3d]">
          {itemTypeLabels[item.itemType]}
        </span>
      </div>

      <h3 className="mt-5 break-words font-serif text-2xl leading-tight text-[#211f1b] sm:text-[1.7rem]">
        {item.title}
      </h3>

      <p className="mt-4 flex-1 text-sm leading-6 text-[#5f574d]">
        {item.description}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={isSaved ? onRemove : onSave}
          disabled={isSaving}
          className={`rounded-full px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isSaved
              ? 'bg-[#f8f3eb] text-[#4f5d3d] hover:bg-[#f2ece2]'
              : 'bg-[#4f5d3d] text-white hover:bg-[#414d31]'
          }`}
        >
          {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save idea'}
        </button>

        {productHref ? (
          <Link
            href={productHref}
            className="text-xs font-semibold text-[#4f5d3d] underline decoration-[#c8bdae] underline-offset-4 transition hover:text-[#211f1b]"
          >
            View product
          </Link>
        ) : null}
      </div>
    </article>
  )
}

function buildCatalogRegistryItemId(catalogItemId: string) {
  return `catalog-${catalogItemId}`
}