'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import type { ProfileRegistryIdea } from '@/types/profile'
import {
  buildRegistryItemId,
  getSavedRegistryItemsForCurrentUser,
  removeRegistryItemForCurrentUser,
  saveRegistryItemForCurrentUser,
  SAVED_REGISTRY_UPDATED_EVENT,
  type SavedRegistryItem,
} from '@/lib/registryStorage'

type RegistryIdeasProps = {
  ideas: ProfileRegistryIdea[]
}

export default function RegistryIdeas({ ideas }: RegistryIdeasProps) {
  const [savedItems, setSavedItems] = useState<SavedRegistryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingItemId, setSavingItemId] = useState('')

  useEffect(() => {
    let isMounted = true

    async function refreshSavedItems() {
      const items = await getSavedRegistryItemsForCurrentUser()

      if (!isMounted) return

      setSavedItems(items)
      setIsLoading(false)
    }

    refreshSavedItems()

    window.addEventListener(SAVED_REGISTRY_UPDATED_EVENT, refreshSavedItems)
    window.addEventListener('storage', refreshSavedItems)

    return () => {
      isMounted = false
      window.removeEventListener(SAVED_REGISTRY_UPDATED_EVENT, refreshSavedItems)
      window.removeEventListener('storage', refreshSavedItems)
    }
  }, [])

  const savedItemIds = useMemo(
    () => new Set(savedItems.map((item) => item.id)),
    [savedItems]
  )

  async function handleToggleIdea(idea: ProfileRegistryIdea) {
    const itemId = buildRegistryItemId(idea.title)
    const isSaved = savedItemIds.has(itemId)

    setSavingItemId(itemId)

    if (isSaved) {
      const nextItems = await removeRegistryItemForCurrentUser(itemId)
      setSavedItems(nextItems)
      setSavingItemId('')
      return
    }

    const nextItems = await saveRegistryItemForCurrentUser({
      id: itemId,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      itemType: 'support',
      source: 'custom',
    })

    setSavedItems(nextItems)
    setSavingItemId('')
  }

  return (
    <section
      id="registry-ideas"
      className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Registry ideas
          </p>

          <h2 className="mt-4 font-serif text-3xl">
            Things people can help with
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            Save support ideas for recovery, meals, feeding, rest, and the
            practical help that usually gets forgotten.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
            {isLoading ? 'Loading...' : `${savedItems.length} saved`}
          </span>

          <Link
            href="/registry"
            className="w-fit rounded-full bg-[#f8f3eb] px-3 py-1 text-xs font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b]"
          >
            Open registry →
          </Link>
        </div>
      </div>

      <div className="mt-6 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea) => {
          const itemId = buildRegistryItemId(idea.title)
          const isSaved = savedItemIds.has(itemId)
          const isSaving = savingItemId === itemId

          return (
            <article
              key={idea.title}
              className="flex h-full min-h-[13.5rem] flex-col rounded-2xl bg-[#f8f3eb] p-5 transition hover:bg-[#f2ece2]"
            >
              <div className="flex-1">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#a45f51]">
                  {idea.category}
                </span>

                <h3 className="mt-4 font-serif text-2xl leading-tight text-[#211f1b]">
                  {idea.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#5f574d]">
                  {idea.description}
                </p>
              </div>

              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={() => handleToggleIdea(idea)}
                  disabled={isSaving}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isSaved
                      ? 'bg-white text-[#4f5d3d] hover:bg-[#eef0e6]'
                      : 'bg-[#4f5d3d] text-white hover:bg-[#414d31]'
                  }`}
                >
                  {isSaving
                    ? 'Saving...'
                    : isSaved
                      ? 'Saved to my registry'
                      : 'Add to my registry'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}