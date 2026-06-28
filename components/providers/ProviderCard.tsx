'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram } from 'react-icons/fa6'
import {
  BadgeCheck,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  X,
} from 'lucide-react'

import { getProviderCategoryConfig } from '@/data/providers/categories'
import type { WillaProvider } from '@/types/providers'

type ProviderCardProps = {
  provider: WillaProvider
  onClose: () => void
}

function getInstagramUrl(instagram: string) {
  if (instagram.startsWith('http')) {
    return instagram
  }

  return `https://instagram.com/${instagram.replace('@', '')}`
}

function getProviderInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function ProviderCard({ provider, onClose }: ProviderCardProps) {
  const category = getProviderCategoryConfig(provider.category)
  const initials = getProviderInitials(provider.name)

  return (
    <div className="absolute inset-x-3 bottom-3 z-[1000] sm:inset-x-auto sm:right-4 sm:top-4 sm:w-[24rem]">
      <div className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_80px_rgba(61,50,38,0.18)]">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-[#e8ded1] sm:hidden" />

        <div className="relative h-40 shrink-0 bg-[#f2ece2] sm:h-48">
          {provider.image ? (
            <Image
              src={provider.image}
              alt={provider.name}
              fill
              sizes="(max-width: 640px) calc(100vw - 1.5rem), 384px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f2ece2]">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold text-white shadow-[0_16px_40px_rgba(61,50,38,0.12)]"
                style={{ backgroundColor: category.color }}
              >
                {initials}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#655d52] shadow-sm transition hover:text-[#211f1b]"
            aria-label="Close provider details"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
              {category.label}
            </p>

            {provider.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef0e6] px-2.5 py-1 text-[0.68rem] font-semibold text-[#4f5d3d]">
                <BadgeCheck className="h-3 w-3" strokeWidth={2} />
                Verified
              </span>
            ) : null}

            {provider.isFeatured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f5ded5] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
                <Star className="h-3 w-3 fill-current" strokeWidth={2} />
                Featured
              </span>
            ) : null}
          </div>

          <h2 className="mt-4 font-serif text-3xl leading-tight text-[#211f1b]">
            {provider.name}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-[#655d52]">
            <MapPin className="h-4 w-4 text-[#a45f51]" strokeWidth={1.8} />

            <span>
              {provider.location.city}
              {provider.location.state ? `, ${provider.location.state}` : ''}
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#655d52]">
            {provider.description}
          </p>

          {provider.specialties.length > 0 ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#39472c]">
                Specialties
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {provider.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-[#f8f3eb] px-3 py-1.5 text-xs font-semibold text-[#655d52]"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-2">
            <Link
              href={`/providers/${provider.slug}`}
              className="flex items-center justify-center rounded-xl bg-[#a45f51] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8f5145]"
            >
              View Willa profile
            </Link>

            {provider.website ? (
              <a
                href={provider.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#4f5d3d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
              >
                Visit website
                <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
              </a>
            ) : null}

            <div className="grid gap-2 sm:grid-cols-3">
              {provider.instagram ? (
                <a
                  href={getInstagramUrl(provider.instagram)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#e2d7c8] bg-white px-4 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#f8f3eb] hover:text-[#211f1b]"
                >
                  <FaInstagram className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">Instagram</span>
                </a>
              ) : null}

              {provider.email ? (
                <a
                  href={`mailto:${provider.email}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#e2d7c8] bg-white px-4 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#f8f3eb] hover:text-[#211f1b]"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.8} />
                  <span className="sr-only sm:not-sr-only">Email</span>
                </a>
              ) : null}

              {provider.phone ? (
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#e2d7c8] bg-white px-4 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#f8f3eb] hover:text-[#211f1b]"
                >
                  <Phone className="h-4 w-4" strokeWidth={1.8} />
                  <span className="sr-only sm:not-sr-only">Call</span>
                </a>
              ) : null}

              {!provider.instagram && !provider.email && !provider.phone ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-[#e2d7c8] bg-[#fbf7ef] px-4 py-3 text-sm font-semibold text-[#8a8277] sm:col-span-3">
                  <Globe className="h-4 w-4" strokeWidth={1.8} />
                  Contact info coming soon
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-[#8a8277]">
            Willa provider profiles are preview listings while the directory is
            being built.
          </p>
        </div>
      </div>
    </div>
  )
}