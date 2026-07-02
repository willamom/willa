'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AlertTriangle,
  ClipboardCheck,
  ExternalLink,
  LayoutDashboard,
  Mail,
  MapPinned,
  Plus,
  ShoppingBag,
} from 'lucide-react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Providers',
    href: '/admin/providers',
    icon: MapPinned,
  },
  {
    label: 'Quality',
    href: '/admin/providers/quality',
    icon: AlertTriangle,
  },
  {
    label: 'Claims',
    href: '/admin/provider-claims',
    icon: ClipboardCheck,
  },
  {
    label: 'Inquiries',
    href: '/admin/provider-inquiries',
    icon: Mail,
  },
  {
    label: 'Products',
    href: '/admin/affiliate-products',
    icon: ShoppingBag,
  },
]

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-[#e2d7c8] bg-[#fbf7ef]/92 px-5 py-3 text-[#211f1b] backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link href="/admin" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4f5d3d] font-serif text-lg text-white">
            W
          </div>

          <div>
            <p className="font-serif text-xl leading-none text-[#211f1b]">
              Willa
            </p>

            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#8a8277]">
              Admin
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActivePath(pathname, item.href, item.exact)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition',
                  active
                    ? 'bg-[#4f5d3d] text-white shadow-sm'
                    : 'bg-white/65 text-[#655d52] hover:bg-white hover:text-[#211f1b]',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                {item.label}
              </Link>
            )
          })}

          <Link
            href="/providers"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3.5 py-2 text-sm font-semibold text-[#655d52] transition hover:bg-white hover:text-[#211f1b]"
          >
            Public
            <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
          </Link>

          <Link
            href="/admin/providers/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#a45f51] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#8f5145]"
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            New provider
          </Link>
        </nav>
      </div>
    </header>
  )
}