'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import type { NearMeProvider } from '@/types/profile'
import {
  buildNearMeProviderId,
  getSavedNearMeProvidersForCurrentUser,
  removeNearMeProviderForCurrentUser,
  saveNearMeProviderForCurrentUser,
  SAVED_NEAR_ME_UPDATED_EVENT,
  type SavedNearMeProvider,
} from '@/lib/nearMeStorage'

type NearMePreviewProps = {
  providers: NearMeProvider[]
}

export default function NearMePreview({ providers }: NearMePreviewProps) {
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

    refreshSavedProviders()

    window.addEventListener(SAVED_NEAR_ME_UPDATED_EVENT, refreshSavedProviders)
    window.addEventListener('storage', refreshSavedProviders)

    return () => {
      isMounted = false
      window.removeEventListener(
        SAVED_NEAR_ME_UPDATED_EVENT,
        refreshSavedProviders
      )
      window.removeEventListener('storage', refreshSavedProviders)
    }
  }, [])

  const savedProviderIds = useMemo(
    () => new Set(savedProviders.map((provider) => provider.id)),
    [savedProviders]
  )

  async function handleToggleProvider(provider: NearMeProvider) {
    const providerId = buildNearMeProviderId(
      provider.type,
      provider.description
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
      type: provider.type,
      description: provider.description,
      distance: provider.distance,
      href: provider.href,
    })

    setSavedProviders(nextProviders)
    setSavingProviderId('')
  }

  return (
    <section
      id="near-me"
      className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Near me
          </p>

          <h2 className="mt-4 font-serif text-3xl">
            Support close to home
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            Save local support options to your Willa so you can come back to
            them when you are ready.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
          {isLoading ? 'Loading...' : `${savedProviders.length} saved`}
        </span>
      </div>

      {isLoading ? (
        <div className="mt-6 rounded-2xl bg-[#f8f3eb] p-5">
          <p className="text-sm leading-6 text-[#5f574d]">
            Loading nearby support...
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid items-stretch gap-4 md:grid-cols-3">
        {providers.map((provider) => {
          const providerId = buildNearMeProviderId(
            provider.type,
            provider.description
          )
          const isSaved = savedProviderIds.has(providerId)
          const isSaving = savingProviderId === providerId

          return (
            <article
              key={providerId}
              className="flex h-full min-h-[14.75rem] flex-col rounded-3xl bg-[#f8f3eb] p-5 transition hover:bg-[#f2ece2]"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d8b8a9] text-sm font-semibold text-[#7b4f45]">
                    {provider.type.charAt(0)}
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#a45f51]">
                    {provider.distance}
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-2xl leading-tight text-[#211f1b]">
                  {provider.type}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#5f574d]">
                  {provider.description}
                </p>
              </div>

              <div className="mt-auto space-y-2 pt-5">
                <button
                  type="button"
                  onClick={() => handleToggleProvider(provider)}
                  disabled={isSaving}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isSaved
                      ? 'bg-white text-[#4f5d3d] hover:bg-[#fffdf9]'
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
                  href={provider.href}
                  className="inline-flex text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
                >
                  View details →
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {!isLoading && savedProviders.length > 0 ? (
        <div className="mt-6 rounded-3xl bg-[#f8f3eb] p-5">
          <p className="text-sm font-semibold text-[#211f1b]">
            Saved support options
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {savedProviders.map((provider) => (
              <span
                key={provider.id}
                className="rounded-full bg-white px-4 py-2 text-sm text-[#5f574d]"
              >
                {provider.type}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}