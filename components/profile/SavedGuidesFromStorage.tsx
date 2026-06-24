'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { SavedGuideItem } from '@/types/saved-guide'
import {
  getSavedGuidesForCurrentUser,
  removeSavedGuideForCurrentUser,
  SAVED_GUIDES_UPDATED_EVENT,
} from '@/lib/savedGuidesStorage'

export default function SavedGuidesFromStorage() {
  const [savedGuides, setSavedGuides] = useState<SavedGuideItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingGuideSlug, setRemovingGuideSlug] = useState('')

  useEffect(() => {
    let isMounted = true

    async function refreshSavedGuides() {
      const guides = await getSavedGuidesForCurrentUser()

      if (!isMounted) return

      setSavedGuides(guides)
      setIsLoading(false)
    }

    refreshSavedGuides()

    window.addEventListener(SAVED_GUIDES_UPDATED_EVENT, refreshSavedGuides)
    window.addEventListener('storage', refreshSavedGuides)

    return () => {
      isMounted = false
      window.removeEventListener(SAVED_GUIDES_UPDATED_EVENT, refreshSavedGuides)
      window.removeEventListener('storage', refreshSavedGuides)
    }
  }, [])

  async function handleRemoveGuide(slug: string) {
    setRemovingGuideSlug(slug)

    const nextGuides = await removeSavedGuideForCurrentUser(slug)

    setSavedGuides(nextGuides)
    setRemovingGuideSlug('')
  }

  return (
    <section
      id="saved-guides"
      className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Saved guides
          </p>

          <h2 className="mt-4 font-serif text-3xl">
            Guides I want to come back to
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            Keep the guides that feel relevant to your stage, questions, or
            postpartum plan.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
          {isLoading ? 'Loading...' : `${savedGuides.length} saved`}
        </span>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : savedGuides.length > 0 ? (
        <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-2">
          {savedGuides.map((guide) => {
            const isRemoving = removingGuideSlug === guide.slug

            return (
              <article
                key={guide.slug}
                className="flex h-full flex-col rounded-2xl bg-[#f8f3eb] p-5 transition hover:bg-[#f2ece2]"
              >
                <div className="flex-1">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#a45f51]">
                    {guide.category}
                  </span>

                  <h3 className="mt-4 font-serif text-2xl leading-tight text-[#211f1b]">
                    {guide.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#5f574d]">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex justify-center rounded-xl bg-[#4f5d3d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#414d31]"
                  >
                    Read guide
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRemoveGuide(guide.slug)}
                    disabled={isRemoving}
                    className="inline-flex justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#a45f51] transition hover:bg-[#fffdf9] hover:text-[#211f1b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRemoving ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  )
}

function LoadingState() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      {[1, 2].map((item) => (
        <div key={item} className="rounded-2xl bg-[#f8f3eb] p-5">
          <div className="h-6 w-24 rounded-full bg-white" />
          <div className="mt-5 h-7 w-2/3 rounded-full bg-[#eadfd4]" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded-full bg-[#eadfd4]" />
            <div className="h-3 w-4/5 rounded-full bg-[#eadfd4]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-3xl border border-[#e5dccf] bg-[#f8f3eb] p-6">
      <div className="max-w-2xl">
        <p className="font-serif text-2xl leading-tight text-[#211f1b]">
          No saved guides yet.
        </p>

        <p className="mt-3 text-sm leading-6 text-[#5f574d]">
          Start by saving one guide that matches what you are thinking about
          right now. Recovery, visitors, feeding, hospital prep, or the
          practical stuff nobody tells you until 3am.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/guides"
            className="rounded-xl bg-[#4f5d3d] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#414d31]"
          >
            Browse guides
          </Link>

          <Link
            href="/guides?query=postpartum"
            className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#fffdf9] hover:text-[#211f1b]"
          >
            Start with postpartum
          </Link>
        </div>
      </div>
    </div>
  )
}