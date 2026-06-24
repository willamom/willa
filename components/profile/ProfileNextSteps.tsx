import Link from 'next/link'

const nextSteps = [
  {
    title: 'Add to my registry',
    description: 'Turn care needs into things friends and family can help with.',
    href: '/registry',
    eyebrow: 'Registry',
  },
  {
    title: 'Find support near me',
    description:
      'Explore doulas, lactation consultants, pelvic floor support, and more.',
    href: '/near-me',
    eyebrow: 'Support',
  },
  {
    title: 'Save questions',
    description: 'Keep track of the things you are still figuring out.',
    href: '#my-questions',
    eyebrow: 'Questions',
  },
]

export default function ProfileNextSteps() {
  return (
    <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Next steps
          </p>

          <h2 className="mt-4 font-serif text-3xl text-[#211f1b]">
            Keep building your Willa
          </h2>
        </div>

        <p className="max-w-md text-sm leading-6 text-[#5f574d]">
          Pick one small thing to save, ask, or prepare next. No need to do the
          whole village in one sitting.
        </p>
      </div>

      <div className="mt-6 grid items-stretch gap-5 md:grid-cols-3">
        {nextSteps.map((step) => (
          <Link
            key={step.title}
            href={step.href}
            className="group flex h-full min-h-[13rem] flex-col rounded-[2rem] bg-[#f2ece2] p-6 shadow-[0_18px_55px_rgba(61,50,38,0.06)] transition hover:-translate-y-1 hover:bg-[#efe4d8]"
          >
            <div className="flex-1">
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#a45f51]">
                {step.eyebrow}
              </span>

              <h3 className="mt-5 font-serif text-2xl leading-tight text-[#211f1b]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5f574d]">
                {step.description}
              </p>
            </div>

            <p className="mt-auto pt-5 text-sm font-semibold text-[#4f5d3d] transition group-hover:text-[#211f1b]">
              Continue →
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}