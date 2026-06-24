'use client'

import { useMemo, useState } from 'react'

import GuideCard from './GuideCard'
import type { Guide } from '@/types/guides'

type GuideLibraryProps = {
  guides: Guide[]
  initialQuery?: string
  initialCategory?: string
}

export default function GuideLibrary({
  guides,
  initialQuery = '',
  initialCategory = 'All',
}: GuideLibraryProps) {
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(guides.map((guide) => guide.category))
    )

    return ['All', ...uniqueCategories]
  }, [guides])

  const validInitialCategory = categories.includes(initialCategory)
    ? initialCategory
    : 'All'

  const [query, setQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(validInitialCategory)

  const filteredGuides = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return guides.filter((guide) => {
      const matchesCategory =
        activeCategory === 'All' || guide.category === activeCategory

      const searchableText = [
        guide.title,
        guide.description,
        guide.category,
        guide.stage,
        guide.readTime,
      ]
        .join(' ')
        .toLowerCase()

      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, guides, query])

  const hasActiveFilters = query.trim().length > 0 || activeCategory !== 'All'

  function clearFilters() {
    setQuery('')
    setActiveCategory('All')
  }

  return (
    <section className="mt-10">
      <div className="rounded-[2.5rem] bg-white p-5 shadow-[0_18px_55px_rgba(61,50,38,0.06)] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef]">
            <div className="flex items-center gap-3 px-5 py-4">
              <span className="shrink-0 text-sm text-[#a45f51]">⌕</span>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search guides... postpartum, registry, feeding, visitors"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#211f1b] outline-none placeholder:text-[#8a8277]"
              />

              {query.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b]"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <span className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
              {filteredGuides.length}{' '}
              {filteredGuides.length === 1 ? 'guide' : 'guides'}
            </span>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="w-fit rounded-full bg-[#f8f3eb] px-3 py-1 text-xs font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b]"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
            Filter by topic
          </p>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = category === activeCategory

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
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

      {filteredGuides.length > 0 ? (
        <div className="mt-6 grid items-stretch gap-5 md:grid-cols-2">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[2rem] border border-[#e2d7c8] bg-[#f2ece2] p-8 text-center shadow-[0_18px_55px_rgba(61,50,38,0.05)]">
          <p className="font-serif text-3xl text-[#211f1b]">
            No guides found.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5f574d]">
            Try a broader word like postpartum, registry, feeding, support, or
            birth. Willa is still growing her library, one useful guide at a
            time.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
            >
              View all guides
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveCategory('All')
                setQuery('postpartum')
              }}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#fffdf9] hover:text-[#211f1b]"
            >
              Search postpartum
            </button>
          </div>
        </div>
      )}
    </section>
  )
}