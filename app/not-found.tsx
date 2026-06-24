import Link from 'next/link'

import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] px-6 py-16 text-[#211f1b] sm:px-10 lg:px-14">
        <section className="mx-auto max-w-3xl rounded-[3rem] bg-[#f2ece2] px-6 py-14 text-center shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#39472c]">
            Page not found
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl">
            This page wandered off.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#5f574d]">
            The page you’re looking for may have moved, changed, or never made
            it onto Willa’s care plan.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-[#4f5d3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
            >
              Go home
            </Link>

            <Link
              href="/guides"
              className="rounded-full bg-[#fbf7ef] px-6 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-white hover:text-[#211f1b]"
            >
              Browse guides
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}