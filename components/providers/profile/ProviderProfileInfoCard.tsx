import type { ReactNode } from 'react'
import { FaInstagram } from 'react-icons/fa6'
import {
  Globe,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

import type { WillaProvider } from '@/types/providers'
import ProviderInquiryButton from '@/components/providers/ProviderInquiryButton'

type ProviderProfileInfoCardProps = {
  provider: WillaProvider
}

function getInstagramUrl(instagram: string) {
  if (instagram.startsWith('http')) {
    return instagram
  }

  return `https://instagram.com/${instagram.replace('@', '')}`
}

export default function ProviderProfileInfoCard({
  provider,
}: ProviderProfileInfoCardProps) {
  const location = [
    provider.location.address,
    provider.location.city,
    provider.location.state,
    provider.location.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <section className="rounded-[1.75rem] border border-[#e2d7c8] bg-white p-5 shadow-[0_18px_55px_rgba(61,50,38,0.06)]">
      <h2 className="font-serif text-2xl text-[#211f1b]">
        Contact & location
      </h2>

      <ProviderInquiryButton
        provider={provider}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#a45f51] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f5145]"
        />

      <div className="mt-5 space-y-4 text-sm text-[#655d52]">
        <ContactRow
          icon={<MapPin className="h-4 w-4" strokeWidth={1.8} />}
          label="Location"
          value={location}
        />

        <ContactRow
          icon={<Globe className="h-4 w-4" strokeWidth={1.8} />}
          label="Website"
          value={provider.website ? 'Visit website' : undefined}
          href={provider.website}
          external
        />

        <ContactRow
          icon={<FaInstagram className="h-4 w-4" />}
          label="Instagram"
          value={provider.instagram}
          href={
            provider.instagram
              ? getInstagramUrl(provider.instagram)
              : undefined
          }
          external
        />

        <ContactRow
          icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}
          label="Email"
          value={provider.email}
          href={provider.email ? `mailto:${provider.email}` : undefined}
        />

        <ContactRow
          icon={<Phone className="h-4 w-4" strokeWidth={1.8} />}
          label="Phone"
          value={provider.phone}
          href={provider.phone ? `tel:${provider.phone}` : undefined}
        />
      </div>
    </section>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: ReactNode
  label: string
  value?: string
  href?: string
  external?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 shrink-0 text-[#a45f51]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8277]">
          {label}
        </p>

        <div className="mt-1 break-words leading-6">
          {value ? (
            href ? (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="font-medium text-[#4f5d3d] transition hover:text-[#211f1b]"
              >
                {value}
              </a>
            ) : (
              <span>{value}</span>
            )
          ) : (
            <span className="text-[#aaa096]">Not available yet</span>
          )}
        </div>
      </div>
    </div>
  )
}