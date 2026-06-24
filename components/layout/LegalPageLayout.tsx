import Link from 'next/link'
import type { ReactNode } from 'react'

import PublicShellFooter from '@/components/layout/PublicShellFooter'
import PublicShellHeader from '@/components/layout/PublicShellHeader'

type LegalPageLayoutProps = {
  eyebrow: string
  title: string
  children: ReactNode
}

export default function LegalPageLayout({
  eyebrow,
  title,
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <PublicShellHeader />

      <main className="bg-[#fbf7ef] px-5 py-10 text-[#211f1b] sm:px-8 sm:py-14 lg:px-14 lg:py-16">
        <section className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#4f5d3d] shadow-sm transition hover:bg-[#f8f3eb] hover:text-[#211f1b]"
          >
            ← Back to Willa
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            {eyebrow}
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#211f1b] sm:text-6xl">
            {title}
          </h1>

          <div className="mt-8 space-y-6 text-sm leading-7 text-[#5f574d]">
            {children}
          </div>
        </section>
      </main>

      <PublicShellFooter />
    </>
  )
}