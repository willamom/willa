import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import MomRegistryBuilder from '@/components/registry/MomRegistryBuilder'

import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `Registry Ideas | ${siteConfig.name}`,
  description:
    'Browse mom-first registry ideas for postpartum recovery, meals, feeding support, home help, rest, and practical care.',
}

export default function RegistryPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <section className="px-5 pb-14 pt-10 sm:px-8 sm:pb-18 sm:pt-14 lg:px-14 lg:pb-20 lg:pt-16">
          <div className="mx-auto max-w-7xl">
            <div className="border-b border-[#ded3c3] pb-10 sm:pb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#39472c]">
                Registry for mom
              </p>

              <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.03] tracking-tight text-[#211f1b] sm:text-6xl lg:text-[4.75rem]">
                A registry for care, not just things.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f574d] sm:text-lg">
                Browse ideas for recovery, meals, feeding support, home help,
                rest, and the practical care that makes postpartum feel less
                lonely.
              </p>
            </div>

            <MomRegistryBuilder />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}