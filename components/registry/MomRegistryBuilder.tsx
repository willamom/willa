'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import {
  registryCatalogItems,
  type RegistryCatalogItem,
  type RegistryItemType,
} from '@/data/registryCatalog'
import {
  buildRegistryItemId,
  getSavedRegistryItemsForCurrentUser,
  removeRegistryItemForCurrentUser,
  saveRegistryItemForCurrentUser,
  SAVED_REGISTRY_UPDATED_EVENT,
  type SavedRegistryItem,
} from '@/lib/registryStorage'

const categoryOptions = [
  'Recovery',
  'Feeding',
  'Meals',
  'Home Help',
  'Rest',
  'Mental Health',
  'Visitors & Boundaries',
  'Services',
  'Custom',
]

const itemTypeLabels: Record<RegistryItemType | 'custom', string> = {
  product: 'Product',
  support: 'Support',
  service: 'Service',
  custom: 'Custom',
}

export default function MomRegistryBuilder() {
  const [items, setItems] = useState<SavedRegistryItem[]>([])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [customTitle, setCustomTitle] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [customCategory, setCustomCategory] = useState('Recovery')
  const [copyStatus, setCopyStatus] = useState('')
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

  const suggestedFromManualInput = useMemo(() => {
    const normalizedManualText = [customTitle, customDescription]
      .join(' ')
      .trim()
      .toLowerCase()

    if (normalizedManualText.length < 3) return []

    return registryCatalogItems
      .map((item) => {
        const haystack = [
          item.title,
          item.category,
          item.description,
          item.itemType,
          ...item.keywords,
        ]
          .join(' ')
          .toLowerCase()

        const score = item.keywords.reduce((total, keyword) => {
          return normalizedManualText.includes(keyword.toLowerCase())
            ? total + 2
            : total
        }, haystack.includes(normalizedManualText) ? 1 : 0)

        return {
          item,
          score,
        }
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((result) => result.item)
  }, [customDescription, customTitle])

  const groupedItems = useMemo(() => {
    return items.reduce<Record<string, SavedRegistryItem[]>>((groups, item) => {
      groups[item.category] = groups[item.category] || []
      groups[item.category].push(item)

      return groups
    }, {})
  }, [items])

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

  async function handleAddCustomItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = customTitle.trim()
    const trimmedDescription = customDescription.trim()

    if (!trimmedTitle) return

    const itemId = buildRegistryItemId(trimmedTitle)

    setSavingItemId(itemId)

    const nextItems = await saveRegistryItemForCurrentUser({
      id: itemId,
      title: trimmedTitle,
      description:
        trimmedDescription || 'A support item I may want to ask for.',
      category: customCategory,
      itemType: 'custom',
      source: 'custom',
    })

    setItems(nextItems)
    setCustomTitle('')
    setCustomDescription('')
    setCustomCategory('Recovery')
    setSavingItemId('')
  }

  async function handleCopyRegistryMessage() {
    const message = buildRegistryShareMessage(items)

    if (!message) return

    try {
      await navigator.clipboard.writeText(message)
      setCopyStatus('Copied')
    } catch {
      setCopyStatus('Copy failed')
    }

    window.setTimeout(() => setCopyStatus(''), 1800)
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_24px_80px_rgba(61,50,38,0.08)] sm:rounded-[2.5rem] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
              Smart registry
            </p>

            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
              Start with what mom may need
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#5f574d]">
              Browse Willa’s curated registry ideas for recovery, feeding,
              meals, home help, services, and support. Save what makes sense,
              skip what doesn’t.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-[#f8f3eb] p-4 sm:rounded-[2rem]">
            <p className="text-sm font-semibold text-[#211f1b]">
              Try typing:
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'bathroom recovery',
                'breastfeeding pain',
                'meals',
                'older kids',
                'visitor boundaries',
              ].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setQuery(example)}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#5f574d] transition hover:bg-[#eef0e6] hover:text-[#4f5d3d]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef]">
            <div className="flex items-center gap-3 px-5 py-4">
              <span className="text-sm text-[#a45f51]">⌕</span>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search needs... e.g. recovery, feeding, meals, bathroom"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#211f1b] outline-none placeholder:text-[#8a8277]"
              />

              {query.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b]"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>

          <p className="text-sm text-[#655d52]">
            {isLoading ? 'Loading...' : `${items.length} saved`}
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
            Filter
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => {
              const isActive = category === activeCategory

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    isActive
                      ? 'border-[#4f5d3d] bg-[#4f5d3d] text-white'
                      : 'border-[#e2d7c8] bg-[#fbf7ef] text-[#5f574d] hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] bg-white p-5 shadow-[0_24px_80px_rgba(61,50,38,0.08)] sm:rounded-[2.5rem] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Add your own
          </p>

          <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
            Tell Willa what feels hard
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#5f574d]">
            Add something specific, or let Willa suggest matching ideas from the
            registry catalog.
          </p>

          <form onSubmit={handleAddCustomItem} className="mt-7 space-y-5">
            <Field label="Item, support, or need">
              <input
                value={customTitle}
                onChange={(event) => setCustomTitle(event.target.value)}
                placeholder="e.g. bathroom recovery, meal help, school pickup"
                className="w-full rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef] px-4 py-3 text-sm text-[#211f1b] outline-none transition placeholder:text-[#8a8277] focus:border-[#a86f62] focus:bg-white"
              />
            </Field>

            <Field label="Why it helps">
              <textarea
                value={customDescription}
                onChange={(event) => setCustomDescription(event.target.value)}
                placeholder="e.g. I want help during the first week home."
                rows={4}
                className="w-full resize-none rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef] px-4 py-3 text-sm text-[#211f1b] outline-none transition placeholder:text-[#8a8277] focus:border-[#a86f62] focus:bg-white"
              />
            </Field>

            {suggestedFromManualInput.length > 0 ? (
              <div className="rounded-2xl bg-[#f8f3eb] p-4">
                <p className="text-sm font-semibold text-[#211f1b]">
                  Willa found a few matches:
                </p>

                <div className="mt-4 space-y-3">
                  {suggestedFromManualInput.map((item) => {
                    const registryItemId = buildCatalogRegistryItemId(item.id)
                    const isSaved = savedItemIds.has(registryItemId)
                    const isSaving = savingItemId === registryItemId

                    return (
                      <div key={item.id} className="rounded-2xl bg-white p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[#211f1b]">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#5f574d]">
                              {item.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              isSaved
                                ? handleRemoveItem(registryItemId)
                                : handleSaveCatalogItem(item)
                            }
                            disabled={isSaving}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              isSaved
                                ? 'bg-[#eef0e6] text-[#4f5d3d] hover:bg-[#e1e5d4]'
                                : 'bg-[#4f5d3d] text-white hover:bg-[#414d31]'
                            }`}
                          >
                            {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Add'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}

            <Field label="Category">
              <select
                value={customCategory}
                onChange={(event) => setCustomCategory(event.target.value)}
                className="w-full rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef] px-4 py-3 text-sm text-[#211f1b] outline-none transition focus:border-[#a86f62] focus:bg-white"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <button
              type="submit"
              disabled={Boolean(savingItemId)}
              className="rounded-xl bg-[#4f5d3d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#414d31] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingItemId ? 'Saving...' : 'Keep as custom item'}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] bg-[#f2ece2] p-5 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:rounded-[2.5rem] sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
                My registry
              </p>

              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                Things people can help with
              </h2>
            </div>

            <span className="w-fit rounded-full bg-[#fbf7ef]/85 px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
              {isLoading ? 'Loading...' : `${items.length} saved`}
            </span>
          </div>

          {isLoading ? (
            <div className="mt-7 rounded-3xl bg-[#fbf7ef]/85 p-6">
              <p className="text-sm leading-6 text-[#5f574d]">
                Loading your registry...
              </p>
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="mt-6 rounded-3xl bg-[#fbf7ef]/85 p-5">
                <p className="text-sm leading-6 text-[#5f574d]">
                  Copy a simple message you can paste into a text, post, email,
                  or group chat.
                </p>

                <button
                  type="button"
                  onClick={handleCopyRegistryMessage}
                  className="mt-4 rounded-xl bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
                >
                  {copyStatus || 'Copy registry message'}
                </button>
              </div>

              <div className="mt-7 space-y-6">
                {Object.entries(groupedItems).map(([group, groupItems]) => (
                  <div key={group}>
                    <p className="mb-3 text-sm font-semibold text-[#211f1b]">
                      {group}
                    </p>

                    <div className="space-y-3">
                      {groupItems.map((item) => (
                        <SavedRegistryCard
                          key={item.id}
                          item={item}
                          isSaving={savingItemId === item.id}
                          onRemove={() => handleRemoveItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-7 rounded-3xl bg-[#fbf7ef]/85 p-6">
              <p className="font-serif text-2xl leading-tight text-[#211f1b]">
                Your registry is still empty.
              </p>

              <p className="mt-3 text-sm leading-6 text-[#5f574d]">
                Start by saving the support you wish people knew you needed:
                recovery care, meals, home help, feeding support, or rest.
              </p>

              <Link
                href="/profile#registry-ideas"
                className="mt-5 inline-flex text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
              >
                Browse profile ideas →
              </Link>
            </div>
          )}
        </div>
      </div>
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
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_55px_rgba(61,50,38,0.07)] sm:rounded-[2rem] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <span className="rounded-full bg-[#f5ded5] px-3 py-1 text-xs font-semibold text-[#a45f51]">
          {item.category}
        </span>

        <span className="rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
          {itemTypeLabels[item.itemType]}
        </span>
      </div>

      <h3 className="mt-5 break-words font-serif text-2xl leading-tight text-[#211f1b] sm:text-3xl">
        {item.title}
      </h3>

      <p className="mt-4 text-sm leading-6 text-[#5f574d]">
        {item.description}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={isSaved ? onRemove : onSave}
          disabled={isSaving}
          className={`rounded-xl px-5 py-3 text-center text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isSaved
              ? 'bg-[#f8f3eb] text-[#4f5d3d] hover:bg-[#f2ece2]'
              : 'bg-[#4f5d3d] text-white hover:bg-[#414d31]'
          }`}
        >
          {isSaving
            ? 'Saving...'
            : isSaved
              ? 'Saved to my registry'
              : 'Add to my registry'}
        </button>

        {item.productUrl || item.affiliateUrl ? (
          <Link
            href={item.affiliateUrl || item.productUrl || '#'}
            className="rounded-xl bg-[#f8f3eb] px-5 py-3 text-center text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#f2ece2]"
          >
            View product
          </Link>
        ) : null}
      </div>
    </div>
  )
}

function SavedRegistryCard({
  item,
  isSaving,
  onRemove,
}: {
  item: SavedRegistryItem
  isSaving: boolean
  onRemove: () => void | Promise<void>
}) {
  return (
    <div className="rounded-3xl bg-[#fbf7ef]/85 p-5 shadow-[0_12px_35px_rgba(61,50,38,0.045)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#a45f51]">
              {item.itemType ? itemTypeLabels[item.itemType] : 'Saved'}
            </span>

            {item.source === 'willa_catalog' ? (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
                Willa pick
              </span>
            ) : null}
          </div>

          <h3 className="mt-4 font-serif text-2xl leading-tight text-[#211f1b]">
            {item.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-[#5f574d]">
            {item.description}
          </p>

          {item.productUrl || item.affiliateUrl ? (
            <Link
              href={item.affiliateUrl || item.productUrl || '#'}
              className="mt-4 inline-flex text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              View product →
            </Link>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={isSaving}
          className="shrink-0 text-xs font-semibold text-[#a45f51] transition hover:text-[#211f1b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#211f1b]">
        {label}
      </span>

      {children}
    </label>
  )
}

function buildCatalogRegistryItemId(catalogItemId: string) {
  return `catalog-${catalogItemId}`
}

function buildRegistryShareMessage(items: SavedRegistryItem[]) {
  if (items.length === 0) return ''

  const groupedItems = items.reduce<Record<string, SavedRegistryItem[]>>(
    (groups, item) => {
      groups[item.category] = groups[item.category] || []
      groups[item.category].push(item)

      return groups
    },
    {}
  )

  const itemLines = Object.entries(groupedItems)
    .map(([category, categoryItems]) => {
      const lines = categoryItems.map((item) => `• ${item.title}`).join('\n')

      return `${category}\n${lines}`
    })
    .join('\n\n')

  return `I’m building a small mom-focused support registry through Willa.

Instead of only baby items, I’m saving the kinds of care and support that would help me recover and settle in after birth.

${itemLines}

Thank you for helping me feel cared for too.`
}
