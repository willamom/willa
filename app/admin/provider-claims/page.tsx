import AdminProviderClaimsTable from '@/components/admin/provider-claims/AdminProviderClaimsTable'
import {
  getAdminProviderClaims,
  updateProviderClaimStatusAction,
} from '@/lib/admin/provider-claims'

export const metadata = {
  title: 'Provider Claims Admin | Willa',
}

export default async function AdminProviderClaimsPage() {
  const claims = await getAdminProviderClaims()

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <AdminProviderClaimsTable
          claims={claims}
          updateStatusAction={updateProviderClaimStatusAction}
        />
      </div>
    </main>
  )
}