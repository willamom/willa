import ProviderDirectory from '@/components/providers/ProviderDirectory'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { providerCategories } from '@/data/providers/categories'
import { getPublishedProviders } from '@/lib/providers'
import type { ProviderCategory } from '@/types/providers'

type ProvidersPageProps = {
  searchParams: Promise<{
    category?: string
    q?: string
    query?: string
  }>
}

function getInitialCategory(value?: string): ProviderCategory | 'all' {
  if (
    value &&
    providerCategories.some((category) => category.slug === value)
  ) {
    return value as ProviderCategory
  }

  return 'all'
}

export const metadata = {
  title: 'Find Support Near You | Willa',
  description:
    'Find pregnancy, birth, postpartum, and motherhood support near you.',
}

export default async function ProvidersPage({
  searchParams,
}: ProvidersPageProps) {
  const params = await searchParams
  const providers = await getPublishedProviders()

  const initialCategory = getInitialCategory(params.category)
  const initialQuery = (params.q ?? params.query ?? '').trim()

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef]">
        <ProviderDirectory
          providers={providers}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
        />
      </main>

      <SiteFooter />
    </>
  )
}