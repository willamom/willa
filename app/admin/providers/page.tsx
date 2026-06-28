import AdminProvidersTable from '@/components/admin/providers/AdminProvidersTable'
import {
  getAdminProviders,
  updateProviderFeaturedAction,
  updateProviderStatusAction,
  updateProviderVerifiedAction,
} from '@/lib/admin/providers'

export const metadata = {
  title: 'Providers Admin | Willa',
}

export default async function AdminProvidersPage() {
  const providers = await getAdminProviders()

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <AdminProvidersTable
          providers={providers}
          updateStatusAction={updateProviderStatusAction}
          updateFeaturedAction={updateProviderFeaturedAction}
          updateVerifiedAction={updateProviderVerifiedAction}
        />
      </div>
    </main>
  )
}