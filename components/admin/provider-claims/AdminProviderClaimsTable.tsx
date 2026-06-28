'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  Search,
  ShieldQuestion,
  X,
  XCircle,
} from 'lucide-react'

import type {
  AdminProviderClaim,
  ProviderClaimStatus,
} from '@/lib/admin/provider-claims'

type StatusFilter = ProviderClaimStatus | 'all'

type SortMode =
  | 'newest'
  | 'oldest'
  | 'provider'
  | 'claimant'

type AdminProviderClaimsTableProps = {
  claims: AdminProviderClaim[]
  updateStatusAction: (formData: FormData) => void | Promise<void>
}

const statusLabels: Record<ProviderClaimStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  approved: 'Approved',
  rejected: 'Rejected',
}

function getStatusClassName(status: ProviderClaimStatus) {
  switch (status) {
    case 'approved':
      return 'bg-[#eef0e6] text-[#4f5d3d]'
    case 'reviewing':
      return 'bg-[#fff2dc] text-[#a45f51]'
    case 'rejected':
      return 'bg-[#f5ded5] text-[#a45f51]'
    case 'new':
    default:
      return 'bg-[#f8f3eb] text-[#655d52]'
  }
}

function getStatusIcon(status: ProviderClaimStatus) {
  switch (status) {
    case 'approved':
      return <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'reviewing':
      return <Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'rejected':
      return <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'new':
    default:
      return <ShieldQuestion className="h-3.5 w-3.5" strokeWidth={1.8} />
  }
}

function getCountByStatus(
  claims: AdminProviderClaim[],
  status: ProviderClaimStatus
) {
  return claims.filter((claim) => claim.status === status).length
}

function getTimestamp(value: string) {
  const timestamp = Date.parse(value)

  return Number.isFinite(timestamp) ? timestamp : 0
}

function getReadableDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getInstagramUrl(instagram: string) {
  if (instagram.startsWith('http')) {
    return instagram
  }

  return `https://instagram.com/${instagram.replace('@', '')}`
}

function getSearchableText(claim: AdminProviderClaim) {
  return [
    claim.providerName,
    claim.providerSlug,
    claim.claimantName,
    claim.claimantEmail,
    claim.businessName,
    claim.website,
    claim.instagram,
    claim.message,
    claim.status,
    claim.source,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export default function AdminProviderClaimsTable({
  claims,
  updateStatusAction,
}: AdminProviderClaimsTableProps) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  const newCount = getCountByStatus(claims, 'new')
  const reviewingCount = getCountByStatus(claims, 'reviewing')
  const approvedCount = getCountByStatus(claims, 'approved')
  const rejectedCount = getCountByStatus(claims, 'rejected')

  const filteredClaims = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()

    const filtered = claims.filter((claim) => {
      if (statusFilter !== 'all' && claim.status !== statusFilter) {
        return false
      }

      if (cleanQuery && !getSearchableText(claim).includes(cleanQuery)) {
        return false
      }

      return true
    })

    return [...filtered].sort((a, b) => {
      if (sortMode === 'provider') {
        return a.providerName.localeCompare(b.providerName)
      }

      if (sortMode === 'claimant') {
        return a.claimantName.localeCompare(b.claimantName)
      }

      if (sortMode === 'oldest') {
        return getTimestamp(a.createdAt) - getTimestamp(b.createdAt)
      }

      return getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
    })
  }, [claims, query, statusFilter, sortMode])

  const hasActiveFilters =
    query.trim().length > 0 ||
    statusFilter !== 'all' ||
    sortMode !== 'newest'

  function resetFilters() {
    setQuery('')
    setStatusFilter('all')
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
            Provider claims
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
            Review profile claim requests from providers, owners, and authorized
            representatives.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New" value={newCount} />
        <StatCard label="Reviewing" value={reviewingCount} />
        <StatCard label="Approved" value={approvedCount} />
        <StatCard label="Rejected" value={rejectedCount} />
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
              placeholder="Search provider, claimant, email, website..."
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
              {filteredClaims.length}
            </span>

            <span className="text-[#655d52]">
              {filteredClaims.length === 1 ? 'claim' : 'claims'}
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

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </SelectField>

          <SelectField
            label="Sort"
            value={sortMode}
            onChange={(value) => setSortMode(value as SortMode)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="provider">Provider A-Z</option>
            <option value="claimant">Claimant A-Z</option>
          </SelectField>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#e2d7c8] bg-white shadow-[0_24px_80px_rgba(61,50,38,0.07)]">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-[#eee3d6] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277] sm:px-6">
          <span>Claim request</span>
          <span>Status</span>
        </div>

        {filteredClaims.length > 0 ? (
          <div className="divide-y divide-[#eee3d6]">
            {filteredClaims.map((claim) => (
              <ClaimRow
                key={claim.id}
                claim={claim}
                updateStatusAction={updateStatusAction}
              />
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="font-serif text-3xl text-[#211f1b]">
              No claims found
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

function ClaimRow({
  claim,
  updateStatusAction,
}: {
  claim: AdminProviderClaim
  updateStatusAction: (formData: FormData) => void | Promise<void>
}) {
  return (
    <article className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]',
              getStatusClassName(claim.status),
            ].join(' ')}
          >
            {getStatusIcon(claim.status)}
            {statusLabels[claim.status]}
          </span>

          {claim.confirmOwner ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef0e6] px-2.5 py-1 text-[0.68rem] font-semibold text-[#4f5d3d]">
              <BadgeCheck className="h-3 w-3" strokeWidth={2} />
              Confirmed
            </span>
          ) : null}

          <span className="text-xs text-[#8a8277]">
            {getReadableDate(claim.createdAt)}
          </span>
        </div>

        <h2 className="mt-3 font-serif text-3xl leading-tight text-[#211f1b]">
          {claim.providerName}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#655d52]">
          Claimed by{' '}
          <span className="font-semibold text-[#211f1b]">
            {claim.claimantName}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a
            href={`mailto:${claim.claimantEmail}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3eb] px-3 py-2 font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
          >
            <Mail className="h-3.5 w-3.5" strokeWidth={1.8} />
            {claim.claimantEmail}
          </a>

          {claim.providerSlug ? (
            <Link
              href={`/providers/${claim.providerSlug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3eb] px-3 py-2 font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              Provider profile
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
            </Link>
          ) : null}

          {claim.website ? (
            <a
              href={claim.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3eb] px-3 py-2 font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              Website
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>
          ) : null}

          {claim.instagram ? (
            <a
              href={getInstagramUrl(claim.instagram)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3eb] px-3 py-2 font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              Instagram
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>
          ) : null}
        </div>

        {claim.businessName ? (
          <p className="mt-4 text-sm leading-6 text-[#655d52]">
            <span className="font-semibold text-[#211f1b]">
              Business name:
            </span>{' '}
            {claim.businessName}
          </p>
        ) : null}

        {claim.message ? (
          <div className="mt-4 rounded-[1.25rem] bg-[#f8f3eb] p-4 text-sm leading-6 text-[#655d52]">
            {claim.message}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 lg:max-w-[13rem] lg:justify-end">
        <ClaimStatusButton
          claim={claim}
          status="reviewing"
          label="Reviewing"
          updateStatusAction={updateStatusAction}
        />

        <ClaimStatusButton
          claim={claim}
          status="approved"
          label="Approve"
          updateStatusAction={updateStatusAction}
        />

        <ClaimStatusButton
          claim={claim}
          status="rejected"
          label="Reject"
          updateStatusAction={updateStatusAction}
        />

        <ClaimStatusButton
          claim={claim}
          status="new"
          label="Mark new"
          updateStatusAction={updateStatusAction}
        />
      </div>
    </article>
  )
}

function ClaimStatusButton({
  claim,
  status,
  label,
  updateStatusAction,
}: {
  claim: AdminProviderClaim
  status: ProviderClaimStatus
  label: string
  updateStatusAction: (formData: FormData) => void | Promise<void>
}) {
  const isActive = claim.status === status

  return (
    <form action={updateStatusAction}>
      <input type="hidden" name="id" value={claim.id} />
      <input type="hidden" name="status" value={status} />

      <button
        type="submit"
        disabled={isActive}
        className={[
          'rounded-full px-3 py-2 text-xs font-semibold transition disabled:cursor-default disabled:opacity-55',
          isActive
            ? 'bg-[#eee3d6] text-[#8a8277]'
            : status === 'approved'
              ? 'bg-[#eef0e6] text-[#4f5d3d] hover:bg-[#dde4d2]'
              : status === 'rejected'
                ? 'bg-[#f5ded5] text-[#a45f51] hover:bg-[#eed0c6]'
                : 'bg-[#f8f3eb] text-[#655d52] hover:bg-[#eee3d6] hover:text-[#211f1b]',
        ].join(' ')}
      >
        {label}
      </button>
    </form>
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
  children: React.ReactNode
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