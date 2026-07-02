'use client'

import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
} from 'lucide-react'

import ProviderMap from '@/components/providers/ProviderMap'
import { getProviderCategoryConfig } from '@/data/providers/categories'
import type { WillaProvider } from '@/types/providers'

type HomeFindSupportPreviewProps = {
  providers: WillaProvider[]
}

function getProviderScore(provider: WillaProvider) {
  return (
    Number(Boolean(provider.isFeatured)) * 50 +
    Number(Boolean(provider.isVerified)) * 35 +
    Number(Boolean(provider.isClaimed)) * 25 +
    Number(Boolean(provider.image)) * 12 +
    Number(Boolean(provider.website)) * 8 +
    Number(Boolean(provider.email)) * 6 +
    Number(Boolean(provider.phone)) * 4 +
    Number(provider.specialties.length > 0) * 4
  )
}

function getPreviewProviders(providers: WillaProvider[]) {
  const sorted = [...providers].sort((a, b) => {
    const scoreDifference = getProviderScore(b) - getProviderScore(a)

    if (scoreDifference !== 0) {
      return scoreDifference
    }

    return a.name.localeCompare(b.name)
  })

  const selected: WillaProvider[] = []
  const usedCategories = new Set<string>()

  for (const provider of sorted) {
    if (selected.length >= 3) break

    if (!usedCategories.has(provider.category)) {
      selected.push(provider)
      usedCategories.add(provider.category)
    }
  }

  if (selected.length < 3) {
    for (const provider of sorted) {
      if (selected.length >= 3) break

      const alreadySelected = selected.some((item) => item.id === provider.id)

      if (!alreadySelected) {
        selected.push(provider)
      }
    }
  }

  return selected
}

export default function HomeFindSupportPreview({
  providers,
}: HomeFindSupportPreviewProps) {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvider, setSelectedProvider] =
    useState<WillaProvider | null>(null)
  const [focusProviderId, setFocusProviderId] = useState<string | null>(null)

  const previewProviders = useMemo(() => {
    return getPreviewProviders(providers)
  }, [providers])

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanQuery = searchQuery.trim()

    if (!cleanQuery) {
      router.push('/providers')
      return
    }

    router.push(`/providers?q=${encodeURIComponent(cleanQuery)}`)
  }

  function handleSelectProvider(provider: WillaProvider) {
    setSelectedProvider(provider)
    setFocusProviderId(provider.id)
  }

  return (
    <div className="relative lg:pl-4">
      <div className="absolute -inset-10 -z-10 hidden rounded-[3rem] bg-[#f2ece2]/45 blur-3xl sm:block" />

      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col items-stretch gap-3 rounded-[1.5rem] border border-[#e2d7c8] bg-white/82 px-4 py-4 shadow-[0_14px_40px_rgba(61,50,38,0.05)] transition focus-within:border-[#a45f51] hover:bg-white sm:flex-row sm:items-center sm:rounded-full sm:px-5 sm:py-3.5"
      >
        <Search
          className="hidden h-4 w-4 shrink-0 text-[#8a8277] sm:block"
          strokeWidth={1.8}
        />

        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          name="q"
          type="search"
          placeholder="Search doulas, midwives, lactation consultants..."
          className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-[#211f1b] outline-none placeholder:text-[#8a8277] sm:min-h-0 sm:text-base"
        />

        <button
          type="submit"
          className="rounded-full bg-[#4f5d3d] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#414d31] sm:py-2"
        >
          Search
        </button>
      </form>

      <div className="mt-4 h-[17rem] overflow-hidden rounded-[1.5rem] border border-[#e2d7c8] bg-[#f2ece2] shadow-[0_24px_80px_rgba(61,50,38,0.08)] sm:h-[21rem] sm:rounded-[2rem] lg:h-[19rem]">
        {providers.length > 0 ? (
          <ProviderMap
            providers={providers}
            focusProviderId={focusProviderId}
            selectedProviderId={selectedProvider?.id ?? null}
            flyToRequest={null}
            onProviderSelect={handleSelectProvider}
            onViewportProvidersChange={() => undefined}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm leading-6 text-[#655d52]">
            Providers are being added.
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-b border-[#e5d9ca] pb-4">
        <div>
          <h3 className="text-xl font-semibold text-[#211f1b]">
            Support providers
          </h3>

          <p className="mt-1 text-sm text-[#655d52]">
            {providers.length}{' '}
            {providers.length === 1 ? 'provider' : 'providers'} listed in
            Willa so far
          </p>
        </div>

        <Link
          href="/providers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
        >
          View all providers
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
        </Link>
      </div>

      {previewProviders.length > 0 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {previewProviders.map((provider) => (
            <ProviderPreviewCard
              key={provider.id}
              provider={provider}
              active={selectedProvider?.id === provider.id}
              onSelect={() => handleSelectProvider(provider)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-[#655d52]">
          Willa is adding doulas, midwives, lactation consultants, postpartum
          care, and other mom-first support providers.
        </p>
      )}
    </div>
  )
}

function ProviderPreviewCard({
  provider,
  active,
  onSelect,
}: {
  provider: WillaProvider
  active: boolean
  onSelect: () => void
}) {
  const category = getProviderCategoryConfig(provider.category)
  const specialty = provider.specialties[0]
  const location = [provider.location.city, provider.location.state]
    .filter(Boolean)
    .join(', ')

  return (
    <div
      className={[
        'flex min-h-[12rem] min-w-0 flex-col rounded-[1.35rem] border bg-white/72 p-4 shadow-[0_10px_30px_rgba(61,50,38,0.04)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_42px_rgba(61,50,38,0.07)]',
        active ? 'border-[#4f5d3d]' : 'border-[#e2d7c8]',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex flex-1 flex-col text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-[#f5ded5] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
            {category.label}
          </span>

          <Heart className="h-4 w-4 text-[#655d52]" strokeWidth={1.8} />
        </div>

        <p className="mt-4 line-clamp-2 font-serif text-xl leading-tight text-[#211f1b]">
          {provider.name}
        </p>

        <p className="mt-1 line-clamp-1 text-sm text-[#655d52]">
          {specialty ?? provider.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {provider.isVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef0e6] px-2.5 py-1 text-[0.68rem] font-semibold text-[#4f5d3d]">
              <BadgeCheck className="h-3 w-3" strokeWidth={2} />
              Verified
            </span>
          ) : null}

          {provider.isClaimed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef0e6] px-2.5 py-1 text-[0.68rem] font-semibold text-[#4f5d3d]">
              <ShieldCheck className="h-3 w-3" strokeWidth={2} />
              Claimed
            </span>
          ) : null}
        </div>

        <p className="mt-auto flex items-center gap-2 pt-4 text-sm text-[#655d52]">
          <MapPin className="h-4 w-4 shrink-0 text-[#a45f51]" strokeWidth={1.8} />
          <span className="line-clamp-1">{location}</span>
        </p>
      </button>

      <Link
        href={`/providers/${provider.slug}`}
        className="mt-4 inline-flex text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
      >
        View profile
      </Link>
    </div>
  )
}
