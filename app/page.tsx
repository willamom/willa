import Link from 'next/link'

import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `${siteConfig.name} | Coming soon`,
  description:
    'Willa is a mom-first space for pregnancy, birth, postpartum guides, care planning, registry ideas, and support.',
}

const previewItems = [
  {
    title: 'Learn',
    description: 'Practical guides from pregnancy to postpartum.',
  },
  {
    title: 'Plan',
    description: 'Keep track of what matters, from appointments to recovery.',
  },
  {
    title: 'Save',
    description: 'Collect registry ideas, checklists, and resources all in one place.',
  },
]

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7ef] text-[#211f1b]">
      <section className="relative min-h-screen px-5 py-6 sm:px-8 lg:px-14">
        <div className="absolute -right-32 top-20 h-[28rem] w-[28rem] rounded-full bg-[#eadfd4]/60 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#f5ded5]/55 blur-3xl" />

        <header className="relative mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="font-serif text-4xl font-semibold tracking-tight text-[#39472c]"
          >
            willa
          </Link>

          <span className="rounded-full border border-[#e2d7c8] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f5d3d] shadow-sm">
            Coming soon
          </span>
        </header>

        <div className="relative mx-auto grid max-w-7xl gap-10 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:pt-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c] sm:tracking-[0.34em]">
              Pregnancy · Birth · Postpartum
            </p>

            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.03] tracking-tight text-[#211f1b] sm:text-6xl lg:text-[5rem]">
              Everyone prepares for baby.{' '}
              <span className="italic text-[#a45f51]">
                Willa prepares you.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-[#5f574d] sm:text-lg sm:leading-8">
              Honest guides, practical checklists, registry ideas, and support for every stage of pregnancy, birth, and postpartum.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${siteConfig.email}?subject=Early access to Willa`}
                className="rounded-xl bg-[#4f5d3d] px-8 py-4 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#414d31]"
              >
                Join the waitlist
              </a>

              <a
                href={`mailto:${siteConfig.email}?subject=Willa partnership`}
                className="rounded-xl border border-[#c8bdae] bg-white/70 px-8 py-4 text-center text-sm font-semibold text-[#211f1b] shadow-sm transition hover:bg-white"
              >
                Work with Willa
              </a>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-6 text-[#8a8277]">
              The nursery is only one part of getting ready.
              Willa is here for the rest.
            </p>
          </div>

          <div className="rounded-[2.5rem] bg-[#f2ece2]/82 p-5 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:p-7 lg:p-8">
            <div className="rounded-[2rem] bg-white/80 p-5 shadow-[0_16px_50px_rgba(61,50,38,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a45f51]">
                A first look
              </p>

              <p className="mt-4 font-serif text-3xl leading-tight text-[#211f1b]">
                Your care home base for the parts no one plans for.
              </p>

              <div className="mt-6 space-y-3">
                {previewItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-[#f8f3eb] p-4"
                  >
                    <p className="text-sm font-semibold text-[#211f1b]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#655d52]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[#eadfd4] bg-[#fbf7ef] p-4">
                <p className="font-serif text-xl leading-snug text-[#211f1b]">
                  You deserve a plan.
                </p>

                <p className="mt-2 text-sm leading-6 text-[#655d52]">
                  You do not have to piece it together alone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="relative mx-auto mt-16 flex max-w-7xl flex-col gap-3 border-t border-[#e8ded1] pt-6 text-sm text-[#655d52] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Willa. Mom-first care planning.</p>

          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="transition hover:text-[#211f1b]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[#211f1b]">
              Terms
            </Link>
            <Link
              href="/disclaimer"
              className="transition hover:text-[#211f1b]"
            >
              Disclaimer
            </Link>
          </div>
        </footer>
      </section>
    </main>
  )
}