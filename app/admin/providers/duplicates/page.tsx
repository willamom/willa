import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
  Eye,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react'

import { getProviderCategoryConfig } from '@/data/providers/categories'
import {
  getAdminProviders,
  updateProviderStatusAction,
  type AdminProvider,
} from '@/lib/admin/providers'

export const metadata = {
  title: 'Duplicate Providers | Willa Admin',
}

type DuplicateReason =
  | 'Name + location'
  | 'Website'
  | 'Email'
  | 'Instagram'
  | 'Phone'

type DuplicateGroup = {
  id: string
  reason: DuplicateReason
  displayValue: string
  providers: AdminProvider[]
}

async function archiveProviderFromDuplicatesAction(formData: FormData) {
  'use server'

  await updateProviderStatusAction(formData)

  revalidatePath('/admin')
  revalidatePath('/admin/providers')
  revalidatePath('/admin/providers/duplicates')
  revalidatePath('/providers')
}

function hasText(value?: string) {
  return String(value ?? '').trim().length > 0
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

function getWebsiteUrl(website?: string) {
  if (!website) return null

  return website.startsWith('http') ? website : `https://${website}`
}

function addProviderToMap(
  map: Map<string, AdminProvider[]>,
  key: string,
  provider: AdminProvider
) {
  if (!key || key.length < 3) return

  const existing = map.get(key) ?? []

  map.set(key, [...existing, provider])
}

function buildDuplicateGroups(providers: AdminProvider[]) {
  const groups: DuplicateGroup[] = []

  const activeProviders = providers.filter(
    (provider) => provider.status !== 'archived'
  )

  const nameLocationMap = new Map<string, AdminProvider[]>()
  const websiteMap = new Map<string, AdminProvider[]>()
  const emailMap = new Map<string, AdminProvider[]>()
  const instagramMap = new Map<string, AdminProvider[]>()
  const phoneMap = new Map<string, AdminProvider[]>()

  activeProviders.forEach((provider) => {
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
      addProviderToMap(nameLocationMap, nameLocationKey, provider)
    }

    if (hasText(provider.website)) {
      addProviderToMap(
        websiteMap,
        normalizeDuplicateText(provider.website),
        provider
      )
    }

    if (hasText(provider.email)) {
      addProviderToMap(
        emailMap,
        normalizeDuplicateText(provider.email),
        provider
      )
    }

    if (hasText(provider.instagram)) {
      addProviderToMap(
        instagramMap,
        normalizeInstagram(provider.instagram),
        provider
      )
    }

    const phone = normalizePhone(provider.phone)

    if (phone.length >= 7) {
      addProviderToMap(phoneMap, phone, provider)
    }
  })

  addGroupsFromMap(groups, nameLocationMap, 'Name + location')
  addGroupsFromMap(groups, websiteMap, 'Website')
  addGroupsFromMap(groups, emailMap, 'Email')
  addGroupsFromMap(groups, instagramMap, 'Instagram')
  addGroupsFromMap(groups, phoneMap, 'Phone')

  return groups.sort((a, b) => {
    if (b.providers.length !== a.providers.length) {
      return b.providers.length - a.providers.length
    }

    return a.reason.localeCompare(b.reason)
  })
}

function addGroupsFromMap(
  groups: DuplicateGroup[],
  map: Map<string, AdminProvider[]>,
  reason: DuplicateReason
) {
  map.forEach((providers, key) => {
    if (providers.length <= 1) return

    groups.push({
      id: `${reason}:${key}`,
      reason,
      displayValue: getDisplayValue(reason, key, providers),
      providers: sortDuplicateProviders(providers),
    })
  })
}

function sortDuplicateProviders(providers: AdminProvider[]) {
  return [...providers].sort((a, b) => {
    const scoreA = getProviderPriorityScore(a)
    const scoreB = getProviderPriorityScore(b)

    if (scoreA !== scoreB) {
      return scoreB - scoreA
    }

    return a.name.localeCompare(b.name)
  })
}

function getProviderPriorityScore(provider: AdminProvider) {
  let score = 0

  if (provider.status === 'published') score += 10
  if (provider.isClaimed) score += 8
  if (provider.isVerified) score += 6
  if (provider.isFeatured) score += 4
  if (hasText(provider.image)) score += 2
  if (hasText(provider.website)) score += 2
  if (hasText(provider.email)) score += 2
  if (provider.specialties.length > 0) score += 1

  return score
}

function getDisplayValue(
  reason: DuplicateReason,
  key: string,
  providers: AdminProvider[]
) {
  if (reason === 'Name + location') {
    const firstProvider = providers[0]

    return [
      firstProvider.name,
      firstProvider.location.city,
      firstProvider.location.state,
    ]
      .filter(Boolean)
      .join(' · ')
  }

  if (reason === 'Phone') {
    return providers.find((provider) => hasText(provider.phone))?.phone ?? key
  }

  if (reason === 'Instagram') {
    return (
      providers.find((provider) => hasText(provider.instagram))?.instagram ??
      key
    )
  }

  if (reason === 'Website') {
    return (
      providers.find((provider) => hasText(provider.website))?.website ?? key
    )
  }

  if (reason === 'Email') {
    return providers.find((provider) => hasText(provider.email))?.email ?? key
  }

  return key
}

function getAffectedProviderCount(groups: DuplicateGroup[]) {
  const ids = new Set<string>()

  groups.forEach((group) => {
    group.providers.forEach((provider) => {
      ids.add(provider.id)
    })
  })

  return ids.size
}

function getStatusLabel(status: AdminProvider['status']) {
  switch (status) {
    case 'published':
      return 'Published'
    case 'archived':
      return 'Archived'
    case 'draft':
    default:
      return 'Draft'
  }
}

function getStatusClassName(status: AdminProvider['status']) {
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

export default async function DuplicateProvidersPage() {
  const providers = await getAdminProviders()
  const activeProviders = providers.filter(
    (provider) => provider.status !== 'archived'
  )
  const archivedProviders = providers.length - activeProviders.length
  const duplicateGroups = buildDuplicateGroups(providers)
  const affectedProviderCount = getAffectedProviderCount(duplicateGroups)

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/providers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Back to providers
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
              Provider quality
            </p>

            <h1 className="mt-3 font-serif text-5xl leading-tight tracking-tight">
              Possible duplicates
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
              Review active provider listings that may refer to the same
              business or professional. Archiving removes a duplicate from the
              public directory without deleting it.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Duplicate groups" value={duplicateGroups.length} />
          <StatCard label="Affected providers" value={affectedProviderCount} />
          <StatCard label="Active scanned" value={activeProviders.length} />
          <StatCard label="Already archived" value={archivedProviders} />
        </div>

        {duplicateGroups.length === 0 ? (
          <section className="mt-8 rounded-[2rem] border border-[#e2d7c8] bg-white p-8 text-center shadow-[0_24px_80px_rgba(61,50,38,0.07)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef0e6] text-[#4f5d3d]">
              <BadgeCheck className="h-7 w-7" strokeWidth={1.8} />
            </div>

            <h2 className="mt-5 font-serif text-4xl text-[#211f1b]">
              No active duplicates found
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#655d52]">
              The scanner did not find matching active names, websites, emails,
              Instagram handles, or phone numbers.
            </p>
          </section>
        ) : (
          <section className="mt-8 space-y-5">
            {duplicateGroups.map((group) => (
              <DuplicateGroupCard key={group.id} group={group} />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#e2d7c8] bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
      </p>

      <p className="mt-2 font-serif text-4xl text-[#211f1b]">{value}</p>
    </div>
  )
}

function DuplicateGroupCard({ group }: { group: DuplicateGroup }) {
  const suggestedKeepProvider = group.providers[0]

  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#e2d7c8] bg-white shadow-[0_24px_80px_rgba(61,50,38,0.07)]">
      <div className="border-b border-[#eee3d6] bg-[#f8f3eb] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f5ded5] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
                <AlertTriangle className="h-3 w-3" strokeWidth={2} />
                {group.reason}
              </span>

              <span className="rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#655d52]">
                {group.providers.length} active listings
              </span>
            </div>

            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#211f1b]">
              {group.displayValue}
            </h2>
          </div>

          <div className="rounded-[1.25rem] bg-white px-4 py-3 text-sm leading-6 text-[#655d52]">
            <span className="font-semibold text-[#211f1b]">
              Suggested keep:
            </span>{' '}
            {suggestedKeepProvider.name}
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#eee3d6]">
        {group.providers.map((provider) => (
          <DuplicateProviderRow
            key={provider.id}
            provider={provider}
            isSuggestedKeep={provider.id === suggestedKeepProvider.id}
          />
        ))}
      </div>
    </article>
  )
}

function DuplicateProviderRow({
  provider,
  isSuggestedKeep,
}: {
  provider: AdminProvider
  isSuggestedKeep: boolean
}) {
  const category = getProviderCategoryConfig(provider.category)
  const websiteUrl = getWebsiteUrl(provider.website)

  return (
    <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
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
            {getStatusLabel(provider.status)}
          </span>

          {isSuggestedKeep ? (
            <span className="rounded-full bg-[#eef0e6] px-2.5 py-1 text-[0.68rem] font-semibold text-[#4f5d3d]">
              Suggested keep
            </span>
          ) : null}

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

        <h3 className="mt-3 font-serif text-3xl leading-tight text-[#211f1b]">
          {provider.name}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#655d52]">
          {provider.location.city}
          {provider.location.state ? `, ${provider.location.state}` : ''}
          {provider.location.country ? ` · ${provider.location.country}` : ''}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#655d52]">
          {provider.email ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f8f3eb] px-2.5 py-1 font-semibold">
              <Mail className="h-3 w-3" strokeWidth={1.8} />
              {provider.email}
            </span>
          ) : null}

          {provider.phone ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f8f3eb] px-2.5 py-1 font-semibold">
              <Phone className="h-3 w-3" strokeWidth={1.8} />
              {provider.phone}
            </span>
          ) : null}

          {provider.website ? (
            <span className="rounded-full bg-[#f8f3eb] px-2.5 py-1 font-semibold">
              {provider.website}
            </span>
          ) : null}

          {provider.instagram ? (
            <span className="rounded-full bg-[#f8f3eb] px-2.5 py-1 font-semibold">
              {provider.instagram}
            </span>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-[#8a8277]">
          {provider.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {!isSuggestedKeep ? (
          <form action={archiveProviderFromDuplicatesAction}>
            <input type="hidden" name="id" value={provider.id} />
            <input type="hidden" name="slug" value={provider.slug} />
            <input type="hidden" name="status" value="archived" />

            <button
              type="submit"
              className="rounded-full bg-[#f5ded5] px-3 py-2 text-xs font-semibold text-[#a45f51] transition hover:bg-[#eed0c6] hover:text-[#211f1b]"
            >
              Archive duplicate
            </button>
          </form>
        ) : (
          <span className="rounded-full bg-[#eef0e6] px-3 py-2 text-xs font-semibold text-[#4f5d3d]">
            Keep active
          </span>
        )}

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

        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2dc] px-3 py-2 text-xs font-semibold text-[#a45f51] transition hover:bg-[#f5ded5]"
          >
            Website
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
          </a>
        ) : null}
      </div>
    </div>
  )
}