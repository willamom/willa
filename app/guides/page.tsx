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
        <section className="px-4 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] bg-[#f2ece2] px-5 py-10 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:rounded-[3rem] sm:px-10 sm:py-12 lg:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#39472c]">
                Willa Guides
              </p>

              <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-6xl sm:leading-tight">
                Clear answers for pregnancy, birth, and postpartum.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#5f574d] sm:text-lg sm:leading-8">
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
