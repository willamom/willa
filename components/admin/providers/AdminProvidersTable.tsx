'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  Eye,
  Pencil,
  Search,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react'

import {
  getProviderCategoryConfig,
  providerCategories,
} from '@/data/providers/categories'
import type { AdminProvider, ProviderStatus } from '@/lib/admin/providers'
import type { ProviderCategory } from '@/types/providers'

type StatusFilter = ProviderStatus | 'all'
type CategoryFilter = ProviderCategory | 'all'

type FlagFilter =
  | 'all'
  | 'featured'
  | 'not_featured'
  | 'verified'
  | 'not_verified'
  | 'claimed'
  | 'not_claimed'
  | 'possible_duplicates'

type QualityFilter =
  | 'all'
  | 'incomplete'
  | 'published_incomplete'
  | 'missing_image'
  | 'missing_website'
  | 'missing_email'
  | 'missing_phone'
  | 'missing_instagram'
  | 'missing_contact'
  | 'missing_address'
  | 'no_specialties'
  | 'short_description'

type SortMode = 'newest' | 'oldest' | 'name' | 'city' | 'category'

type AdminProvidersTableProps = {
  providers: AdminProvider[]
  updateStatusAction: (formData: FormData) => void | Promise<void>
  updateFeaturedAction: (formData: FormData) => void | Promise<void>
  updateVerifiedAction: (formData: FormData) => void | Promise<void>
}

const statusLabels: Record<ProviderStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

function getStatusClassName(status: ProviderStatus) {
  switch (status) {
    case 'published':
      return 'bg-[#eef0e6] text-[#4f5d3d]'
    case 'archived':
      return 'bg-[#eee3d6] text-[#8a8277]'
    case 'draft':
    default:
      return 'bg-[#fff2dc] text-[#a45f51]'
  }
}

function getCountByStatus(providers: AdminProvider[], status: ProviderStatus) {
  return providers.filter((provider) => provider.status === status).length
}

function hasText(value?: string) {
  return String(value ?? '').trim().length > 0
}

function hasContact(provider: AdminProvider) {
  return (
    hasText(provider.website) ||
    hasText(provider.email) ||
    hasText(provider.phone) ||
    hasText(provider.instagram)
  )
}

function getQualityIssues(provider: AdminProvider) {
  const issues: string[] = []

  if (!hasText(provider.image)) {
    issues.push('Missing image')
  }

  if (!hasText(provider.website)) {
    issues.push('Missing website')
  }

  if (!hasText(provider.email)) {
    issues.push('Missing email')
  }

  if (!hasText(provider.phone)) {
    issues.push('Missing phone')
  }

  if (!hasText(provider.instagram)) {
    issues.push('Missing Instagram')
  }

  if (!hasText(provider.location.address)) {
    issues.push('Missing address')
  }

  if (provider.specialties.length === 0) {
    issues.push('No specialties')
  }

  if (provider.description.trim().length < 80) {
    issues.push('Short description')
  }

  if (!hasContact(provider)) {
    issues.push('No contact info')
  }

  return issues
}

function isIncompleteProvider(provider: AdminProvider) {
  return getQualityIssues(provider).length > 0
}

function matchesQualityFilter(
  provider: AdminProvider,
  qualityFilter: QualityFilter
) {
  switch (qualityFilter) {
    case 'incomplete':
      return isIncompleteProvider(provider)
    case 'published_incomplete':
      return provider.status === 'published' && isIncompleteProvider(provider)
    case 'missing_image':
      return !hasText(provider.image)
    case 'missing_website':
      return !hasText(provider.website)
    case 'missing_email':
      return !hasText(provider.email)
    case 'missing_phone':
      return !hasText(provider.phone)
    case 'missing_instagram':
      return !hasText(provider.instagram)
    case 'missing_contact':
      return !hasContact(provider)
    case 'missing_address':
      return !hasText(provider.location.address)
    case 'no_specialties':
      return provider.specialties.length === 0
    case 'short_description':
      return provider.description.trim().length < 80
    case 'all':
    default:
      return true
  }
}

function getSearchableText(provider: AdminProvider) {
  const category = getProviderCategoryConfig(provider.category)
  const qualityIssues = getQualityIssues(provider)

  return [
    provider.name,
    provider.slug,
    provider.description,
    provider.status,
    category.label,
    provider.location.address,
    provider.location.city,
    provider.location.state,
    provider.location.country,
    provider.website,
    provider.instagram,
    provider.email,
    provider.phone,
    provider.source,
    provider.notes,
    ...provider.specialties,
    ...qualityIssues,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function getProviderTimestamp(value?: string) {
  if (!value) return 0

  const timestamp = Date.parse(value)

  return Number.isFinite(timestamp) ? timestamp : 0
}

function normalizeDuplicateText(value?: string) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[?#].*$/, '')
    .replace(/\/$/, '')
    .replace(/['".,]/g, '')
    .replace(/\s+/g, ' ')
}

function normalizeInstagram(value?: string) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/^instagram\.com\//, '')
    .replace(/^@/, '')
    .replace(/[?#].*$/, '')
    .replace(/\/.*$/, '')
    .replace(/[^a-z0-9._]/g, '')
}

function normalizePhone(value?: string) {
  return String(value ?? '').replace(/\D/g, '')
}

function addDuplicateKey(
  map: Map<string, string[]>,
  key: string,
  providerId: string
) {
  if (!key || key.length < 3) return

  const existing = map.get(key) ?? []

  map.set(key, [...existing, providerId])
}

function getDuplicateProviderIds(providers: AdminProvider[]) {
  const duplicateIds = new Set<string>()

  const nameLocationMap = new Map<string, string[]>()
  const websiteMap = new Map<string, string[]>()
  const emailMap = new Map<string, string[]>()
  const instagramMap = new Map<string, string[]>()
  const phoneMap = new Map<string, string[]>()

  providers.forEach((provider) => {
    const normalizedName = normalizeDuplicateText(provider.name)
    const normalizedCity = normalizeDuplicateText(provider.location.city)
    const normalizedState = normalizeDuplicateText(provider.location.state)

    const nameLocationKey = [
      normalizedName,
      normalizedCity,
      normalizedState,
    ]
      .filter(Boolean)
      .join('|')

    if (normalizedName && normalizedCity) {
      addDuplicateKey(nameLocationMap, nameLocationKey, provider.id)
    }

    addDuplicateKey(
      websiteMap,
      normalizeDuplicateText(provider.website),
      provider.id
    )

    addDuplicateKey(
      emailMap,
      normalizeDuplicateText(provider.email),
      provider.id
    )

    addDuplicateKey(
      instagramMap,
      normalizeInstagram(provider.instagram),
      provider.id
    )

    const phone = normalizePhone(provider.phone)

    if (phone.length >= 7) {
      addDuplicateKey(phoneMap, phone, provider.id)
    }
  })

  const maps = [
    nameLocationMap,
    websiteMap,
    emailMap,
    instagramMap,
    phoneMap,
  ]

  maps.forEach((map) => {
    map.forEach((ids) => {
      if (ids.length > 1) {
        ids.forEach((id) => duplicateIds.add(id))
      }
    })
  })

  return duplicateIds
}

export default function AdminProvidersTable({
  providers,
  updateStatusAction,
  updateFeaturedAction,
  updateVerifiedAction,
}: AdminProvidersTableProps) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>('all')
  const [flagFilter, setFlagFilter] = useState<FlagFilter>('all')
  const [qualityFilter, setQualityFilter] =
    useState<QualityFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  const duplicateProviderIds = useMemo(
    () => getDuplicateProviderIds(providers),
    [providers]
  )

  const publishedCount = getCountByStatus(providers, 'published')
  const draftCount = getCountByStatus(providers, 'draft')
  const archivedCount = getCountByStatus(providers, 'archived')
  const featuredCount = providers.filter((provider) => provider.isFeatured).length
  const verifiedCount = providers.filter((provider) => provider.isVerified).length
  const claimedCount = providers.filter((provider) => provider.isClaimed).length
  const duplicateCount = duplicateProviderIds.size
  const incompleteCount = providers.filter(isIncompleteProvider).length
  const publishedIncompleteCount = providers.filter(
    (provider) => provider.status === 'published' && isIncompleteProvider(provider)
  ).length

  const filteredProviders = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()

    const filtered = providers.filter((provider) => {
      if (statusFilter !== 'all' && provider.status !== statusFilter) {
        return false
      }

      if (categoryFilter !== 'all' && provider.category !== categoryFilter) {
        return false
      }

      if (flagFilter === 'featured' && !provider.isFeatured) {
        return false
      }

      if (flagFilter === 'not_featured' && provider.isFeatured) {
        return false
      }

      if (flagFilter === 'verified' && !provider.isVerified) {
        return false
      }

      if (flagFilter === 'not_verified' && provider.isVerified) {
        return false
      }

      if (flagFilter === 'claimed' && !provider.isClaimed) {
        return false
      }

      if (flagFilter === 'not_claimed' && provider.isClaimed) {
        return false
      }

      if (
        flagFilter === 'possible_duplicates' &&
        !duplicateProviderIds.has(provider.id)
      ) {
        return false
      }

      if (!matchesQualityFilter(provider, qualityFilter)) {
        return false
      }

      if (cleanQuery && !getSearchableText(provider).includes(cleanQuery)) {
        return false
      }

      return true
    })

    return [...filtered].sort((a, b) => {
      if (sortMode === 'name') {
        return a.name.localeCompare(b.name)
      }

      if (sortMode === 'city') {
        return a.location.city.localeCompare(b.location.city)
      }

      if (sortMode === 'category') {
        const categoryA = getProviderCategoryConfig(a.category).label
        const categoryB = getProviderCategoryConfig(b.category).label

        return categoryA.localeCompare(categoryB)
      }

      if (sortMode === 'oldest') {
        return (
          getProviderTimestamp(a.createdAt) -
          getProviderTimestamp(b.createdAt)
        )
      }

      return (
        getProviderTimestamp(b.createdAt) -
        getProviderTimestamp(a.createdAt)
      )
    })
  }, [
    providers,
    query,
    statusFilter,
    categoryFilter,
    flagFilter,
    qualityFilter,
    sortMode,
    duplicateProviderIds,
  ])

  const hasActiveFilters =
    query.trim().length > 0 ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    flagFilter !== 'all' ||
    qualityFilter !== 'all' ||
    sortMode !== 'newest'

  function resetFilters() {
    setQuery('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setFlagFilter('all')
    setQualityFilter('all')
    setSortMode('newest')
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Willa admin
          </p>

          <h1 className="mt-3 font-serif text-5xl leading-tight tracking-tight">
            Providers
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
            Manage provider listings, publish profiles, and organize the Willa
            directory as it grows.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9">
        <StatCard label="Published" value={publishedCount} />
        <StatCard label="Drafts" value={draftCount} />
        <StatCard label="Archived" value={archivedCount} />
        <StatCard label="Featured" value={featuredCount} />
        <StatCard label="Verified" value={verifiedCount} />
        <StatCard label="Claimed" value={claimedCount} />
        <StatCard
          label="Duplicates"
          value={duplicateCount}
          highlight={duplicateCount > 0}
        />
        <StatCard
          label="Incomplete"
          value={incompleteCount}
          highlight={incompleteCount > 0}
        />
        <StatCard
          label="Published gaps"
          value={publishedIncompleteCount}
          highlight={publishedIncompleteCount > 0}
        />
      </div>

      <section className="mt-8 rounded-[2rem] border border-[#e2d7c8] bg-white/70 p-4 shadow-[0_24px_80px_rgba(61,50,38,0.06)] sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8277]"
              strokeWidth={1.8}
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, city, specialty, email, source..."
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
              {filteredProviders.length}
            </span>

            <span className="text-[#655d52]">
              {filteredProviders.length === 1 ? 'result' : 'results'}
            </span>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full bg-[#f8f3eb] px-4 py-2 text-sm font-semibold text-[#a45f51] transition hover:text-[#211f1b]"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SelectField
            label="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </SelectField>

          <SelectField
            label="Category"
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value as CategoryFilter)}
          >
            <option value="all">All categories</option>
            {providerCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Flags"
            value={flagFilter}
            onChange={(value) => setFlagFilter(value as FlagFilter)}
          >
            <option value="all">All flags</option>
            <option value="featured">Featured only</option>
            <option value="not_featured">Not featured</option>
            <option value="verified">Verified only</option>
            <option value="not_verified">Not verified</option>
            <option value="claimed">Claimed only</option>
            <option value="not_claimed">Not claimed</option>
            <option value="possible_duplicates">Possible duplicates</option>
          </SelectField>

          <SelectField
            label="Quality"
            value={qualityFilter}
            onChange={(value) => setQualityFilter(value as QualityFilter)}
          >
            <option value="all">All quality</option>
            <option value="incomplete">Incomplete</option>
            <option value="published_incomplete">Published incomplete</option>
            <option value="missing_image">Missing image</option>
            <option value="missing_website">Missing website</option>
            <option value="missing_email">Missing email</option>
            <option value="missing_phone">Missing phone</option>
            <option value="missing_instagram">Missing Instagram</option>
            <option value="missing_contact">No contact info</option>
            <option value="missing_address">Missing address</option>
            <option value="no_specialties">No specialties</option>
            <option value="short_description">Short description</option>
          </SelectField>

          <SelectField
            label="Sort"
            value={sortMode}
            onChange={(value) => setSortMode(value as SortMode)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A-Z</option>
            <option value="city">City A-Z</option>
            <option value="category">Category A-Z</option>
          </SelectField>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#e2d7c8] bg-white shadow-[0_24px_80px_rgba(61,50,38,0.07)]">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-[#eee3d6] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277] sm:px-6">
          <span>Listing</span>
          <span>Actions</span>
        </div>

        {filteredProviders.length > 0 ? (
          <div className="divide-y divide-[#eee3d6]">
            {filteredProviders.map((provider) => (
              <ProviderAdminRow
                key={provider.id}
                provider={provider}
                qualityIssues={getQualityIssues(provider)}
                isPossibleDuplicate={duplicateProviderIds.has(provider.id)}
                updateStatusAction={updateStatusAction}
                updateFeaturedAction={updateFeaturedAction}
                updateVerifiedAction={updateVerifiedAction}
              />
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="font-serif text-3xl text-[#211f1b]">
              No providers found
            </p>

            <p className="mt-3 text-sm leading-6 text-[#655d52]">
              Try clearing filters or searching for something broader.
            </p>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-full bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </section>
    </>
  )
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#e2d7c8] bg-white px-3 text-sm text-[#655d52] outline-none transition focus:border-[#a45f51]"
      >
        {children}
      </select>
    </label>
  )
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div
      className={[
        'rounded-[1.5rem] border p-4',
        highlight
          ? 'border-[#d9c7b6] bg-[#fff2dc]'
          : 'border-[#e2d7c8] bg-white/70',
      ].join(' ')}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
      </p>

      <p className="mt-2 font-serif text-4xl text-[#211f1b]">{value}</p>
    </div>
  )
}

function ProviderAdminRow({
  provider,
  qualityIssues,
  isPossibleDuplicate,
  updateStatusAction,
  updateFeaturedAction,
  updateVerifiedAction,
}: {
  provider: AdminProvider
  qualityIssues: string[]
  isPossibleDuplicate: boolean
  updateStatusAction: (formData: FormData) => void | Promise<void>
  updateFeaturedAction: (formData: FormData) => void | Promise<void>
  updateVerifiedAction: (formData: FormData) => void | Promise<void>
}) {
  const category = getProviderCategoryConfig(provider.category)
  const visibleQualityIssues = qualityIssues.slice(0, 4)
  const hiddenQualityIssuesCount = qualityIssues.length - visibleQualityIssues.length

  return (
    <article className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: category.color }}
          />

          <span className="rounded-full bg-[#f8f3eb] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#655d52]">
            {category.label}
          </span>

          <span
            className={[
              'rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]',
              getStatusClassName(provider.status),
            ].join(' ')}
          >
            {statusLabels[provider.status]}
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

          {isPossibleDuplicate ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f5ded5] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
              <AlertTriangle className="h-3 w-3" strokeWidth={2} />
              Possible duplicate
            </span>
          ) : null}

          {qualityIssues.length > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2dc] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
              <AlertTriangle className="h-3 w-3" strokeWidth={2} />
              Needs review
            </span>
          ) : null}

          {provider.isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2dc] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
              <Star className="h-3 w-3 fill-current" strokeWidth={2} />
              Featured
            </span>
          ) : null}
        </div>

        <h2 className="mt-3 font-serif text-3xl leading-tight text-[#211f1b]">
          {provider.name}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#655d52]">
          {provider.location.city}
          {provider.location.state ? `, ${provider.location.state}` : ''}
          {provider.location.country ? ` · ${provider.location.country}` : ''}
        </p>

        <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[#8a8277]">
          {provider.description}
        </p>

        {qualityIssues.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleQualityIssues.map((issue) => (
              <span
                key={issue}
                className="rounded-full bg-[#f8f3eb] px-2.5 py-1 text-[0.68rem] font-semibold text-[#8a8277]"
              >
                {issue}
              </span>
            ))}

            {hiddenQualityIssuesCount > 0 ? (
              <span className="rounded-full bg-[#f8f3eb] px-2.5 py-1 text-[0.68rem] font-semibold text-[#8a8277]">
                +{hiddenQualityIssuesCount} more
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <form action={updateStatusAction}>
          <input type="hidden" name="id" value={provider.id} />
          <input type="hidden" name="slug" value={provider.slug} />

          <button
            type="submit"
            name="status"
            value={provider.status === 'published' ? 'draft' : 'published'}
            className={[
              'rounded-full px-3 py-2 text-xs font-semibold transition',
              provider.status === 'published'
                ? 'bg-[#fff2dc] text-[#a45f51] hover:bg-[#f5ded5]'
                : 'bg-[#eef0e6] text-[#4f5d3d] hover:bg-[#dde4d2]',
            ].join(' ')}
          >
            {provider.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </form>

        <form action={updateFeaturedAction}>
          <input type="hidden" name="id" value={provider.id} />
          <input type="hidden" name="slug" value={provider.slug} />
          <input
            type="hidden"
            name="is_featured"
            value={String(!provider.isFeatured)}
          />

          <button
            type="submit"
            className={[
              'rounded-full px-3 py-2 text-xs font-semibold transition',
              provider.isFeatured
                ? 'bg-[#fff2dc] text-[#a45f51] hover:bg-[#f5ded5]'
                : 'bg-[#f8f3eb] text-[#655d52] hover:bg-[#fff2dc] hover:text-[#a45f51]',
            ].join(' ')}
          >
            {provider.isFeatured ? 'Unfeature' : 'Feature'}
          </button>
        </form>

        <form action={updateVerifiedAction}>
          <input type="hidden" name="id" value={provider.id} />
          <input type="hidden" name="slug" value={provider.slug} />
          <input
            type="hidden"
            name="is_verified"
            value={String(!provider.isVerified)}
          />

          <button
            type="submit"
            className={[
              'rounded-full px-3 py-2 text-xs font-semibold transition',
              provider.isVerified
                ? 'bg-[#eef0e6] text-[#4f5d3d] hover:bg-[#dde4d2]'
                : 'bg-[#f8f3eb] text-[#655d52] hover:bg-[#eef0e6] hover:text-[#4f5d3d]',
            ].join(' ')}
          >
            {provider.isVerified ? 'Unverify' : 'Verify'}
          </button>
        </form>

        <Link
          href={`/admin/providers/${provider.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3eb] px-3 py-2 text-xs font-semibold text-[#655d52] transition hover:bg-[#eee3d6] hover:text-[#211f1b]"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
          Edit
        </Link>

        {provider.status === 'published' ? (
          <Link
            href={`/providers/${provider.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#4f5d3d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#414d31]"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
            View
          </Link>
        ) : null}
      </div>
    </article>
  )
}