import Link from 'next/link'

import BetaNotice from '@/components/common/BetaNotice'
import MedicalDisclaimer from '@/components/common/MedicalDisclaimer'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import NearMeDirectory from '@/components/near-me/NearMeDirectory'

import { supportOptions } from '@/data/nearMe'
import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `Find Support | ${siteConfig.name}`,
  description:
    'Explore and save mom-focused support options including doulas, lactation support, pelvic floor care, postpartum help, meals, and mental health support.',
}

export default function NearMePage() {
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
                Near Me
              </p>

              <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
                Find support close to home.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f574d]">
                Explore doulas, lactation support, pelvic floor care,
                postpartum help, meals, and mental health support. Save what
                you may want to come back to later.
              </p>
            </div>

            <div className="mt-6">
              <BetaNotice />
            </div>

            <NearMeDirectory options={supportOptions} />

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