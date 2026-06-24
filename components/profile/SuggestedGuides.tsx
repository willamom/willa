import Link from 'next/link'

import type { ProfileGuide } from '@/types/profile'

type SuggestedGuidesProps = {
  guides: ProfileGuide[]
}

export default function SuggestedGuides({ guides }: SuggestedGuidesProps) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Suggested guides
          </p>

          <h2 className="mt-4 font-serif text-3xl">
            Helpful for this stage
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            A few starting points based on your profile, stage, and the kind of
            support Willa thinks may be useful.
          </p>
        </div>

        <Link
          href="/guides"
          className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d] transition hover:bg-[#dde5d0] hover:text-[#211f1b]"
        >
          Browse all →
        </Link>
      </div>

      {guides.length > 0 ? (
        <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.title}
              href={guide.href}
              className="group flex h-full min-h-[14rem] flex-col rounded-2xl bg-[#f8f3eb] p-5 transition hover:bg-[#f2ece2]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
                  {guide.category}
                </span>

                <span className="shrink-0 text-xs text-[#655d52]">
                  {guide.readTime}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="mt-4 font-serif text-2xl leading-tight text-[#211f1b]">
                  {guide.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#5f574d]">
                  {guide.description}
                </p>
              </div>

              <p className="mt-auto pt-5 text-sm font-semibold text-[#4f5d3d] transition group-hover:text-[#211f1b]">
                Read guide →
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-[#e5dccf] bg-[#f8f3eb] p-6">
          <p className="font-serif text-2xl leading-tight text-[#211f1b]">
            No suggested guides yet.
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            Once your Willa profile has more details, suggested guides can feel
            more personal. For now, you can browse the full guide library.
          </p>

          <Link
            href="/guides"
            className="mt-5 inline-flex rounded-xl bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
          >
            Browse guides
          </Link>
        </div>
      )}
    </section>
  )
}