import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BadgeCheck,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'

import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import ProviderProfileInfoCard from '@/components/providers/profile/ProviderProfileInfoCard'
import ProviderProfileMiniMap from '@/components/providers/profile/ProviderProfileMiniMap'
import { getProviderCategoryConfig } from '@/data/providers/categories'
import { getProviderBySlug, getPublishedProviders } from '@/lib/providers'
import { siteConfig } from '@/lib/site'
import type { WillaProvider } from '@/types/providers'
import ProviderInquiryButton from '@/components/providers/ProviderInquiryButton'

type ProviderPageProps = {
  params: Promise<{
    slug: string
  }>
}

function getProviderImageUrl(provider: WillaProvider) {
  if (!provider.image) {
    return null
  }

  return provider.image.startsWith('http')
    ? provider.image
    : `${siteConfig.url}${provider.image}`
}

function getSafeBackgroundImage(imageUrl: string) {
  const cleanImageUrl = imageUrl.replace(/"/g, '\\"')

  return `url("${cleanImageUrl}")`
}

function getLocationLabel(provider: WillaProvider) {
  return [
    provider.location.city,
    provider.location.state,
    provider.location.country,
  ]
    .filter(Boolean)
    .join(', ')
}

function getFullAddress(provider: WillaProvider) {
  return [
    provider.location.address,
    provider.location.city,
    provider.location.state,
    provider.location.country,
  ]
    .filter(Boolean)
    .join(', ')
}

function getInstagramUrl(instagram?: string) {
  if (!instagram) {
    return undefined
  }

  if (instagram.startsWith('http')) {
    return instagram
  }

  return `https://instagram.com/${instagram.replace('@', '')}`
}

function getNearbyProviders(
  provider: WillaProvider,
  providers: WillaProvider[]
) {
  return providers
    .filter((item) => item.id !== provider.id)
    .filter((item) => {
      const sameCity =
        item.location.city.toLowerCase() ===
        provider.location.city.toLowerCase()

      const sameState =
        item.location.state &&
        provider.location.state &&
        item.location.state.toLowerCase() ===
          provider.location.state.toLowerCase()

      const sameCategory = item.category === provider.category

      return sameCity || sameState || sameCategory
    })
    .slice(0, 3)
}

export async function generateMetadata({ params }: ProviderPageProps) {
  const { slug } = await params
  const provider = await getProviderBySlug(slug)

  if (!provider) {
    return {
      title: 'Provider Not Found | Willa',
    }
  }

  const category = getProviderCategoryConfig(provider.category)
  const imageUrl = getProviderImageUrl(provider)

  const title = `${provider.name} | ${category.label} | Willa`
  const description = provider.description

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${siteConfig.url}/providers/${provider.slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: provider.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params
  const provider = await getProviderBySlug(slug)

  if (!provider) {
    notFound()
  }

  const allProviders = await getPublishedProviders()
  const nearbyProviders = getNearbyProviders(provider, allProviders)

  const category = getProviderCategoryConfig(provider.category)
  const imageUrl = getProviderImageUrl(provider)
  const locationLabel = getLocationLabel(provider)
  const fullAddress = getFullAddress(provider)
  const instagramUrl = getInstagramUrl(provider.instagram)

  const schema = {
    '@context': 'https://schema.org',
    '@type': provider.category === 'obgyn' ? 'MedicalBusiness' : 'LocalBusiness',
    name: provider.name,
    description: provider.description,
    url: `${siteConfig.url}/providers/${provider.slug}`,
    image: imageUrl ?? undefined,
    address: fullAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: provider.location.address,
          addressLocality: provider.location.city,
          addressRegion: provider.location.state,
          addressCountry: provider.location.country,
        }
      : undefined,
    geo:
      typeof provider.location.lat === 'number' &&
      typeof provider.location.lng === 'number'
        ? {
            '@type': 'GeoCoordinates',
            latitude: provider.location.lat,
            longitude: provider.location.lng,
          }
        : undefined,
    telephone: provider.phone,
    sameAs: [provider.website, instagramUrl].filter(Boolean),
  }

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          <Link
            href="/providers"
            className="text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
          >
            ← Back to provider map
          </Link>

          <ProviderHero
            provider={provider}
            categoryLabel={category.label}
            categoryColor={category.color}
            imageUrl={imageUrl}
            locationLabel={locationLabel}
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
            <div className="space-y-6">
              <section className="rounded-[2rem] border border-[#e2d7c8] bg-white p-6 shadow-[0_20px_70px_rgba(61,50,38,0.07)] sm:p-8">
                <div className="flex items-center gap-2">
                  <Sparkles
                    className="h-4 w-4 text-[#a45f51]"
                    strokeWidth={1.8}
                  />

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a8277]">
                    About this provider
                  </p>
                </div>

                <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f574d]">
                  {provider.description}
                </p>
              </section>

              {provider.specialties.length > 0 ? (
                <section className="rounded-[2rem] border border-[#e2d7c8] bg-white p-6 shadow-[0_20px_70px_rgba(61,50,38,0.07)] sm:p-8">
                  <h2 className="font-serif text-3xl text-[#211f1b]">
                    Services
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {provider.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full bg-[#f8f3eb] px-4 py-2 text-sm font-semibold text-[#655d52]"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-[2rem] border border-[#e2d7c8] bg-[#f8f3eb] p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    className="mt-1 h-5 w-5 shrink-0 text-[#4f5d3d]"
                    strokeWidth={1.8}
                  />

                  <div>
                    <h2 className="font-serif text-2xl text-[#211f1b]">
                      About this listing
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#655d52]">
                      {provider.isClaimed
                        ? 'This provider profile has been claimed. Willa still reviews updates so the directory stays useful, clear, and trustworthy.'
                        : 'Willa provider profiles are part of our early directory for pregnancy, birth, postpartum, and motherhood support. Details may be updated as providers claim or complete their profiles.'}
                    </p>
                  </div>
                </div>
              </section>

              {nearbyProviders.length > 0 ? (
                <NearbyProviders providers={nearbyProviders} />
              ) : null}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-8">
              <ProviderProfileInfoCard provider={provider} />

              <ProviderProfileMiniMap provider={provider} />

              <ClaimProviderCard provider={provider} />
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}

function ProviderHero({
  provider,
  categoryLabel,
  categoryColor,
  imageUrl,
  locationLabel,
}: {
  provider: WillaProvider
  categoryLabel: string
  categoryColor: string
  imageUrl: string | null
  locationLabel: string
}) {
  const hasImage = Boolean(imageUrl)

  return (
    <section className="mt-8 overflow-hidden rounded-[2.25rem] bg-[#eadfd4] shadow-[0_22px_70px_rgba(61,50,38,0.09)]">
      <div className="relative min-h-[26rem] overflow-hidden">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: getSafeBackgroundImage(imageUrl),
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                 'radial-gradient(circle at 16% 18%, rgba(251,247,239,0.82), transparent 34%), radial-gradient(circle at 82% 18%, rgba(240,196,183,0.82), transparent 36%), radial-gradient(circle at 74% 82%, rgba(211,184,156,0.42), transparent 34%), linear-gradient(135deg, #efe3d5 0%, #dfe5d2 42%, #f0c9bd 100%)',
            }}
          />
        )}

        {hasImage ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#211f1b]/58 via-[#211f1b]/18 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#211f1b]/30 via-transparent to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#fbf7ef]/42 via-[#fbf7ef]/8 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fbf7ef]/36 via-transparent to-[#fbf7ef]/10" />
          </>
        )}

        <div
          className={`relative z-10 flex min-h-[26rem] flex-col justify-end p-6 sm:p-8 lg:p-10 ${
            hasImage ? 'text-white' : 'text-[#211f1b]'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur-md ${
                hasImage
                  ? 'bg-white/18 text-white'
                  : 'bg-white/70 text-[#4f5d3d]'
              }`}
            >
              {categoryLabel}
            </span>

            {provider.isVerified ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                  hasImage
                    ? 'bg-white/18 text-white'
                    : 'bg-[#eef0e6] text-[#4f5d3d]'
                }`}
              >
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} />
                Verified
              </span>
            ) : null}

            {provider.isClaimed ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                  hasImage
                    ? 'bg-white/90 text-[#4f5d3d]'
                    : 'bg-white/78 text-[#4f5d3d]'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                Claimed profile
              </span>
            ) : null}

            {provider.isFeatured ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                  hasImage
                    ? 'bg-white/18 text-white'
                    : 'bg-[#f5ded5] text-[#a45f51]'
                }`}
              >
                <Star className="h-3.5 w-3.5 fill-current" strokeWidth={2} />
                Featured
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            {provider.name}
          </h1>

          <div
            className={`mt-5 flex items-center gap-2 text-sm ${
              hasImage ? 'text-white/86' : 'text-[#655d52]'
            }`}
          >
            <MapPin className="h-4 w-4" strokeWidth={1.8} />

            <span>{locationLabel}</span>
          </div>

          <p
            className={`mt-6 max-w-3xl text-base leading-7 sm:text-lg ${
              hasImage ? 'text-white/86' : 'text-[#5f574d]'
            }`}
          >
            {provider.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {provider.website ? (
              <a
                href={provider.website}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  hasImage
                    ? 'bg-white text-[#211f1b] hover:bg-[#fbf7ef]'
                    : 'bg-[#4f5d3d] text-white hover:bg-[#414d31]'
                }`}
              >
                Visit website
                <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
              </a>
            ) : null}

            {provider.email ? (
              <ProviderInquiryButton
                provider={provider}
                className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  hasImage
                    ? 'bg-white/18 text-white backdrop-blur-md hover:bg-white/28'
                    : 'bg-white/78 text-[#4f5d3d] shadow-sm hover:bg-[#eef3e6] hover:text-[#211f1b]'
                }`}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function ClaimProviderCard({ provider }: { provider: WillaProvider }) {
  return (
    <section className="rounded-[1.75rem] border border-[#e2d7c8] bg-[#f8f3eb] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        Is this your profile?
      </p>

      {provider.isClaimed ? (
        <>
          <h2 className="mt-3 font-serif text-2xl text-[#211f1b]">
            Claimed profile
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#655d52]">
            This profile has been claimed. If something needs updating, contact
            Willa and we’ll help review it.
          </p>
        </>
      ) : (
        <>
          <h2 className="mt-3 font-serif text-2xl text-[#211f1b]">
            Claim and complete it
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#655d52]">
            Providers can claim their Willa profiles, update details, add
            photos, and share more about their services.
          </p>

          <Link
            href={`/providers/claim?provider=${provider.slug}`}
            className="mt-4 inline-flex rounded-full bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
          >
            Claim this profile
          </Link>
        </>
      )}
    </section>
  )
}

function NearbyProviders({ providers }: { providers: WillaProvider[] }) {
  return (
    <section className="rounded-[2rem] border border-[#e2d7c8] bg-white p-6 shadow-[0_20px_70px_rgba(61,50,38,0.07)] sm:p-8">
      <h2 className="font-serif text-3xl text-[#211f1b]">
        More support nearby
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {providers.map((provider) => {
          const category = getProviderCategoryConfig(provider.category)

          return (
            <Link
              key={provider.id}
              href={`/providers/${provider.slug}`}
              className="rounded-[1.25rem] border border-[#eee3d6] bg-[#fbf7ef] p-4 transition hover:-translate-y-0.5 hover:bg-[#f8f3eb]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />

                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8a8277]">
                  {category.label}
                </p>
              </div>

              <h3 className="mt-3 font-serif text-xl leading-tight text-[#211f1b]">
                {provider.name}
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#655d52]">
                {provider.location.city}
                {provider.location.state
                  ? `, ${provider.location.state}`
                  : ''}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}