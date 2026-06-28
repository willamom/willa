import Link from 'next/link'
import { notFound } from 'next/navigation'

import ProviderForm from '@/components/admin/providers/ProviderForm'
import {
  getAdminProviderById,
  updateProviderAction,
} from '@/lib/admin/providers'

type EditProviderPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata = {
  title: 'Edit Provider | Willa Admin',
}

export default async function EditProviderPage({
  params,
}: EditProviderPageProps) {
  const { id } = await params
  const provider = await getAdminProviderById(id)

  if (!provider) {
    notFound()
  }

  const action = updateProviderAction.bind(null, provider.id)

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-14">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/admin/providers"
          className="text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
        >
          ← Back to providers
        </Link>

        <h1 className="mt-5 font-serif text-5xl leading-tight">
          Edit provider
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
          Update this provider listing.
        </p>

        <div className="mt-8">
          <ProviderForm
            provider={provider}
            action={action}
            submitLabel="Save provider"
          />
        </div>
      </section>
    </main>
  )
}