import Link from 'next/link'
import { BookOpen, Gift, MapPin, Menu, UserRound, X } from 'lucide-react'

const closedBetaHref = '/?closedBeta=1'

const navLinks = [
  {
    label: 'Guides',
    href: closedBetaHref,
    icon: BookOpen,
  },
  {
    label: 'Support',
    href: '/providers',
    icon: MapPin,
  },
  {
    label: 'Registry',
    href: closedBetaHref,
    icon: Gift,
  },
  {
    label: 'My Willa',
    href: closedBetaHref,
    icon: UserRound,
  },
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eee6da] bg-[#fbf7ef]/96 px-4 py-3 shadow-[0_10px_35px_rgba(61,50,38,0.035)] backdrop-blur-xl sm:px-8 sm:py-4 lg:px-14">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link
          href="/"
          className="shrink-0 font-serif text-[2rem] font-semibold leading-none tracking-tight text-[#39472c] transition hover:text-[#4f5d3d] sm:text-4xl"
        >
          willa
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[#211f1b] lg:flex">
          {navLinks.map((link) => (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="transition hover:text-[#56643f]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-0 shrink items-center justify-end lg:flex">
          <Link
            href={closedBetaHref}
            className="rounded-full bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
          >
            Sign in
          </Link>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2 lg:hidden">
          <Link
            href={closedBetaHref}
            className="rounded-full bg-[#4f5d3d] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#414d31]"
          >
            Sign in
          </Link>

          <details className="group relative">
            <summary
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-[#e2d7c8] bg-white/76 text-[#4f5d3d] shadow-sm transition hover:bg-white [&::-webkit-details-marker]:hidden"
              aria-label="Open navigation"
            >
              <Menu
                className="h-4 w-4 group-open:hidden"
                strokeWidth={2}
                aria-hidden="true"
              />

              <X
                className="hidden h-4 w-4 group-open:block"
                strokeWidth={2}
                aria-hidden="true"
              />
            </summary>

            <nav className="absolute right-0 top-12 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-[#e2d7c8] bg-[#fffdf8] p-2 shadow-[0_24px_70px_rgba(61,50,38,0.14)]">
              <div className="grid gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon

                  return (
                    <Link
                      key={`${link.label}-${link.href}`}
                      href={link.href}
                      className="flex items-center gap-3 rounded-[1.1rem] px-3 py-3 text-sm font-semibold text-[#3f3b35] transition hover:bg-[#eef3e6] hover:text-[#4f5d3d]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef0e6] text-[#4f5d3d]">
                        <Icon
                          className="h-4 w-4"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>

                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}