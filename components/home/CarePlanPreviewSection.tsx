import Link from 'next/link'

import PlanMockup from './PlanMockup'

const carePlanSteps = [
  'Save the guides that matter to you',
  'Turn questions into care tasks',
  'Keep registry, support, and next steps together',
]

export default function CarePlanPreviewSection() {
  return (
    <section
      id="care-plan"
      className="relative overflow-hidden px-5 py-14 sm:px-8 sm:py-18 lg:px-14 lg:py-20"
    >
      <div className="absolute left-1/2 top-24 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#eadfd4]/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 rounded-[2.25rem] bg-[#f2ece2]/82 px-5 py-10 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:rounded-[3rem] sm:px-10 sm:py-14 lg:grid-cols-[0.88fr_1.12fr] lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c] sm:tracking-[0.32em]">
            From answers to a plan
          </p>

          <h2 className="mt-5 max-w-xl font-serif text-4xl leading-tight tracking-tight text-[#211f1b] sm:text-5xl">
            Turn late-night questions into a plan that supports{' '}
            <span className="italic text-[#a45f51]">you</span>.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#5f574d] sm:text-lg sm:leading-8">
            Willa helps you move from “what do I do now?” to a simple care plan
            you can actually use during pregnancy, birth prep, and postpartum.
          </p>

          <div className="mt-7 space-y-3">
            {carePlanSteps.map((step) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-2xl bg-[#fbf7ef]/70 px-4 py-3 shadow-[0_10px_30px_rgba(61,50,38,0.035)]"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4f5d3d] text-xs font-semibold text-white">
                  ✓
                </span>

                <p className="text-sm leading-6 text-[#4f4941]">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-3xl bg-[#fbf7ef]/78 p-5 shadow-[0_14px_45px_rgba(61,50,38,0.055)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a45f51]">
              Example
            </p>

            <p className="mt-3 font-serif text-2xl leading-snug text-[#211f1b]">
              “I’m home from the hospital. Now what?”
            </p>

            <p className="mt-3 text-sm leading-6 text-[#655d52]">
              Willa helps you save the answer, turn it into next steps, and keep
              the support you need close by.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/start"
              className="rounded-xl bg-[#4f5d3d] px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#414d31]"
            >
              Create my Willa
            </Link>

            <Link
              href="/guides"
              className="rounded-xl border border-[#d8cbbb] bg-white/45 px-7 py-4 text-center text-sm font-semibold text-[#211f1b] transition hover:bg-white/70"
            >
              Browse guides →
            </Link>
          </div>
        </div>

        <PlanMockup />
      </div>
    </section>
  )
}