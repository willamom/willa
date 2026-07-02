import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbf7ef]">
      <div className="absolute inset-y-0 right-0 hidden w-[58vw] lg:block">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/images/willa-hero.png')",
            backgroundPosition: '58% center',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#fbf7ef] via-[#fbf7ef]/48 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[44%] bg-gradient-to-r from-[#fbf7ef] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fbf7ef] via-[#fbf7ef]/74 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#fbf7ef]/25 to-transparent" />
      </div>

      <div className="relative grid max-w-[92rem] px-4 pb-12 pt-9 sm:px-8 sm:pb-16 lg:ml-0 lg:min-h-[660px] lg:grid-cols-[0.98fr_1.02fr] lg:px-8 lg:py-0 xl:px-10">
        <div className="z-10 flex items-center lg:pl-6 lg:pr-16 xl:pl-8 xl:pr-20">
          <div className="max-w-[48rem]">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c] sm:tracking-[0.34em]">
              Pregnancy, birth & postpartum
            </p>

            <h1 className="max-w-[48rem] font-serif text-[2.72rem] leading-[1.02] tracking-tight text-[#211f1b] sm:text-[3.75rem] sm:leading-[0.98] lg:text-[3.85rem] xl:text-[4rem]">
              <span className="block lg:whitespace-nowrap">
                Motherhood doesn&apos;t come with
              </span>

              <span className="block">a manual.</span>

              <span className="mt-2 block lg:whitespace-nowrap">
                But it can come with
              </span>

              <span className="block">
                a <span className="italic text-[#a45f51]">village</span>.
              </span>
            </h1>

            <p className="mt-7 max-w-[40rem] text-base leading-8 text-[#48443d] sm:text-lg">
              Willa brings together practical guides, local support, care
              planning, and registry ideas built for moms as well as babies.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/guides"
                className="rounded-full bg-[#4f5d3d] px-8 py-4 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#414d31] sm:w-auto"
              >
                Explore guides
              </Link>

              <Link
                href="/providers"
                className="rounded-full border border-[#cfc3b5] bg-white/78 px-8 py-4 text-center text-sm font-semibold text-[#211f1b] shadow-sm transition hover:bg-white"
              >
                Find support near you
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden lg:block" />

        <div className="relative mt-10 min-h-[300px] overflow-hidden rounded-[1.75rem] bg-[#d9c9b8] shadow-[0_20px_60px_rgba(61,50,38,0.08)] sm:min-h-[430px] sm:rounded-[2.25rem] lg:hidden">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "url('/images/willa-hero.png')",
              backgroundPosition: '58% center',
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#fbf7ef]/42 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  )
}
