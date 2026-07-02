'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Archive,
  BadgeCheck,
  Clock,
  ExternalLink,
  Eye,
  Mail,
  Search,
  Send,
  X,
} from 'lucide-react'

import type {
  AdminProviderInquiry,
  ProviderInquiryStatus,
} from '@/lib/admin/provider-inquiries'

type StatusFilter = ProviderInquiryStatus | 'all'

type SortMode =
  | 'newest'
  | 'oldest'
  | 'provider'
  | 'sender'
  | 'status'

type AdminProviderInquiriesTableProps = {
  inquiries: AdminProviderInquiry[]
  updateStatusAction: (formData: FormData) => void | Promise<void>
}

const statusLabels: Record<ProviderInquiryStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  sent: 'Sent',
  failed: 'Failed',
  archived: 'Archived',
}

function getStatusClassName(status: ProviderInquiryStatus) {
  switch (status) {
    case 'sent':
      return 'bg-[#eef0e6] text-[#4f5d3d]'
    case 'reviewing':
      return 'bg-[#fff2dc] text-[#a45f51]'
    case 'failed':
      return 'bg-[#f5ded5] text-[#a45f51]'
    case 'archived':
      return 'bg-[#eee3d6] text-[#8a8277]'
    case 'new':
    default:
      return 'bg-white text-[#4f5d3d]'
  }
}

function getStatusIcon(status: ProviderInquiryStatus) {
  switch (status) {
    case 'sent':
      return <Send className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'reviewing':
      return <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'failed':
      return <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'archived':
      return <Archive className="h-3.5 w-3.5" strokeWidth={1.8} />
    case 'new':
    default:
      return <Mail className="h-3.5 w-3.5" strokeWidth={1.8} />
  }
}

function getCountByStatus(
  inquiries: AdminProviderInquiry[],
  status: ProviderInquiryStatus
) {
  return inquiries.filter((inquiry) => inquiry.status === status).length
}

function getInquiryTimestamp(value?: string) {
  if (!value) return 0

  const timestamp = Date.parse(value)

  return Number.isFinite(timestamp) ? timestamp : 0
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Unknown date'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function getSearchableText(inquiry: AdminProviderInquiry) {
  return [
    inquiry.providerName,
    inquiry.providerEmail,
    inquiry.providerSlug,
    inquiry.senderName,
    inquiry.senderEmail,
    inquiry.senderStage,
    inquiry.message,
    inquiry.source,
    inquiry.status,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export default function AdminProviderInquiriesTable({
  inquiries,
  updateStatusAction,
}: AdminProviderInquiriesTableProps) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  const newCount = getCountByStatus(inquiries, 'new')
  const reviewingCount = getCountByStatus(inquiries, 'reviewing')
  const sentCount = getCountByStatus(inquiries, 'sent')
  const failedCount = getCountByStatus(inquiries, 'failed')
  const archivedCount = getCountByStatus(inquiries, 'archived')

  const filteredInquiries = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()

    const filtered = inquiries.filter((inquiry) => {
      if (statusFilter !== 'all' && inquiry.status !== statusFilter) {
        return false
      }

      if (cleanQuery && !getSearchableText(inquiry).includes(cleanQuery)) {
        return false
      }

      return true
    })

    return [...filtered].sort((a, b) => {
      if (sortMode === 'provider') {
        return a.providerName.localeCompare(b.providerName)
      }

      if (sortMode === 'sender') {
        return a.senderName.localeCompare(b.senderName)
      }

      if (sortMode === 'status') {
        return a.status.localeCompare(b.status)
      }

      if (sortMode === 'oldest') {
        return (
          getInquiryTimestamp(a.createdAt) -
          getInquiryTimestamp(b.createdAt)
        )
      }

      return (
        getInquiryTimestamp(b.createdAt) -
        getInquiryTimestamp(a.createdAt)
      )
    })
  }, [inquiries, query, statusFilter, sortMode])

  const hasActiveFilters =
    query.trim().length > 0 ||
    statusFilter !== 'all' ||
    sortMode !== 'newest'

  function resetFilters() {
    setQuery('')
    setStatusFilter('all')
    setSortMode('newest')
  }

  function applyStatusFilter(nextStatus: StatusFilter) {
    setQuery('')
    setStatusFilter(nextStatus)
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
            Provider inquiries
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
            Review messages sent through Willa provider profiles.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="New"
          value={newCount}
          active={statusFilter === 'new'}
          highlight={newCount > 0}
          onClick={() => applyStatusFilter('new')}
        />

        <StatCard
          label="Reviewing"
          value={reviewingCount}
          active={statusFilter === 'reviewing'}
          highlight={reviewingCount > 0}
          onClick={() => applyStatusFilter('reviewing')}
        />

        <StatCard
          label="Sent"
          value={sentCount}
          active={statusFilter === 'sent'}
          onClick={() => applyStatusFilter('sent')}
        />

        <StatCard
          label="Failed"
          value={failedCount}
          active={statusFilter === 'failed'}
          highlight={failedCount > 0}
          onClick={() => applyStatusFilter('failed')}
        />

        <StatCard
          label="Archived"
          value={archivedCount}
          active={statusFilter === 'archived'}
          onClick={() => applyStatusFilter('archived')}
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
              placeholder="Search provider, sender, email, message..."
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
              {filteredInquiries.length}
            </span>

            <span className="text-[#655d52]">
              {filteredInquiries.length === 1 ? 'result' : 'results'}
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
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="archived">Archived</option>
          </SelectField>

          <SelectField
            label="Sort"
            value={sortMode}
            onChange={(value) => setSortMode(value as SortMode)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="provider">Provider A-Z</option>
            <option value="sender">Sender A-Z</option>
            <option value="status">Status A-Z</option>
          </SelectField>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#e2d7c8] bg-white shadow-[0_24px_80px_rgba(61,50,38,0.07)]">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-[#eee3d6] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277] sm:px-6">
          <span>Inquiry</span>
          <span>Actions</span>
        </div>

        {filteredInquiries.length > 0 ? (
          <div className="divide-y divide-[#eee3d6]">
            {filteredInquiries.map((inquiry) => (
              <ProviderInquiryRow
                key={inquiry.id}
                inquiry={inquiry}
                updateStatusAction={updateStatusAction}
              />
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="font-serif text-3xl text-[#211f1b]">
              No inquiries found
            </p>

            <p className="mt-3 text-sm leading-6 text-[#655d52]">
              Messages sent through provider profiles will appear here.
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
  active = false,
  onClick,
}: {
  label: string
  value: number
  highlight?: boolean
  active?: boolean
  onClick?: () => void
}) {
  const className = [
    'block w-full rounded-[1.5rem] border p-4 text-left transition',
    onClick ? 'cursor-pointer hover:-translate-y-0.5' : '',
    active
      ? 'border-[#4f5d3d] bg-[#eef0e6] shadow-[0_18px_55px_rgba(61,50,38,0.08)]'
      : highlight
        ? 'border-[#d9c7b6] bg-[#fff2dc] hover:bg-[#f9ead0]'
        : 'border-[#e2d7c8] bg-white/70 hover:bg-white',
  ].join(' ')

  return (
    <button type="button" onClick={onClick} className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
      </p>

      <p className="mt-2 font-serif text-4xl text-[#211f1b]">{value}</p>
    </button>
  )
}

function ProviderInquiryRow({
  inquiry,
  updateStatusAction,
}: {
  inquiry: AdminProviderInquiry
  updateStatusAction: (formData: FormData) => void | Promise<void>
}) {
  return (
    <article className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold',
              getStatusClassName(inquiry.status),
            ].join(' ')}
          >
            {getStatusIcon(inquiry.status)}
            {statusLabels[inquiry.status]}
          </span>

          <span className="rounded-full bg-[#f8f3eb] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#655d52]">
            {formatDate(inquiry.createdAt)}
          </span>

          {inquiry.providerEmail ? (
            <span className="rounded-full bg-[#eef0e6] px-2.5 py-1 text-[0.68rem] font-semibold text-[#4f5d3d]">
              Provider email
            </span>
          ) : (
            <span className="rounded-full bg-[#f5ded5] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
              Missing provider email
            </span>
          )}

          {inquiry.consentToShare ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef0e6] px-2.5 py-1 text-[0.68rem] font-semibold text-[#4f5d3d]">
              <BadgeCheck className="h-3 w-3" strokeWidth={2} />
              Consent
            </span>
          ) : null}
        </div>

        <h2 className="mt-3 font-serif text-3xl leading-tight text-[#211f1b]">
          {inquiry.providerName}
        </h2>

        <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#655d52]">
          <span>
            From: <strong>{inquiry.senderName}</strong>
          </span>

          <a
            href={`mailto:${inquiry.senderEmail}`}
            className="font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
          >
            {inquiry.senderEmail}
          </a>

          {inquiry.senderStage ? <span>· {inquiry.senderStage}</span> : null}
        </div>

        <p className="mt-3 whitespace-pre-wrap rounded-[1.25rem] bg-[#f8f3eb] px-4 py-3 text-sm leading-6 text-[#655d52]">
          {inquiry.message}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#8a8277]">
          {inquiry.providerEmail ? (
            <span className="rounded-full bg-white px-2.5 py-1 font-semibold">
              To: {inquiry.providerEmail}
            </span>
          ) : null}

          <span className="rounded-full bg-white px-2.5 py-1 font-semibold">
            Source: {inquiry.source}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {inquiry.status !== 'reviewing' ? (
          <StatusButton
            inquiryId={inquiry.id}
            status="reviewing"
            label="Reviewing"
            updateStatusAction={updateStatusAction}
          />
        ) : null}

        {inquiry.status !== 'sent' ? (
          <StatusButton
            inquiryId={inquiry.id}
            status="sent"
            label="Mark sent"
            updateStatusAction={updateStatusAction}
          />
        ) : null}

        {inquiry.status !== 'archived' ? (
          <StatusButton
            inquiryId={inquiry.id}
            status="archived"
            label="Archive"
            updateStatusAction={updateStatusAction}
            variant="danger"
          />
        ) : null}

        {inquiry.providerId ? (
          <Link
            href={`/admin/providers/${inquiry.providerId}/edit`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3eb] px-3 py-2 text-xs font-semibold text-[#655d52] transition hover:bg-[#eee3d6] hover:text-[#211f1b]"
          >
            Edit provider
          </Link>
        ) : null}

        <Link
          href={`/providers/${inquiry.providerSlug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#4f5d3d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#414d31]"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
          View
        </Link>

        <a
          href={`mailto:${inquiry.senderEmail}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2dc] px-3 py-2 text-xs font-semibold text-[#a45f51] transition hover:bg-[#f5ded5]"
        >
          Reply
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
        </a>
      </div>
    </article>
  )
}

function StatusButton({
  inquiryId,
  status,
  label,
  updateStatusAction,
  variant = 'default',
}: {
  inquiryId: string
  status: ProviderInquiryStatus
  label: string
  updateStatusAction: (formData: FormData) => void | Promise<void>
  variant?: 'default' | 'danger'
}) {
  return (
    <form action={updateStatusAction}>
      <input type="hidden" name="id" value={inquiryId} />
      <input type="hidden" name="status" value={status} />

      <button
        type="submit"
        className={[
          'rounded-full px-3 py-2 text-xs font-semibold transition',
          variant === 'danger'
            ? 'bg-[#f5ded5] text-[#a45f51] hover:bg-[#eed0c6] hover:text-[#211f1b]'
            : 'bg-[#f8f3eb] text-[#655d52] hover:bg-[#eef0e6] hover:text-[#4f5d3d]',
        ].join(' ')}
      >
        {label}
      </button>
    </form>
  )
}