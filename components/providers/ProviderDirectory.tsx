'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { FaInstagram } from 'react-icons/fa6'
import {
  BadgeCheck,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react'

import ProviderMap from '@/components/providers/ProviderMap'
import {
  getProviderCategoryConfig,
  providerCategories,
} from '@/data/providers/categories'
import type { ProviderCategory, WillaProvider } from '@/types/providers'

type ProviderDirectoryProps = {
  providers: WillaProvider[]
}

type SelectedCategory = ProviderCategory | 'all'

type FlyToRequest = {
  id: number
  center: [number, number]
  zoom?: number
}

function getInstagramUrl(instagram: string) {
  if (instagram.startsWith('http')) {
    return instagram
  }

  return `https://instagram.com/${instagram.replace('@', '')}`
}

export default function ProviderDirectory({
  providers,
}: ProviderDirectoryProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [category, setCategory] = useState<SelectedCategory>('all')
  const [selectedProvider, setSelectedProvider] =
    useState<WillaProvider | null>(null)
  const [focusProviderId, setFocusProviderId] = useState<string | null>(null)

  const [useMapArea, setUseMapArea] = useState(false)
  const [viewportProviders, setViewportProviders] = useState<
    WillaProvider[] | null
  >(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [flyToRequest, setFlyToRequest] = useState<FlyToRequest | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 250)

    return () => {
      window.clearTimeout(timer)
    }
  }, [query])

  const filteredProviders = useMemo(() => {
    const cleanQuery = debouncedQuery.toLowerCase()

    return providers.filter((provider) => {
      if (category !== 'all' && provider.category !== category) {
        return false
      }

      if (cleanQuery) {
        const categoryLabel =
          providerCategories.find((item) => item.slug === provider.category)
            ?.label ?? provider.category

        const searchable = [
          provider.name,
          provider.description,
          provider.location.city,
          provider.location.state,
          provider.location.country,
          categoryLabel,
          ...provider.specialties,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        if (!searchable.includes(cleanQuery)) {
          return false
        }
      }

      return true
    })
  }, [providers, category, debouncedQuery])

  const shownProviders =
    useMapArea && viewportProviders ? viewportProviders : filteredProviders

  useEffect(() => {
    if (!selectedProvider) return

    const stillVisible = shownProviders.some(
      (provider) => provider.id === selectedProvider.id
    )

    if (!stillVisible) {
      setSelectedProvider(null)
      setFocusProviderId(null)
    }
  }, [shownProviders, selectedProvider])

  const hasActiveFilters =
    category !== 'all' || query.trim().length > 0 || useMapArea

  function resetFilters() {
    setQuery('')
    setDebouncedQuery('')
    setCategory('all')
    setSelectedProvider(null)
    setFocusProviderId(null)
    setUseMapArea(false)
    setViewportProviders(null)
    setGeoError(null)
  }

  function handleSelectProvider(provider: WillaProvider) {
    setSelectedProvider(provider)
    setFocusProviderId(provider.id)
  }

  function handleUseMyLocation() {
    setGeoError(null)

    if (!navigator.geolocation) {
      setGeoError('Your browser does not support location access.')
      return
    }

    setGeoLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const center: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ]

        setFlyToRequest({
          id: Date.now(),
          center,
          zoom: 12.5,
        })

        setUseMapArea(true)
        setSelectedProvider(null)
        setFocusProviderId(null)
        setGeoLoading(false)
      },
      () => {
        setGeoError('Location access was not allowed.')
        setGeoLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 text-[#211f1b] sm:px-8 lg:px-10 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Find support near you
          </p>

          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-tight tracking-tight text-[#211f1b] sm:text-6xl">
            Pregnancy and postpartum support, mapped.
          </h1>
        </div>

        <p className="max-w-xl text-base leading-7 text-[#655d52] lg:justify-self-end">
          Discover doulas, lactation consultants, pelvic floor therapists,
          mental health support, postpartum care, and other providers for the
          parts of motherhood that deserve a village.
        </p>
      </div>

      <div className="mt-8 rounded-[2rem] border border-[#e2d7c8] bg-[#f8f3eb] p-4 shadow-[0_18px_55px_rgba(61,50,38,0.055)] sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8277]"
              strokeWidth={1.8}
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search doulas, lactation, therapy, postpartum care..."
              className="h-12 w-full rounded-full border border-[#e2d7c8] bg-white pl-11 pr-11 text-sm outline-none transition placeholder:text-[#9a9186] focus:border-[#a45f51]"
            />

            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8277] transition hover:text-[#211f1b]"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-[#211f1b]">
              {shownProviders.length}
            </span>

            <span className="text-[#655d52]">
              {shownProviders.length === 1 ? 'provider' : 'providers'}
            </span>

            <button
              type="button"
              onClick={() => {
                setUseMapArea((current) => !current)
                setSelectedProvider(null)
                setFocusProviderId(null)
              }}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                useMapArea
                  ? 'bg-[#4f5d3d] text-white'
                  : 'bg-white text-[#4f5d3d] hover:text-[#211f1b]',
              ].join(' ')}
            >
              {useMapArea ? 'Showing map area' : 'Search map area'}
            </button>

            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={geoLoading}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b] disabled:opacity-50"
            >
              {geoLoading ? 'Locating...' : 'Use my location'}
            </button>

            {hasActiveFilters || selectedProvider ? (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#a45f51] transition hover:text-[#211f1b]"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <CategoryPill
            label="All"
            active={category === 'all'}
            onClick={() => {
              setCategory('all')
              setSelectedProvider(null)
              setFocusProviderId(null)
            }}
          />

          {providerCategories.map((item) => (
            <CategoryPill
              key={item.slug}
              label={item.label}
              active={category === item.slug}
              onClick={() => {
                setCategory(item.slug)
                setSelectedProvider(null)
                setFocusProviderId(null)
              }}
            />
          ))}
        </div>

        {geoError ? (
          <p className="mt-3 text-sm text-[#a45f51]">{geoError}</p>
        ) : null}

        {useMapArea ? (
          <p className="mt-3 text-sm leading-6 text-[#655d52]">
            Showing providers inside the current map area. Move the map to
            update the list.
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.45fr)] lg:items-start">
        <aside className="order-2 lg:order-1 lg:h-[42rem]">
          {selectedProvider ? (
            <ProviderDetailPanel
              provider={selectedProvider}
              onBack={() => {
                setSelectedProvider(null)
                setFocusProviderId(null)
              }}
            />
          ) : (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="mb-4 flex shrink-0 items-end justify-between border-b border-[#e5d9ca] pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
                    Directory
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-[#211f1b]">
                    Available support
                  </h2>
                </div>

                <p className="text-sm text-[#8a8277]">
                  {providers.length} total
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <ProviderResultsList
                  results={shownProviders}
                  useMapArea={useMapArea}
                  onSelectProvider={handleSelectProvider}
                />
              </div>
            </div>
          )}
        </aside>

        <div className="order-1 lg:order-2">
          <div className="sticky top-6 h-[26rem] overflow-hidden rounded-[2rem] border border-[#e2d7c8] bg-[#f2ece2] shadow-[0_24px_80px_rgba(61,50,38,0.08)] sm:h-[32rem] lg:h-[42rem]">
            <ProviderMap
              providers={filteredProviders}
              focusProviderId={focusProviderId}
              selectedProviderId={selectedProvider?.id ?? null}
              flyToRequest={flyToRequest}
              onProviderSelect={handleSelectProvider}
              onViewportProvidersChange={setViewportProviders}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition',
        active
          ? 'bg-[#4f5d3d] text-white shadow-sm'
          : 'bg-white text-[#655d52] hover:bg-[#fbf7ef] hover:text-[#211f1b]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function ProviderResultsList({
  results,
  useMapArea,
  onSelectProvider,
}: {
  results: WillaProvider[]
  useMapArea: boolean
  onSelectProvider: (provider: WillaProvider) => void
}) {
  if (results.length === 0) {
    return (
      <div className="rounded-[1.5rem] bg-white/60 p-5 text-sm leading-6 text-[#655d52]">
        {useMapArea
          ? 'No providers found in this map area. Try moving or zooming the map.'
          : 'No providers found yet. Try a different search or category.'}
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#e5d9ca]">
      {results.map((provider) => (
        <ProviderListCard
          key={provider.id}
          provider={provider}
          onClick={() => onSelectProvider(provider)}
        />
      ))}
    </div>
  )
}

function ProviderListCard({
  provider,
  onClick,
}: {
  provider: WillaProvider
  onClick: () => void
}) {
  const category = getProviderCategoryConfig(provider.category)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full px-1 py-5 text-left transition hover:bg-white/45 sm:px-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#f5ded5] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
          {category.label}
        </span>

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

        {provider.isFeatured ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2dc] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
            <Star className="h-3 w-3 fill-current" strokeWidth={2} />
            Featured
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 font-serif text-2xl leading-tight text-[#211f1b] transition group-hover:text-[#4f5d3d]">
        {provider.name}
      </h3>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#655d52]">
        {provider.description}
      </p>

      <div className="mt-3 flex items-center gap-2 text-sm text-[#655d52]">
        <MapPin className="h-4 w-4 text-[#a45f51]" strokeWidth={1.8} />

        <span>
          {provider.location.city}
          {provider.location.state ? `, ${provider.location.state}` : ''}
        </span>
      </div>

      {provider.specialties.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {provider.specialties.slice(0, 3).map((specialty) => (
            <span
              key={specialty}
              className="rounded-full bg-[#f8f3eb] px-2.5 py-1 text-[0.72rem] font-semibold text-[#655d52]"
            >
              {specialty}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  )
}

function ProviderDetailPanel({
  provider,
  onBack,
}: {
  provider: WillaProvider
  onBack: () => void
}) {
  const category = getProviderCategoryConfig(provider.category)

  return (
    <div className="h-full overflow-y-auto border-t border-[#e5d9ca] pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
      >
        ← Back to results
      </button>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />

        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
          {category.label}
        </span>

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

        {provider.isFeatured ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f5ded5] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
            <Star className="h-3 w-3 fill-current" strokeWidth={2} />
            Featured
          </span>
        ) : null}
      </div>

      <h2 className="mt-4 font-serif text-4xl leading-tight text-[#211f1b]">
        {provider.name}
      </h2>

      <div className="mt-4 flex items-center gap-2 text-sm text-[#655d52]">
        <MapPin className="h-4 w-4 text-[#a45f51]" strokeWidth={1.8} />

        <span>
          {provider.location.city}
          {provider.location.state ? `, ${provider.location.state}` : ''}
        </span>
      </div>

      <p className="mt-6 text-sm leading-6 text-[#655d52]">
        {provider.description}
      </p>

      {provider.specialties.length > 0 ? (
        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#39472c]">
            Specialties
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {provider.specialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full bg-[#f8f3eb] px-3 py-1.5 text-xs font-semibold text-[#655d52]"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-2">
        <Link
          href={`/providers/${provider.slug}`}
          className="flex items-center justify-center rounded-xl bg-[#a45f51] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8f5145]"
        >
          View Willa profile
        </Link>

        {provider.website ? (
          <a
            href={provider.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#4f5d3d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
          >
            Visit website
            <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
          </a>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-3">
          {provider.instagram ? (
            <a
              href={getInstagramUrl(provider.instagram)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#e2d7c8] bg-white/60 px-4 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-white hover:text-[#211f1b]"
            >
              <FaInstagram className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Instagram</span>
            </a>
          ) : null}

          {provider.email ? (
            <a
              href={`mailto:${provider.email}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#e2d7c8] bg-white/60 px-4 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-white hover:text-[#211f1b]"
            >
              <Mail className="h-4 w-4" strokeWidth={1.8} />
              <span className="sr-only sm:not-sr-only">Email</span>
            </a>
          ) : null}

          {provider.phone ? (
            <a
              href={`tel:${provider.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#e2d7c8] bg-white/60 px-4 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-white hover:text-[#211f1b]"
            >
              <Phone className="h-4 w-4" strokeWidth={1.8} />
              <span className="sr-only sm:not-sr-only">Call</span>
            </a>
          ) : null}

          {!provider.instagram && !provider.email && !provider.phone ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-[#e2d7c8] bg-white/60 px-4 py-3 text-sm font-semibold text-[#8a8277] sm:col-span-3">
              <Globe className="h-4 w-4" strokeWidth={1.8} />
              Contact info coming soon
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-8 border-t border-[#e5d9ca] pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
          Is this your profile?
        </p>

        {provider.isClaimed ? (
          <p className="mt-2 text-sm leading-6 text-[#655d52]">
            This profile has been claimed. If something needs updating, contact
            Willa and we’ll help review it.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm leading-6 text-[#655d52]">
              Providers can claim and complete their Willa profiles.
            </p>

            <Link
              href={`/providers/claim?provider=${provider.slug}`}
              className="mt-3 inline-flex text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              Claim this profile →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}