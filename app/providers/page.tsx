import ProviderDirectory from '@/components/providers/ProviderDirectory'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { getPublishedProviders } from '@/lib/providers'

export const metadata = {
  title: 'Find Support Near You | Willa',
  description:
    'Find pregnancy, birth, postpartum, and motherhood support near you.',
}

export default async function ProvidersPage() {
  const providers = await getPublishedProviders()

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef]">
        <ProviderDirectory providers={providers} />
      </main>

      <SiteFooter />
    </>
  )
}