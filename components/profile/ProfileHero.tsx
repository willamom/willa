import type { ReactNode } from 'react'
import Link from 'next/link'

import type { WillaProfile } from '@/types/profile'

type ProfileHeroProps = {
  profile: WillaProfile
  pregnancy: {
    weekLabel: string
    trimester: string
    dueDateLabel: string
    daysLabel: string
  }
}

export default function ProfileHero({ profile, pregnancy }: ProfileHeroProps) {
  const profileName = profile.name?.trim() || 'Your'

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] bg-[#f2ece2] px-5 py-8 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:rounded-[3rem] sm:px-10 sm:py-10 lg:px-12">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#eadfd4]/70 blur-3xl" />
      <div className="absolute -bottom-28 left-1/2 h-72 w-72 rounded-full bg-[#f5ded5]/55 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c] sm:tracking-[0.32em]">
            Your Willa
          </p>

          <h1 className="mt-5 max-w-3xl break-words font-serif text-[2.55rem] leading-[1.06] tracking-tight text-[#211f1b] sm:text-6xl sm:leading-tight">
            {profileName === 'Your'
              ? 'Your care home base'
              : `${profileName}’s care home base`}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#5f574d] sm:text-lg sm:leading-8">
            A place for your pregnancy week, saved guides, postpartum plan,
            registry ideas, and the support you may want around you.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 sm:gap-3">
            <Pill>{pregnancy.weekLabel}</Pill>
            <Pill>{pregnancy.trimester}</Pill>
            <Pill>Due {pregnancy.dueDateLabel}</Pill>
            {profile.location ? <Pill>{profile.location}</Pill> : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/start"
              className="rounded-xl bg-[#4f5d3d] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#414d31]"
            >
              Edit my Willa
            </Link>

            <Link
              href="#care-plan"
              className="rounded-xl bg-white/70 px-6 py-3 text-center text-sm font-semibold text-[#211f1b] transition hover:bg-white"
            >
              View care plan
            </Link>

            <Link
              href="/guides"
              className="rounded-xl border border-[#d8cbbb] bg-[#fbf7ef]/45 px-6 py-3 text-center text-sm font-semibold text-[#211f1b] transition hover:bg-white/70"
            >
              Browse guides
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#fbf7ef]/88 p-5 shadow-[0_16px_50px_rgba(61,50,38,0.06)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a45f51]">
                Pregnancy week
              </p>

              <p className="mt-4 font-serif text-4xl leading-none text-[#211f1b] sm:text-5xl">
                {pregnancy.weekLabel}
              </p>
            </div>

            <span className="rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
              Now
            </span>
          </div>

          <div className="mt-5 space-y-3 border-t border-[#e4d8c8] pt-5">
            <InfoRow label="Stage" value={pregnancy.trimester} />
            <InfoRow label="Due date" value={pregnancy.dueDateLabel} />
            <InfoRow label="Countdown" value={pregnancy.daysLabel} />
          </div>

          <p className="mt-5 rounded-2xl bg-[#f7f1e8] p-4 text-sm leading-6 text-[#655d52]">
            {profile.note}
          </p>
        </div>
      </div>
    </section>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="max-w-full break-words rounded-full bg-[#fbf7ef]/85 px-4 py-2 text-sm font-medium text-[#4f5d3d] shadow-[0_8px_20px_rgba(61,50,38,0.035)]">
      {children}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[#8a8277]">{label}</span>
      <span className="text-right font-medium text-[#3f3b35]">{value}</span>
    </div>
  )
}
