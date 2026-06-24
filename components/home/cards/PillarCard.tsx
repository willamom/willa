import Link from 'next/link'

import type { PillarCard as PillarCardType } from '@/types/home'

type PillarCardProps = {
  card: PillarCardType
}

export default function PillarCard({ card }: PillarCardProps) {
  const href = getPillarHref(card.icon)

  return (
    <Link
      href={href}
      className="group block h-full rounded-3xl border border-[#e5dccf] bg-[#fffdf8] p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#d8cbbb] hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4f5d3d]/30 sm:p-8"
      aria-label={`${card.action}: ${card.title}`}
    >
      <article className="flex h-full flex-col items-center">
        <div
          className={`mb-6 flex h-18 w-18 items-center justify-center rounded-full transition group-hover:scale-105 sm:h-20 sm:w-20 ${card.iconBg} ${card.iconColor}`}
        >
          <PillarIcon name={card.icon} />
        </div>

        <h3 className="text-lg font-semibold text-[#211f1b]">
          {card.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-6 text-[#5f574d]">
          {card.description}
        </p>

        <p className="mt-6 text-sm font-semibold text-[#4f5d3d] transition group-hover:text-[#211f1b]">
          {card.action} →
        </p>
      </article>
    </Link>
  )
}

function getPillarHref(icon: PillarCardType['icon']) {
  if (icon === 'answers') {
    return '/guides'
  }

  if (icon === 'plan') {
    return '/profile#care-plan'
  }

  if (icon === 'registry') {
    return '/registry'
  }

  return '/near-me'
}

function PillarIcon({ name }: { name: PillarCardType['icon'] }) {
  if (name === 'answers') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 5.5h5.5A3.5 3.5 0 0 1 14 9v10a3 3 0 0 0-3-3H5z" />
        <path d="M19 5.5h-5.5A3.5 3.5 0 0 0 10 9v10a3 3 0 0 1 3-3h6z" />
        <path d="M7.5 9h3" />
        <path d="M7.5 12h3" />
        <path d="M13.5 9h3" />
        <path d="M13.5 12h3" />
      </svg>
    )
  }

  if (name === 'plan') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 4h8" />
        <path d="M9 3h6v4H9z" />
        <path d="M7 5H5.8A1.8 1.8 0 0 0 4 6.8v12.4A1.8 1.8 0 0 0 5.8 21h12.4a1.8 1.8 0 0 0 1.8-1.8V6.8A1.8 1.8 0 0 0 18.2 5H17" />
        <path d="m8 12 1.5 1.5L12 11" />
        <path d="M14 12h3" />
        <path d="m8 17 1.5 1.5L12 16" />
        <path d="M14 17h3" />
      </svg>
    )
  }

  if (name === 'registry') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4.5 10h15v10h-15z" />
        <path d="M3.5 7h17v3h-17z" />
        <path d="M12 7v13" />
        <path d="M8.2 7C6.7 6 6.3 4.4 7.2 3.5c1.1-1.1 3 .2 4.8 3.5" />
        <path d="M15.8 7c1.5-1 1.9-2.6 1-3.5-1.1-1.1-3 .2-4.8 3.5" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M17 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M14.5 18.5a4.5 4.5 0 0 1 6 1.5" />
    </svg>
  )
}