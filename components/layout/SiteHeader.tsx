import Link from 'next/link'

import AuthButton from '@/components/auth/AuthButton'

const navLinks = [
  {
    label: 'Guides',
    href: '/guides',
  },
  {
    label: 'Care Plan',
    href: '/profile#care-plan',
  },
  {
    label: 'Registry',
    href: '/registry',
  },
  {
    label: 'Find Support',
    href: '/near-me',
  },
  {
    label: 'Profile',
    href: '/profile',
  },
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eee6da] bg-[#fbf7ef]/94 px-4 py-4 shadow-[0_10px_35px_rgba(61,50,38,0.035)] backdrop-blur-xl sm:px-8 lg:px-14">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0 font-serif text-4xl font-semibold tracking-tight text-[#39472c] transition hover:text-[#4f5d3d]"
        >
          willa
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[#211f1b] lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#56643f]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center">
          <AuthButton />
        </div>
      </div>

      <nav className="mx-auto mt-4 flex max-w-7xl gap-2 overflow-x-auto pb-1 lg:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full border border-[#e2d7c8] bg-[#f8f3eb] px-4 py-2 text-xs font-semibold text-[#5f574d] transition hover:border-[#4f5d3d] hover:bg-[#eef0e6] hover:text-[#4f5d3d]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}