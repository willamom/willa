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
        <section className="px-4 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/profile"
              className="text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              ← Back to my Willa
            </Link>

            <div className="mt-8 rounded-[2rem] bg-[#f2ece2] px-5 py-10 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:rounded-[3rem] sm:px-10 sm:py-12 lg:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#39472c]">
                Registry for mom
              </p>

              <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-6xl sm:leading-tight">
                A registry for care, not just things.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#5f574d] sm:text-lg sm:leading-8">
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
