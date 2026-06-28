import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import SaveGuideButton from '@/components/guides/SaveGuideButton'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

import { guides } from '@/data/guides'
import { siteConfig } from '@/lib/site'

type GuidePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = guides.find((item) => item.slug === slug)

  if (!guide) {
    return {
      title: `Guide not found | ${siteConfig.name}`,
    }
  }

  const title = guide.seoTitle ?? `${guide.title} | ${siteConfig.name}`
  const description = guide.seoDescription ?? guide.description
  const imageUrl = guide.image ? `${siteConfig.url}${guide.image.src}` : null

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteConfig.url}/guides/${guide.slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: guide.image?.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = guides.find((item) => item.slug === slug)

  if (!guide) {
    notFound()
  }

  const relatedGuides = guides
    .filter(
      (item) => item.slug !== guide.slug && item.category === guide.category
    )
    .slice(0, 3)

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <article className="px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/guides"
              className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#4f5d3d] shadow-sm transition hover:bg-[#f8f3eb] hover:text-[#211f1b]"
            >
              ← Back to guides
            </Link>

            <header className="relative mt-6 overflow-hidden rounded-[2.25rem] bg-[#f2ece2] px-5 py-9 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:rounded-[3rem] sm:px-10 sm:py-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#eadfd4]/70 blur-3xl" />
              <div className="absolute -bottom-28 left-1/2 h-72 w-72 rounded-full bg-[#f5ded5]/55 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#f5ded5] px-3 py-1 text-xs font-semibold text-[#a45f51]">
                    {guide.category}
                  </span>

                  <span className="rounded-full bg-[#fbf7ef]/85 px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
                    {guide.stage}
                  </span>

                  <span className="rounded-full bg-[#fbf7ef]/85 px-3 py-1 text-xs font-semibold text-[#655d52]">
                    {guide.readTime}
                  </span>
                </div>

                <h1 className="mt-6 font-serif text-4xl leading-tight tracking-tight text-[#211f1b] sm:text-6xl">
                  {guide.title}
                </h1>

                <p className="mt-6 text-base leading-7 text-[#5f574d] sm:text-lg sm:leading-8">
                  {guide.description}
                </p>

                <div className="mt-7">
                  <SaveGuideButton
                    guide={{
                      slug: guide.slug,
                      title: guide.title,
                      description: guide.description,
                      category: guide.category,
                      readTime: guide.readTime,
                    }}
                  />
                </div>
              </div>
            </header>

            {guide.image ? (
              <div className="mt-8 overflow-hidden rounded-[2rem] bg-[#f2ece2] shadow-[0_22px_70px_rgba(61,50,38,0.08)]">
                <Image
                  src={guide.image.src}
                  alt={guide.image.alt}
                  width={1600}
                  height={900}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : null}

            {guide.intro && guide.intro.length > 0 ? (
              <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.06)] sm:p-8">
                <div className="space-y-5 text-base leading-8 text-[#5f574d]">
                  {guide.intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-8 space-y-6">
              {guide.sections.map((section, index) => (
                <section
                  key={section.heading}
                  className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.06)] sm:p-8"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a45f51]">
                    Part {index + 1}
                  </p>

                  <h2 className="mt-3 font-serif text-3xl leading-tight text-[#211f1b]">
                    {section.heading}
                  </h2>

                  <GuideBody body={section.body} />

                  {section.bullets && section.bullets.length > 0 ? (
                    <ul className="mt-5 space-y-3">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 text-base leading-7 text-[#5f574d]"
                        >
                          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f5ded5] text-xs font-bold text-[#a45f51]">
                            ✓
                          </span>

                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.related ? (
                    <div className="mt-6 rounded-2xl bg-[#f8f3eb] px-5 py-4 text-sm leading-6 text-[#655d52]">
                      <span className="font-semibold text-[#211f1b]">
                        Related:
                      </span>{' '}
                      {section.related}
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            {guide.closing && guide.closing.length > 0 ? (
              <section className="mt-8 rounded-[2rem] bg-[#f2ece2] p-6 shadow-[0_18px_55px_rgba(61,50,38,0.05)] sm:p-8">
                <div className="space-y-5 text-base leading-8 text-[#5f574d]">
                  {guide.closing.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-8 rounded-[2rem] border border-[#e2d7c8] bg-white/70 p-6 shadow-[0_14px_45px_rgba(61,50,38,0.045)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
                Gentle note
              </p>

              <p className="mt-3 text-sm leading-6 text-[#5f574d]">
                Willa guides are here to help you organize your thoughts,
                questions, and support. They are not medical advice and do not
                replace your doctor, midwife, lactation consultant, therapist,
                or emergency care.
              </p>
            </section>

            {relatedGuides.length > 0 ? (
              <section className="mt-8 rounded-[2rem] bg-[#f2ece2] p-6 shadow-[0_18px_55px_rgba(61,50,38,0.05)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
                      Keep reading
                    </p>

                    <h2 className="mt-3 font-serif text-3xl text-[#211f1b]">
                      More in {guide.category}
                    </h2>
                  </div>

                  <Link
                    href="/guides"
                    className="text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
                  >
                    Browse all guides →
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {relatedGuides.map((relatedGuide) => (
                    <Link
                      key={relatedGuide.slug}
                      href={`/guides/${relatedGuide.slug}`}
                      className="flex h-full min-h-[10rem] flex-col rounded-2xl bg-[#fbf7ef]/85 p-5 transition hover:bg-white"
                    >
                      <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#a45f51]">
                        {relatedGuide.readTime}
                      </span>

                      <p className="mt-4 flex-1 font-serif text-xl leading-tight text-[#211f1b]">
                        {relatedGuide.title}
                      </p>

                      <p className="mt-4 text-sm font-semibold text-[#4f5d3d]">
                        Read guide →
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/guides"
                className="rounded-xl bg-[#4f5d3d] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#414d31]"
              >
                Back to guide library
              </Link>

              <Link
                href="/profile"
                className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#fffdf9] hover:text-[#211f1b]"
              >
                Go to my Willa
              </Link>
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  )
}

function GuideBody({ body }: { body: string | string[] }) {
  const paragraphs = Array.isArray(body) ? body : [body]

  return (
    <div className="mt-4 space-y-5 text-base leading-8 text-[#5f574d]">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}