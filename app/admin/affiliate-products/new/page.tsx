import AffiliateProductForm from '@/components/admin/affiliate-products/AffiliateProductForm'
import { createAffiliateProductAction } from '@/lib/admin/affiliate-products'

export const metadata = {
  title: 'New Affiliate Product | Willa',
}

export default function NewAffiliateProductPage() {
  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
            Affiliate products
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#211f1b]">
            New product
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
            Add a product that can later be placed inside Willa guides, registry
            ideas, and care plan recommendations.
          </p>
        </div>

        <AffiliateProductForm
          action={createAffiliateProductAction}
          submitLabel="Create product"
        />
      </div>
    </main>
  )
}