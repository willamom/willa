import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { getProviderBySlug } from '@/lib/providers'

type ClaimSuccessPageProps = {
  searchParams: Promise<{
    provider?: string
  }>
}

export const metadata = {
  title: 'Claim Request Sent | Willa',
  description: 'Your provider claim request has been sent to Willa.',
}

export default async function ClaimSuccessPage({
  searchParams,
}: ClaimSuccessPageProps) {
  const { provider: providerSlug } = await searchParams
  const provider = providerSlug ? await getProviderBySlug(providerSlug) : null

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] px-5 py-16 text-[#211f1b] sm:px-8 lg:px-10">
        <section className="mx-auto max-w-2xl rounded-[2rem] border border-[#e2d7c8] bg-white p-7 text-center shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef0e6] text-[#4f5d3d]">
            <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Claim request sent
          </p>

          <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight">
            We got it.
          </h1>

          <p className="mt-5 text-base leading-7 text-[#655d52]">
            Your provider claim request has been submitted. We’ll review the
            information before updating or marking a profile as claimed.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {provider ? (
              <Link
                href={`/providers/${provider.slug}`}
                className="rounded-full bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
              >
                Back to provider profile
              </Link>
            ) : null}

            <Link
              href="/providers"
              className="rounded-full bg-[#f8f3eb] px-5 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              Browse providers
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}