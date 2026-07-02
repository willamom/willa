import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Baby,
  BadgeCheck,
  Heart,
  HeartHandshake,
  Sparkles,
  UserRound,
} from 'lucide-react'

import HomeFindSupportPreview from '@/components/home/HomeFindSupportPreview'
import { getPublishedProviders } from '@/lib/providers'
import type { ProviderCategory } from '@/types/providers'

type SupportType = {
  label: string
  slug: ProviderCategory
  icon: LucideIcon
  color: string
  bg: string
}

const supportTypes: SupportType[] = [
  {
    label: 'Doula',
    slug: 'doula',
    icon: HeartHandshake,
    color: 'text-[#a45f51]',
    bg: 'bg-[#f5ded5]',
  },
  {
    label: 'Midwife',
    slug: 'midwife',
    icon: BadgeCheck,
    color: 'text-[#4f5d3d]',
    bg: 'bg-[#eef0e6]',
  },
  {
    label: 'Lactation',
    slug: 'lactation',
    icon: Baby,
    color: 'text-[#7b5aa6]',
    bg: 'bg-[#efe8f7]',
  },
  {
    label: 'Pelvic Floor PT',
    slug: 'pelvic-floor-pt',
    icon: UserRound,
    color: 'text-[#4d6fa3]',
    bg: 'bg-[#e9eef7]',
  },
  {
    label: 'Mental Health',
    slug: 'mental-health',
    icon: Heart,
    color: 'text-[#b45f68]',
    bg: 'bg-[#f7e8e8]',
  },
  {
    label: 'Postpartum Care',
    slug: 'postpartum-care',
    icon: Sparkles,
    color: 'text-[#bd8533]',
    bg: 'bg-[#fff2dc]',
  },
]

export default async function FindSupportSection() {
  const providers = await getPublishedProviders()

  return (
    <section className="px-4 pt-6 pb-14 sm:px-8 lg:px-14 lg:pt-7 lg:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 border-y border-[#e5d9ca] py-10 sm:py-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:py-16">
        <div className="flex h-full flex-col">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c] sm:tracking-[0.34em]">
              Provider directory
            </p>

            <h2 className="mt-4 max-w-xl font-serif text-[2.35rem] leading-[1.06] tracking-tight text-[#211f1b] sm:text-5xl lg:text-[3.25rem]">
              Find your support team.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#48443d]">
              From pregnancy through postpartum, find local providers who can
              support you every step of the way.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/providers"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#4f5d3d] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#414d31]"
              >
                Explore support
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  strokeWidth={1.8}
                />
              </Link>

              <Link
                href="/providers/claim"
                className="inline-flex items-center justify-center rounded-full border border-[#d8cabb] bg-white/70 px-6 py-3 text-sm font-semibold text-[#211f1b] shadow-sm transition hover:bg-white"
              >
                I&apos;m a provider
              </Link>
            </div>
          </div>

          <div className="mt-8 max-w-xl border-t border-[#e5d9ca] pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a8277]">
              Browse by support type
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {supportTypes.map((type) => (
                <SupportTypeLink key={type.slug} type={type} />
              ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-[#655d52]">
              Know a great provider?{' '}
              <Link
                href="/providers/suggest"
                className="font-semibold text-[#4f5d3d] underline decoration-[#c8bdae] underline-offset-4 transition hover:text-[#211f1b]"
              >
                Suggest them to Willa
              </Link>
              .
            </p>
          </div>
        </div>

        <HomeFindSupportPreview providers={providers} />
      </div>
    </section>
  )
}

function SupportTypeLink({ type }: { type: SupportType }) {
  const Icon = type.icon

  return (
    <Link
      href={`/providers?category=${type.slug}`}
      className="group inline-flex items-center gap-2 rounded-full border border-[#e2d7c8] bg-white/72 px-3.5 py-2 text-xs font-semibold text-[#48443d] shadow-[0_8px_24px_rgba(61,50,38,0.025)] transition hover:border-[#a45f51] hover:bg-white hover:text-[#211f1b]"
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${type.bg} ${type.color}`}
      >
        <Icon className="h-3 w-3" strokeWidth={1.8} />
      </span>

      {type.label}
    </Link>
  )
}
