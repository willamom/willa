import AdminAffiliateProductsTable from '@/components/admin/affiliate-products/AdminAffiliateProductsTable'
import {
  getAdminAffiliateProducts,
  updateAffiliateProductFeaturedAction,
  updateAffiliateProductStatusAction,
} from '@/lib/admin/affiliate-products'

export const metadata = {
  title: 'Affiliate Products Admin | Willa',
}

export default async function AdminAffiliateProductsPage() {
  const products = await getAdminAffiliateProducts()

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <AdminAffiliateProductsTable
          products={products}
          updateStatusAction={updateAffiliateProductStatusAction}
          updateFeaturedAction={updateAffiliateProductFeaturedAction}
        />
      </div>
    </main>
  )
}