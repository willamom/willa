import Link from 'next/link'

import type { Guide } from '@/types/guides'

type GuideCardProps = {
  guide: Guide
}

export default function GuideCard({ guide }: GuideCardProps) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex h-full min-h-[18rem] flex-col rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)] transition hover:-translate-y-1 hover:bg-[#fffdf9] hover:shadow-[0_22px_65px_rgba(61,50,38,0.09)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-[#f5ded5] px-3 py-1 text-xs font-semibold text-[#a45f51]">
          {guide.category}
        </span>

        <span className="rounded-full bg-[#f8f3eb] px-3 py-1 text-xs font-semibold text-[#655d52]">
          {guide.readTime}
        </span>
      </div>

      <div className="flex-1">
        <h2 className="mt-5 font-serif text-3xl leading-tight text-[#211f1b]">
          {guide.title}
        </h2>

        <p className="mt-4 text-sm leading-6 text-[#5f574d]">
          {guide.description}
        </p>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eee6da] pt-5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
            {guide.stage}
          </span>

          <span className="text-sm font-semibold text-[#4f5d3d] transition group-hover:text-[#211f1b]">
            Read guide →
          </span>
        </div>
      </div>
    </Link>
  )
}