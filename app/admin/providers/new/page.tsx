import Link from 'next/link'

import ProviderForm from '@/components/admin/providers/ProviderForm'
import { createProviderAction } from '@/lib/admin/providers'

export const metadata = {
  title: 'New Provider | Willa Admin',
}

export default function NewProviderPage() {
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
          New provider
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
          Add a new provider to the Willa directory.
        </p>

        <div className="mt-8">
          <ProviderForm
            action={createProviderAction}
            submitLabel="Create provider"
          />
        </div>
      </section>
    </main>
  )
}