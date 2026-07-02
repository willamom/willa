import AffiliateProductForm from '@/components/admin/affiliate-products/AffiliateProductForm'
import {
  getAdminAffiliateProductById,
  updateAffiliateProductAction,
} from '@/lib/admin/affiliate-products'

type EditAffiliateProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata = {
  title: 'Edit Affiliate Product | Willa',
}

export default async function EditAffiliateProductPage({
  params,
}: EditAffiliateProductPageProps) {
  const { id } = await params
  const product = await getAdminAffiliateProductById(id)

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
            Affiliate products
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#211f1b]">
            Edit product
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
            Update the product details, affiliate link, category, image, and
            guide placement notes.
          </p>
        </div>

        <AffiliateProductForm
          product={product}
          action={updateAffiliateProductAction}
          submitLabel="Save product"
        />
      </div>
    </main>
  )
}