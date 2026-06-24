import Link from 'next/link'

import BetaNotice from '@/components/common/BetaNotice'
import MedicalDisclaimer from '@/components/common/MedicalDisclaimer'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import MomRegistryBuilder from '@/components/registry/MomRegistryBuilder'

import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `Registry | ${siteConfig.name}`,
  description:
    'Build a mom-first registry around postpartum recovery, meals, feeding support, home help, rest, and practical care.',
}

export default function RegistryPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <section className="px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/profile"
              className="text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              ← Back to my Willa
            </Link>

            <div className="mt-8 rounded-[3rem] bg-[#f2ece2] px-6 py-12 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:px-10 lg:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#39472c]">
                Registry for mom
              </p>

              <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
                A registry for care, not just things.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f574d]">
                Build a registry around recovery, meals, feeding support, home
                help, rest, and the practical things that make postpartum feel
                less lonely.
              </p>
            </div>

            <div className="mt-6">
              <BetaNotice />
            </div>

            <div className="mt-8">
              <MomRegistryBuilder />
            </div>

            <div className="mt-8">
              <MedicalDisclaimer />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}