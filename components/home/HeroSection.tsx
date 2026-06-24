import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbf7ef]">
      <div className="absolute inset-y-0 right-0 hidden w-[62vw] lg:block">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/images/willa-hero.png')",
            backgroundPosition: '58% center',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#fbf7ef] via-[#fbf7ef]/38 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[44%] bg-gradient-to-r from-[#fbf7ef] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fbf7ef] via-[#fbf7ef]/72 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#fbf7ef]/25 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl px-5 pb-10 pt-8 sm:px-8 sm:pb-14 lg:min-h-[640px] lg:grid-cols-[0.88fr_1.12fr] lg:px-14 lg:py-0">
        <div className="z-10 flex items-center lg:pr-12">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c] sm:tracking-[0.34em]">
              Pregnancy, birth & postpartum
            </p>

            <h1 className="font-serif text-[3.05rem] leading-[1.03] tracking-tight text-[#211f1b] sm:text-6xl lg:text-[4.75rem]">
              The answers you need at{' '}
              <span className="italic text-[#a45f51]">3:07am</span>.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-[#48443d] sm:text-lg sm:leading-8">
              Willa helps you through pregnancy, birth, and postpartum with
              trusted guides, a personal care plan, and the right support.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/start"
                className="rounded-xl bg-[#4f5d3d] px-8 py-4 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#414d31]"
              >
                Start my Willa
              </Link>

              <Link
                href="/guides"
                className="rounded-xl border border-[#c8bdae] bg-white/70 px-8 py-4 text-center text-sm font-semibold text-[#211f1b] shadow-sm transition hover:bg-white"
              >
                Explore guides
              </Link>
            </div>

            <div className="mt-8 rounded-3xl bg-white/70 p-4 shadow-[0_12px_35px_rgba(61,50,38,0.04)] backdrop-blur-sm sm:max-w-md">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <Avatar color="bg-[#d8b8a9]" />
                  <Avatar color="bg-[#b7aa98]" />
                  <Avatar color="bg-[#8f8170]" />
                  <Avatar color="bg-[#d7c0b2]" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#211f1b]">
                    Built around mom, not just baby.
                  </p>
                  <p className="text-sm text-[#655d52]">
                    Guides, saved questions, care tasks, and support ideas in
                    one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 max-w-sm border-l border-[#d8cbbb] pl-5">
              <p className="font-serif text-xl leading-snug text-[#211f1b]">
                The fourth trimester deserves a plan.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#655d52]">
                You do not have to piece it together alone.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block" />

        <div className="relative mt-9 min-h-[335px] overflow-hidden rounded-[2.25rem] bg-[#d9c9b8] shadow-[0_20px_60px_rgba(61,50,38,0.08)] sm:min-h-[430px] lg:hidden">
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

function Avatar({ color }: { color: string }) {
  return (
    <div
      className={`h-10 w-10 rounded-full border-2 border-[#fbf7ef] sm:h-11 sm:w-11 ${color}`}
    />
  )
}