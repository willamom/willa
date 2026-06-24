import BetaNotice from '@/components/common/BetaNotice'
import MedicalDisclaimer from '@/components/common/MedicalDisclaimer'
import GuideLibrary from '@/components/guides/GuideLibrary'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

import { guides } from '@/data/guides'
import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `Guides | ${siteConfig.name}`,
  description:
    'Clear, mom-first guides for pregnancy, birth, postpartum, feeding, registry planning, and support.',
}

type GuidesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function getStringParam(
  params: Record<string, string | string[] | undefined> | undefined,
  key: string
) {
  const value = params?.[key]

  if (Array.isArray(value)) return value[0]

  return value
}

function getExactCategoryMatch(query: string) {
  const categories = Array.from(new Set(guides.map((guide) => guide.category)))

  return categories.find(
    (category) => category.toLowerCase() === query.trim().toLowerCase()
  )
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams

  const queryParam = getStringParam(params, 'query') || ''
  const categoryParam = getStringParam(params, 'category')

  const matchedCategory = queryParam
    ? getExactCategoryMatch(queryParam)
    : undefined

  const initialCategory = categoryParam || matchedCategory || 'All'
  const initialQuery = matchedCategory ? '' : queryParam

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <section className="px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[3rem] bg-[#f2ece2] px-6 py-12 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:px-10 lg:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#39472c]">
                Willa Guides
              </p>

              <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
                Clear answers for pregnancy, birth, and postpartum.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f574d]">
                Search the question on your mind. Save what matters, then turn
                it into your care plan, registry ideas, and support list.
              </p>
            </div>

            <div className="mt-6">
              <BetaNotice />
            </div>

            <GuideLibrary
              guides={guides}
              initialQuery={initialQuery}
              initialCategory={initialCategory}
            />

            <div className="mt-8">
              <MedicalDisclaimer />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}