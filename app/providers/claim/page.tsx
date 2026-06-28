import Link from 'next/link'
import {
  BadgeCheck,
  Building2,
  Mail,
  ShieldCheck,
} from 'lucide-react'

import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { getProviderCategoryConfig } from '@/data/providers/categories'
import { createProviderClaimAction } from '@/lib/provider-claims'
import { getProviderBySlug } from '@/lib/providers'

type ClaimProviderPageProps = {
  searchParams: Promise<{
    provider?: string
    error?: string
  }>
}

function getErrorMessage(error?: string) {
  switch (error) {
    case 'missing':
      return 'Please fill in your name, email, and provider name.'
    case 'email':
      return 'Please enter a valid email address.'
    case 'confirm':
      return 'Please confirm that you are the provider, owner, or authorized representative.'
    case 'server':
      return 'Something went wrong while submitting your claim. Please try again.'
    default:
      return null
  }
}

export const metadata = {
  title: 'Claim a Provider Profile | Willa',
  description:
    'Claim a Willa provider profile and request to update your pregnancy, birth, or postpartum support listing.',
}

export default async function ClaimProviderPage({
  searchParams,
}: ClaimProviderPageProps) {
  const { provider: providerSlug, error } = await searchParams
  const provider = providerSlug ? await getProviderBySlug(providerSlug) : null
  const category = provider
    ? getProviderCategoryConfig(provider.category)
    : null
  const errorMessage = getErrorMessage(error)

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-10 lg:py-14">
          <div>
            <Link
              href={provider ? `/providers/${provider.slug}` : '/providers'}
              className="text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              ← Back to {provider ? 'provider profile' : 'provider directory'}
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
              Provider claims
            </p>

            <h1 className="mt-4 max-w-xl font-serif text-5xl leading-tight tracking-tight text-[#211f1b] sm:text-6xl">
              Claim your Willa profile.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#655d52]">
              Tell us who you are and which provider profile belongs to you.
              We’ll review the request before making changes.
            </p>

            <div className="mt-8 space-y-3">
              <InfoPoint
                icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.8} />}
                title="We verify requests first"
                description="Claims are reviewed before a provider profile is updated or marked claimed."
              />

              <InfoPoint
                icon={<BadgeCheck className="h-4 w-4" strokeWidth={1.8} />}
                title="Claimed profiles are coming soon"
                description="Once approved, providers will be able to complete details, add photos, and keep listings current."
              />

              <InfoPoint
                icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}
                title="Use your best contact email"
                description="We’ll use this email to follow up about your claim."
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e2d7c8] bg-white p-5 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:p-6">
            {provider ? (
              <div className="rounded-[1.5rem] bg-[#f8f3eb] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {category ? (
                    <>
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />

                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
                        {category.label}
                      </span>
                    </>
                  ) : null}
                </div>

                <h2 className="mt-3 font-serif text-3xl leading-tight text-[#211f1b]">
                  {provider.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#655d52]">
                  {provider.location.city}
                  {provider.location.state
                    ? `, ${provider.location.state}`
                    : ''}
                </p>
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-[#f8f3eb] p-4">
                <h2 className="font-serif text-3xl leading-tight text-[#211f1b]">
                  No provider selected
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#655d52]">
                  You can still submit a claim, but it’s better to start from
                  the exact provider profile.
                </p>

                <Link
                  href="/providers"
                  className="mt-3 inline-flex text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
                >
                  Find your profile →
                </Link>
              </div>
            )}

            {errorMessage ? (
              <div className="mt-5 rounded-[1.25rem] bg-[#f5ded5] p-4 text-sm font-semibold leading-6 text-[#a45f51]">
                {errorMessage}
              </div>
            ) : null}

            <form action={createProviderClaimAction} className="mt-6 space-y-5">
              <input
                type="hidden"
                name="provider_id"
                value={provider?.id ?? ''}
              />

              <input
                type="hidden"
                name="provider_slug"
                value={provider?.slug ?? providerSlug ?? ''}
              />

              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <Field
                label="Provider profile"
                name="provider_name"
                defaultValue={provider?.name}
                placeholder="Business or provider name"
                required
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Your name"
                  name="claimant_name"
                  placeholder="Jane Smith"
                  required
                />

                <Field
                  label="Your email"
                  name="claimant_email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <Field
                label="Business name"
                name="business_name"
                defaultValue={provider?.name}
                placeholder="Optional"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Website"
                  name="website"
                  defaultValue={provider?.website}
                  placeholder="https://..."
                />

                <Field
                  label="Instagram"
                  name="instagram"
                  defaultValue={provider?.instagram}
                  placeholder="@handle or https://..."
                />
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
                  Message
                </span>

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us anything helpful: your role, what needs updating, or how we can verify the profile."
                  className="w-full rounded-xl border border-[#e2d7c8] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#a45f51]"
                />
              </label>

              <label className="flex items-start gap-3 rounded-[1.25rem] bg-[#f8f3eb] p-4 text-sm leading-6 text-[#655d52]">
                <input
                  type="checkbox"
                  name="confirm_owner"
                  required
                  className="mt-1 h-4 w-4 shrink-0"
                />

                <span>
                  I confirm that I am the provider, business owner, or an
                  authorized representative for this profile.
                </span>
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
              >
                <Building2 className="h-4 w-4" strokeWidth={1.8} />
                Submit claim request
              </button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}

function InfoPoint({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-[1.5rem] bg-white/65 p-4">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef0e6] text-[#4f5d3d]">
        {icon}
      </div>

      <div>
        <p className="font-semibold text-[#211f1b]">{title}</p>

        <p className="mt-1 text-sm leading-6 text-[#655d52]">
          {description}
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required = false,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
      </span>

      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
      />
    </label>
  )
}