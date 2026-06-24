import type { TrustItem as TrustItemType } from '@/types/home'

type TrustItemProps = {
  item: TrustItemType
}

export default function TrustItem({ item }: TrustItemProps) {
  return (
    <article className="h-full rounded-[2rem] border border-[#e5dccf] bg-[#fffdf8] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#d8cbbb] hover:bg-white hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
      >
        <TrustIcon name={item.icon} />
      </div>

      <h3 className="mt-5 font-semibold text-[#211f1b]">{item.title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#5f574d]">
        {item.description}
      </p>
    </article>
  )
}

function TrustIcon({ name }: { name: TrustItemType['icon'] }) {
  if (name === 'heart') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.8 8.6c0 5.4-8.8 10.2-8.8 10.2S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.5a4.6 4.6 0 0 1 8.8 2.1z" />
      </svg>
    )
  }

  if (name === 'shield') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3.5 19 6v5.6c0 4.3-2.8 7.4-7 8.9-4.2-1.5-7-4.6-7-8.9V6z" />
        <path d="m9.2 12.2 1.8 1.8 3.8-4" />
      </svg>
    )
  }

  if (name === 'lock') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
        <path d="M12 14.5v2" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 19c8 0 12-5.5 12-13.5V4h-1.5C8.5 4 4 8.5 4 16.5V19z" />
      <path d="M6 19c2.8-4.5 6.2-7.5 10.5-9" />
    </svg>
  )
}