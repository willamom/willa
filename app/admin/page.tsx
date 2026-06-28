import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  FileText,
  Inbox,
  MapPinned,
  ShieldCheck,
  Star,
} from 'lucide-react'

import { getAdminProviderClaims } from '@/lib/admin/provider-claims'
import { getAdminProviders } from '@/lib/admin/providers'

export const metadata = {
  title: 'Admin | Willa',
}

export default async function AdminPage() {
  const [providers, claims] = await Promise.all([
    getAdminProviders(),
    getAdminProviderClaims(),
  ])

  const publishedProviders = providers.filter(
    (provider) => provider.status === 'published'
  ).length

  const draftProviders = providers.filter(
    (provider) => provider.status === 'draft'
  ).length

  const featuredProviders = providers.filter(
    (provider) => provider.isFeatured
  ).length

  const verifiedProviders = providers.filter(
    (provider) => provider.isVerified
  ).length

  const newClaims = claims.filter((claim) => claim.status === 'new').length
  const reviewingClaims = claims.filter(
    (claim) => claim.status === 'reviewing'
  ).length

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
              Willa admin
            </p>

            <h1 className="mt-3 font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
              Admin dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#655d52]">
              Manage Willa’s provider directory, claim requests, and future
              content tools from one place.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <StatCard label="Providers" value={providers.length} />
          <StatCard label="Published" value={publishedProviders} />
          <StatCard label="Drafts" value={draftProviders} />
          <StatCard label="Featured" value={featuredProviders} />
          <StatCard label="Verified" value={verifiedProviders} />
          <StatCard label="New claims" value={newClaims} highlight />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <AdminCard
            href="/admin/providers"
            icon={<MapPinned className="h-5 w-5" strokeWidth={1.8} />}
            title="Providers"
            description="Search, filter, publish, verify, feature, and edit provider listings."
            meta={`${providers.length} total · ${publishedProviders} published`}
          />

          <AdminCard
            href="/admin/provider-claims"
            icon={<ClipboardCheck className="h-5 w-5" strokeWidth={1.8} />}
            title="Provider claims"
            description="Review profile claim requests from providers and business owners."
            meta={`${newClaims} new · ${reviewingClaims} reviewing`}
          />

          <AdminCard
            href="/providers"
            icon={<Building2 className="h-5 w-5" strokeWidth={1.8} />}
            title="Public directory"
            description="Open the live provider directory and check how listings appear publicly."
            meta="Opens public providers page"
            external
          />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section className="rounded-[2rem] border border-[#e2d7c8] bg-white p-5 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0e6] text-[#4f5d3d]">
                <Inbox className="h-5 w-5" strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#39472c]">
                  Needs attention
                </p>

                <h2 className="font-serif text-3xl text-[#211f1b]">
                  Admin queue
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <QueueItem
                icon={<ClipboardCheck className="h-4 w-4" strokeWidth={1.8} />}
                title="New provider claims"
                value={newClaims}
                href="/admin/provider-claims"
              />

              <QueueItem
                icon={<FileText className="h-4 w-4" strokeWidth={1.8} />}
                title="Draft providers"
                value={draftProviders}
                href="/admin/providers"
              />

              <QueueItem
                icon={<BadgeCheck className="h-4 w-4" strokeWidth={1.8} />}
                title="Providers waiting for verification"
                value={providers.length - verifiedProviders}
                href="/admin/providers"
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#e2d7c8] bg-[#f8f3eb] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#39472c]">
              Next good admin upgrades
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#211f1b]">
              What this dashboard will grow into
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-6 text-[#655d52]">
              <FutureItem text="Guide admin" />
              <FutureItem text="Provider claim approval workflow" />
              <FutureItem text="Missing image / missing contact filters" />
              <FutureItem text="Bulk provider import" />
              <FutureItem text="City and category SEO controls" />
            </div>
          </section>
        </div>
      </div>
    </main>
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

function AdminCard({
  href,
  icon,
  title,
  description,
  meta,
  external = false,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  meta: string
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="group rounded-[2rem] border border-[#e2d7c8] bg-white p-5 shadow-[0_24px_80px_rgba(61,50,38,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(61,50,38,0.09)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef0e6] text-[#4f5d3d]">
          {icon}
        </div>

        <ArrowRight
          className="h-5 w-5 text-[#8a8277] transition group-hover:translate-x-1 group-hover:text-[#4f5d3d]"
          strokeWidth={1.8}
        />
      </div>

      <h2 className="mt-5 font-serif text-3xl leading-tight text-[#211f1b]">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#655d52]">{description}</p>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {meta}
      </p>
    </Link>
  )
}

function QueueItem({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode
  title: string
  value: number
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-[#f8f3eb] px-4 py-3 transition hover:bg-[#f2ece2]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#4f5d3d]">
          {icon}
        </div>

        <p className="text-sm font-semibold text-[#211f1b]">{title}</p>
      </div>

      <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#4f5d3d]">
        {value}
      </span>
    </Link>
  )
}

function FutureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#4f5d3d]">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
      </div>

      <span>{text}</span>
    </div>
  )
}