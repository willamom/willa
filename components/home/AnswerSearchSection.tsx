import Link from 'next/link'
import {
  ArrowRight,
  Heart,
  Home,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const searchIdeas = [
  {
    label: "I'm home from the hospital",
    href: '/guides?q=home%20from%20hospital',
    icon: Home,
  },
  {
    label: 'Postpartum recovery',
    href: '/guides?q=postpartum%20recovery',
    icon: Heart,
  },
  {
    label: 'Feeling overwhelmed',
    href: '/guides?q=feeling%20overwhelmed',
    icon: Sparkles,
  },
  {
    label: 'Hospital bag',
    href: '/guides?q=hospital%20bag',
    icon: ShieldCheck,
  },
  {
    label: 'Sleep deprivation',
    href: '/guides?q=sleep%20deprivation',
    icon: Moon,
  },
]

export default function AnswerSearchSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbf7ef] px-4 pt-10 pb-10 sm:px-8 lg:px-14 lg:pt-12 lg:pb-12">
      <div className="absolute inset-y-0 left-0 hidden w-[42vw] lg:block">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/images/willa-start-here-mama.png')",
            backgroundPosition: 'center left',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbf7ef]/18 to-[#fbf7ef]" />
        <div className="absolute inset-y-0 right-0 w-[42%] bg-gradient-to-r from-transparent to-[#fbf7ef]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fbf7ef] via-[#fbf7ef]/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#fbf7ef] via-[#fbf7ef]/55 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:min-h-[31rem] lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
        <div className="hidden lg:block" />

        <div className="lg:pl-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c] sm:tracking-[0.34em]">
            Start here
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-[2.35rem] leading-[1.06] tracking-tight text-[#211f1b] sm:text-5xl lg:text-[3.35rem]">
            Find what you need,{' '}
            <span className="italic text-[#a45f51]">when you need it.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#48443d]">
            Search Willa’s guides by question, stage, worry, or support need.
            You don’t need the perfect plan to begin.
          </p>

          <form
            action="/guides"
            method="get"
            className="mt-8 flex max-w-3xl flex-col items-stretch gap-3 rounded-[1.5rem] border border-[#e2d7c8] bg-white/88 px-4 py-4 text-left shadow-[0_14px_40px_rgba(61,50,38,0.055)] transition focus-within:border-[#a45f51] hover:bg-white sm:flex-row sm:items-center sm:rounded-full sm:px-5 sm:py-3.5"
          >
            <Search
              className="hidden h-4 w-4 shrink-0 text-[#8a8277] sm:block"
              strokeWidth={1.8}
            />

            <input
              name="q"
              type="search"
              placeholder="Try postpartum recovery, feeding, hospital bag..."
              className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-[#211f1b] outline-none placeholder:text-[#8a8277] sm:min-h-0 sm:text-base"
            />

            <button
              type="submit"
              className="rounded-full bg-[#a45f51] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#8f5145] sm:py-2"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex max-w-3xl flex-wrap gap-2.5">
            {searchIdeas.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-[#e2d7c8] bg-white/72 px-3.5 py-2 text-xs font-semibold text-[#48443d] shadow-[0_8px_24px_rgba(61,50,38,0.025)] transition hover:border-[#a45f51] hover:bg-white hover:text-[#211f1b]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f5ded5] text-[#a45f51]">
                    <Icon className="h-3 w-3" strokeWidth={1.8} />
                  </span>

                  {item.label}
                </Link>
              )
            })}
          </div>

          <Link
            href="/guides"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
          >
            Browse all guides
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#e8d9c9] shadow-[0_20px_60px_rgba(61,50,38,0.08)] lg:hidden">
        <div
          className="min-h-[18rem] bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/willa-start-here-mama.png')",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fbf7ef] via-[#fbf7ef]/55 to-transparent" />
      </div>
    </section>
  )
}
