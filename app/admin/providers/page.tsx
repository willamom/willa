import Link from 'next/link'

import {
  getAdminProviders,
  updateProviderStatusAction,
} from '@/lib/admin/providers'

export const metadata = {
  title: 'Providers Admin | Willa',
}

export default async function AdminProvidersPage() {
  const providers = await getAdminProviders()

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-14">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
              Willa admin
            </p>

            <h1 className="mt-3 font-serif text-5xl leading-tight">
              Providers
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
              Add, edit, publish, and manage provider listings for the Willa
              map.
            </p>
          </div>

          <Link
            href="/admin/providers/new"
            className="rounded-full bg-[#4f5d3d] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#414d31]"
          >
            New provider
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_55px_rgba(61,50,38,0.07)]">
          <div className="border-b border-[#eee6da] px-5 py-4 text-sm text-[#655d52]">
            {providers.length} providers
          </div>

          <div className="divide-y divide-[#eee6da]">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_12rem_12rem_8rem]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f5ded5] px-2.5 py-1 text-xs font-semibold text-[#a45f51]">
                      {provider.category}
                    </span>

                    <span className="rounded-full bg-[#f8f3eb] px-2.5 py-1 text-xs font-semibold text-[#655d52]">
                      {provider.status}
                    </span>

                    {provider.isFeatured ? (
                      <span className="rounded-full bg-[#fff2dc] px-2.5 py-1 text-xs font-semibold text-[#a45f51]">
                        Featured
                      </span>
                    ) : null}

                    {provider.isVerified ? (
                      <span className="rounded-full bg-[#eef0e6] px-2.5 py-1 text-xs font-semibold text-[#4f5d3d]">
                        Verified
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-3 font-serif text-2xl leading-tight">
                    {provider.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#655d52]">
                    {provider.description}
                  </p>

                  <p className="mt-2 text-xs text-[#8a8277]">
                    {provider.location.city}
                    {provider.location.state
                      ? `, ${provider.location.state}`
                      : ''}
                  </p>
                </div>

                <form action={updateProviderStatusAction}>
                  <input type="hidden" name="id" value={provider.id} />

                  <select
                    name="status"
                    defaultValue={provider.status}
                    className="h-11 w-full rounded-xl border border-[#e2d7c8] bg-white px-3 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-[#f8f3eb] px-3 py-2 text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#f2ece2]"
                  >
                    Save status
                  </button>
                </form>

                <div className="text-sm text-[#655d52]">
                  <p className="font-semibold text-[#211f1b]">Slug</p>
                  <p className="mt-1 break-all">{provider.slug}</p>
                </div>

                <div className="flex items-start justify-end">
                  <Link
                    href={`/admin/providers/${provider.id}/edit`}
                    className="rounded-xl bg-[#4f5d3d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#414d31]"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}

            {providers.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-[#655d52]">
                No providers yet. Create the first one.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}