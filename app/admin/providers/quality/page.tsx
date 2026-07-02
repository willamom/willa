import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Eye,
  ImageIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Star,
  Tags,
  Text,
  Globe,
} from 'lucide-react'

import { getProviderCategoryConfig } from '@/data/providers/categories'
import {
  getAdminProviders,
  updateProviderStatusAction,
  type AdminProvider,
} from '@/lib/admin/providers'

export const metadata = {
  title: 'Provider Quality | Willa Admin',
}

type QualityIssueType =
  | 'missing_image'
  | 'missing_website'
  | 'missing_email'
  | 'missing_phone'
  | 'missing_instagram'
  | 'missing_address'
  | 'no_specialties'
  | 'short_description'
  | 'published_incomplete'

type QualityIssue = {
  type: QualityIssueType
  label: string
  description: string
  icon: 'image' | 'website' | 'email' | 'phone' | 'location' | 'tags' | 'text' | 'warning'
}

type QualityGroup = {
  type: QualityIssueType
  label: string
  description: string
  providers: AdminProvider[]
}

const qualityIssueMeta: Record<QualityIssueType, Omit<QualityIssue, 'type'>> = {
  published_incomplete: {
    label: 'Published incomplete',
    description: 'Published listings that still need important details.',
    icon: 'warning',
  },
  missing_image: {
    label: 'Missing image',
    description: 'Listings without a profile image or visual.',
    icon: 'image',
  },
  missing_website: {
    label: 'Missing website',
    description: 'Listings without a website link.',
    icon: 'website',
  },
  missing_email: {
    label: 'Missing email',
    description: 'Listings without an email address.',
    icon: 'email',
  },
  missing_phone: {
    label: 'Missing phone',
    description: 'Listings without a phone number.',
    icon: 'phone',
  },
  missing_instagram: {
    label: 'Missing Instagram',
    description: 'Listings without an Instagram handle.',
    icon: 'website',
  },
  missing_address: {
    label: 'Missing address',
    description: 'Listings without a full address.',
    icon: 'location',
  },
  no_specialties: {
    label: 'No specialties',
    description: 'Listings without specialties or service tags.',
    icon: 'tags',
  },
  short_description: {
    label: 'Short description',
    description: 'Listings with a very short description.',
    icon: 'text',
  },
}

async function moveProviderToDraftFromQualityAction(formData: FormData) {
  'use server'

  await updateProviderStatusAction(formData)

  revalidatePath('/admin')
  revalidatePath('/admin/providers')
  revalidatePath('/admin/providers/quality')
  revalidatePath('/providers')
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
  const issues: QualityIssue[] = []

  if (provider.status === 'published' && isIncompleteProvider(provider)) {
    issues.push({
      type: 'published_incomplete',
      ...qualityIssueMeta.published_incomplete,
    })
  }

  if (!hasText(provider.image)) {
    issues.push({
      type: 'missing_image',
      ...qualityIssueMeta.missing_image,
    })
  }

  if (!hasText(provider.website)) {
    issues.push({
      type: 'missing_website',
      ...qualityIssueMeta.missing_website,
    })
  }

  if (!hasText(provider.email)) {
    issues.push({
      type: 'missing_email',
      ...qualityIssueMeta.missing_email,
    })
  }

  if (!hasText(provider.phone)) {
    issues.push({
      type: 'missing_phone',
      ...qualityIssueMeta.missing_phone,
    })
  }

  if (!hasText(provider.instagram)) {
    issues.push({
      type: 'missing_instagram',
      ...qualityIssueMeta.missing_instagram,
    })
  }

  if (!hasText(provider.location.address)) {
    issues.push({
      type: 'missing_address',
      ...qualityIssueMeta.missing_address,
    })
  }

  if (provider.specialties.length === 0) {
    issues.push({
      type: 'no_specialties',
      ...qualityIssueMeta.no_specialties,
    })
  }

  if (provider.description.trim().length < 80) {
    issues.push({
      type: 'short_description',
      ...qualityIssueMeta.short_description,
    })
  }

  return issues
}

function isIncompleteProvider(provider: AdminProvider) {
  return (
    !hasText(provider.image) ||
    !hasText(provider.website) ||
    !hasText(provider.email) ||
    !hasText(provider.phone) ||
    !hasText(provider.instagram) ||
    !hasText(provider.location.address) ||
    provider.specialties.length === 0 ||
    provider.description.trim().length < 80 ||
    !hasContact(provider)
  )
}

function buildQualityGroups(providers: AdminProvider[]) {
  const activeProviders = providers.filter(
    (provider) => provider.status !== 'archived'
  )

  const groupOrder: QualityIssueType[] = [
    'published_incomplete',
    'missing_image',
    'missing_website',
    'missing_email',
    'missing_phone',
    'missing_instagram',
    'missing_address',
    'no_specialties',
    'short_description',
  ]

  return groupOrder
    .map((type) => {
      const meta = qualityIssueMeta[type]

      return {
        type,
        label: meta.label,
        description: meta.description,
        providers: activeProviders.filter((provider) =>
          getQualityIssues(provider).some((issue) => issue.type === type)
        ),
      }
    })
    .filter((group) => group.providers.length > 0)
}

function getAffectedProviderCount(groups: QualityGroup[]) {
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

function getIssueIcon(icon: QualityIssue['icon']) {
  switch (icon) {
    case 'image':
      return <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'website':
      return <Globe className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'email':
      return <Mail className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'phone':
      return <Phone className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'location':
      return <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'tags':
      return <Tags className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'text':
      return <Text className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'warning':
    default:
      return <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.8} />
  }
}

export default async function ProviderQualityPage() {
  const providers = await getAdminProviders()
  const activeProviders = providers.filter(
    (provider) => provider.status !== 'archived'
  )
  const qualityGroups = buildQualityGroups(providers)
  const affectedProviderCount = getAffectedProviderCount(qualityGroups)
  const publishedIncompleteCount =
    qualityGroups.find((group) => group.type === 'published_incomplete')
      ?.providers.length ?? 0

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
              Quality review
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
              Review active listings with missing details before they go live or
              before they stay published. This is the polish desk, not the panic
              drawer.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Quality groups" value={qualityGroups.length} />
          <StatCard label="Affected providers" value={affectedProviderCount} />
          <StatCard label="Published gaps" value={publishedIncompleteCount} />
          <StatCard label="Active scanned" value={activeProviders.length} />
        </div>

        {qualityGroups.length === 0 ? (
          <section className="mt-8 rounded-[2rem] border border-[#e2d7c8] bg-white p-8 text-center shadow-[0_24px_80px_rgba(61,50,38,0.07)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef0e6] text-[#4f5d3d]">
              <BadgeCheck className="h-7 w-7" strokeWidth={1.8} />
            </div>

            <h2 className="mt-5 font-serif text-4xl text-[#211f1b]">
              No quality issues found
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#655d52]">
              Active provider listings have the key details Willa expects.
            </p>
          </section>
        ) : (
          <section className="mt-8 space-y-5">
            {qualityGroups.map((group) => (
              <QualityGroupCard key={group.type} group={group} />
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

function QualityGroupCard({ group }: { group: QualityGroup }) {
  const icon = qualityIssueMeta[group.type].icon

  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#e2d7c8] bg-white shadow-[0_24px_80px_rgba(61,50,38,0.07)]">
      <div className="border-b border-[#eee3d6] bg-[#f8f3eb] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2dc] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
                {getIssueIcon(icon)}
                {group.label}
              </span>

              <span className="rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#655d52]">
                {group.providers.length}{' '}
                {group.providers.length === 1 ? 'listing' : 'listings'}
              </span>
            </div>

            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#211f1b]">
              {group.label}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#655d52]">
              {group.description}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#eee3d6]">
        {group.providers.map((provider) => (
          <QualityProviderRow
            key={provider.id}
            provider={provider}
            issues={getQualityIssues(provider)}
          />
        ))}
      </div>
    </article>
  )
}

function QualityProviderRow({
  provider,
  issues,
}: {
  provider: AdminProvider
  issues: QualityIssue[]
}) {
  const category = getProviderCategoryConfig(provider.category)
  const visibleIssues = issues.slice(0, 5)
  const hiddenIssuesCount = issues.length - visibleIssues.length

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

        <div className="mt-3 flex flex-wrap gap-2">
          {visibleIssues.map((issue) => (
            <span
              key={issue.type}
              className="inline-flex items-center gap-1 rounded-full bg-[#f8f3eb] px-2.5 py-1 text-[0.68rem] font-semibold text-[#8a8277]"
            >
              {getIssueIcon(issue.icon)}
              {issue.label}
            </span>
          ))}

          {hiddenIssuesCount > 0 ? (
            <span className="rounded-full bg-[#f8f3eb] px-2.5 py-1 text-[0.68rem] font-semibold text-[#8a8277]">
              +{hiddenIssuesCount} more
            </span>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-[#8a8277]">
          {provider.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {provider.status === 'published' && issues.length > 0 ? (
          <form action={moveProviderToDraftFromQualityAction}>
            <input type="hidden" name="id" value={provider.id} />
            <input type="hidden" name="slug" value={provider.slug} />
            <input type="hidden" name="status" value="draft" />

            <button
              type="submit"
              className="rounded-full bg-[#fff2dc] px-3 py-2 text-xs font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b]"
            >
              Move to draft
            </button>
          </form>
        ) : null}

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
    </div>
  )
}