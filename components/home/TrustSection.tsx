import Link from 'next/link'

import { trustItems } from '@/data/home'

import TrustItem from './cards/TrustItem'

export default function TrustSection() {
  return (
    <section
      id="about"
      className="bg-[#fbf7ef] px-5 pb-14 pt-8 sm:px-8 sm:pb-16 lg:px-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c]">
            Why Willa
          </p>

          <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#211f1b] sm:text-4xl lg:text-5xl">
            Built for the parts no one plans for.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#5f574d] sm:text-base sm:leading-7">
            Baby prep is everywhere. Willa helps make sure mom’s recovery,
            questions, support, and care do not get treated like an afterthought.
          </p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {trustItems.map((item) => (
            <TrustItem key={item.title} item={item} />
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-[#e2d7c8] bg-white/70 p-6 text-center shadow-[0_14px_45px_rgba(61,50,38,0.045)]">
          <p className="font-serif text-2xl leading-snug text-[#211f1b]">
            Everyone prepares for baby. Willa prepares you.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5f574d]">
            Start with your stage, save what matters, and build a care plan you
            can come back to when your brain has 37 open tabs.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/start"
              className="rounded-xl bg-[#4f5d3d] px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#414d31]"
            >
              Start my Willa
            </Link>

            <Link
              href="/guides"
              className="rounded-xl border border-[#d8cbbb] bg-[#fbf7ef] px-7 py-4 text-center text-sm font-semibold text-[#211f1b] transition hover:bg-white"
            >
              Explore guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}