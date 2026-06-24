'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import type { SupportOption } from '@/data/nearMe'
import {
  buildNearMeProviderId,
  getSavedNearMeProvidersForCurrentUser,
  removeNearMeProviderForCurrentUser,
  saveNearMeProviderForCurrentUser,
  SAVED_NEAR_ME_UPDATED_EVENT,
  type SavedNearMeProvider,
} from '@/lib/nearMeStorage'

type NearMeDirectoryProps = {
  options: SupportOption[]
}

export default function NearMeDirectory({ options }: NearMeDirectoryProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedProviders, setSavedProviders] = useState<SavedNearMeProvider[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [savingProviderId, setSavingProviderId] = useState('')

  useEffect(() => {
    let isMounted = true

    async function refreshSavedProviders() {
      const providers = await getSavedNearMeProvidersForCurrentUser()

      if (!isMounted) return

      setSavedProviders(providers)
      setIsLoading(false)
    }

    function handleRefreshSavedProviders() {
      void refreshSavedProviders()
    }

    handleRefreshSavedProviders()

    window.addEventListener(
      SAVED_NEAR_ME_UPDATED_EVENT,
      handleRefreshSavedProviders
    )
    window.addEventListener('storage', handleRefreshSavedProviders)

    return () => {
      isMounted = false
      window.removeEventListener(
        SAVED_NEAR_ME_UPDATED_EVENT,
        handleRefreshSavedProviders
      )
      window.removeEventListener('storage', handleRefreshSavedProviders)
    }
  }, [])

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(options.map((option) => option.category))
    )

    return ['All', ...uniqueCategories]
  }, [options])

  const savedProviderIds = useMemo(
    () => new Set(savedProviders.map((provider) => provider.id)),
    [savedProviders]
  )

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return options.filter((option) => {
      const matchesCategory =
        activeCategory === 'All' || option.category === activeCategory

      const searchableText = [
        option.type,
        option.category,
        option.description,
        option.distance,
      ]
        .join(' ')
        .toLowerCase()

      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, options, query])

  async function handleToggleOption(option: SupportOption) {
    const providerId = buildNearMeProviderId(
      option.type,
      option.description
    )
    const isSaved = savedProviderIds.has(providerId)

    setSavingProviderId(providerId)

    if (isSaved) {
      const nextProviders =
        await removeNearMeProviderForCurrentUser(providerId)

      setSavedProviders(nextProviders)
      setSavingProviderId('')
      return
    }

    const nextProviders = await saveNearMeProviderForCurrentUser({
      id: providerId,
      type: option.type,
      description: option.description,
      distance: option.distance,
      href: option.href,
    })

    setSavedProviders(nextProviders)
    setSavingProviderId('')
  }

  return (
    <section className="mt-8">
      <div className="rounded-[2.5rem] bg-white p-5 shadow-[0_18px_55px_rgba(61,50,38,0.06)] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef]">
            <div className="flex items-center gap-3 px-5 py-4">
              <span className="text-sm text-[#a45f51]">⌕</span>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search support... e.g. lactation, doula, pelvic floor"
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
            {isLoading ? 'Loading...' : `${savedProviders.length} saved`}
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
            Filter by support type
          </p>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = category === activeCategory

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
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

      {isLoading ? (
        <div className="mt-6 rounded-[2rem] bg-[#f2ece2] p-8 text-center shadow-[0_18px_55px_rgba(61,50,38,0.05)]">
          <p className="font-serif text-3xl text-[#211f1b]">
            Loading support options...
          </p>

          <p className="mt-3 text-sm leading-6 text-[#5f574d]">
            Willa is gathering your saved support list.
          </p>
        </div>
      ) : filteredOptions.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredOptions.map((option) => {
            const providerId = buildNearMeProviderId(
              option.type,
              option.description
            )
            const isSaved = savedProviderIds.has(providerId)
            const isSaving = savingProviderId === providerId

            return (
              <div
                key={providerId}
                className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f5ded5] px-3 py-1 text-xs font-semibold text-[#a45f51]">
                    {option.category}
                  </span>

                  <span className="rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
                    {option.distance}
                  </span>
                </div>

                <h2 className="mt-5 font-serif text-3xl leading-tight text-[#211f1b]">
                  {option.type}
                </h2>

                <p className="mt-4 text-sm leading-6 text-[#5f574d]">
                  {option.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleOption(option)}
                    disabled={isSaving}
                    className={`rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isSaved
                        ? 'bg-[#f8f3eb] text-[#4f5d3d] hover:bg-[#f2ece2]'
                        : 'bg-[#4f5d3d] text-white hover:bg-[#414d31]'
                    }`}
                  >
                    {isSaving
                      ? 'Saving...'
                      : isSaved
                        ? 'Saved to my Willa'
                        : 'Save to my Willa'}
                  </button>

                  <Link
                    href={option.href}
                    className="rounded-xl bg-[#f8f3eb] px-5 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#f2ece2]"
                  >
                    View details
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-[2rem] bg-[#f2ece2] p-8 text-center shadow-[0_18px_55px_rgba(61,50,38,0.05)]">
          <p className="font-serif text-3xl text-[#211f1b]">
            No support options found.
          </p>

          <p className="mt-3 text-sm leading-6 text-[#5f574d]">
            Try searching for doula, feeding, recovery, meals, or mental health.
          </p>
        </div>
      )}
    </section>
  )
}