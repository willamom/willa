import Link from 'next/link'
import type { IconType } from 'react-icons'
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6'

import { siteConfig } from '@/lib/site'

type FooterLink = {
  label: string
  href: string
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: 'Guides',
    links: [
      { label: 'All guides', href: '/guides' },
      { label: 'Pregnancy', href: '/guides?category=Pregnancy' },
      { label: 'Birth', href: '/guides?category=Birth' },
      { label: 'Postpartum', href: '/guides?category=Postpartum' },
      { label: 'Feeding', href: '/guides?category=Feeding' },
    ],
  },
  {
    title: 'Willa',
    links: [
      { label: 'Profile', href: '/profile' },
      { label: 'Care Plan', href: '/profile#care-plan' },
      { label: 'Registry', href: '/registry' },
      { label: 'Find Support', href: '/near-me' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      {
        label: 'For Professionals',
        href: `mailto:${siteConfig.email}?subject=Professional%20listing%20on%20Willa`,
      },
      { label: 'Contact', href: `mailto:${siteConfig.email}` },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
]

const socialLinks: Array<{
  label: string
  href: string
  Icon: IconType
}> = [
  { label: 'TikTok', href: '#', Icon: FaTiktok },
  { label: 'Instagram', href: '#', Icon: FaInstagram },
  { label: 'Pinterest', href: '#', Icon: FaPinterestP },
  { label: 'Facebook', href: '#', Icon: FaFacebookF },
  { label: 'X', href: '#', Icon: FaXTwitter },
]

export default function SiteFooter() {
  return (
    <footer className="bg-[#f4ede3] px-5 pb-8 pt-12 sm:px-8 lg:px-14 lg:pt-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1.15fr] lg:gap-14">
          <div>
            <Link
              href="/"
              className="font-serif text-5xl font-semibold tracking-tight text-[#39472c] transition hover:text-[#4f5d3d]"
            >
              willa
            </Link>

            <p className="mt-5 max-w-md text-base leading-7 text-[#5f574d]">
              Clear answers, care planning, and support for pregnancy, birth,
              postpartum, and the fourth trimester.
            </p>

            <div className="mt-7 max-w-xl rounded-3xl bg-[#fbf7ef]/75 p-5 shadow-[0_14px_45px_rgba(61,50,38,0.05)]">
              <p className="font-serif text-2xl leading-tight text-[#211f1b]">
                Today: answers.
                <br />
                Tomorrow: your care plan.
              </p>

              <p className="mt-3 text-sm leading-6 text-[#655d52]">
                Willa starts with guides, then helps mothers turn what they
                learn into real support.
              </p>
            </div>
          </div>

          <div>
            <div className="hidden gap-8 lg:grid lg:grid-cols-4">
              {footerSections.map((section) => (
                <FooterSectionBlock key={section.title} section={section} />
              ))}
            </div>

            <div className="space-y-3 lg:hidden">
              {footerSections.map((section, index) => (
                <details
                  key={section.title}
                  className="group rounded-2xl bg-[#fbf7ef]/70 px-4 py-3 shadow-[0_10px_30px_rgba(61,50,38,0.035)]"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
                    {section.title}

                    <span className="text-base leading-none text-[#a45f51] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="mt-4 space-y-3 pb-1">
                    {section.links.map((link) => (
                      <FooterLinkItem key={link.label} link={link} />
                    ))}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-9">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
                Follow Willa
              </h3>

              <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-5">
                {socialLinks.map(({ label, href, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fbf7ef]/85 text-[#4f5d3d] shadow-[0_10px_25px_rgba(61,50,38,0.045)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[#211f1b]"
                  >
                    <Icon className="h-4 w-4 transition group-hover:scale-105" />
                  </Link>
                ))}
              </div>

              <p className="mt-4 text-xs leading-5 text-[#6d6459]">
                Social links are ready for launch handles when you connect
                them.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#ded3c3] pt-6">
          <div className="flex flex-col gap-5 text-xs leading-6 text-[#6d6459] md:flex-row md:items-start md:justify-between">
            <p className="shrink-0">
              © {new Date().getFullYear()} Willa. All rights reserved.
            </p>

            <p className="max-w-2xl">
              Willa shares practical education and planning tools. It is not a
              substitute for medical advice, diagnosis, treatment, emergency
              support, or care from a qualified professional.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6d6459]">
            <Link href="/privacy" className="transition hover:text-[#211f1b]">
              Privacy
            </Link>

            <Link href="/terms" className="transition hover:text-[#211f1b]">
              Terms
            </Link>

            <Link href="/cookies" className="transition hover:text-[#211f1b]">
              Cookies
            </Link>

            <Link
              href="/disclaimer"
              className="transition hover:text-[#211f1b]"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterSectionBlock({ section }: { section: FooterSection }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
        {section.title}
      </h3>

      <div className="mt-4 space-y-3">
        {section.links.map((link) => (
          <FooterLinkItem key={link.label} link={link} />
        ))}
      </div>
    </div>
  )
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <Link
      href={link.href}
      className="block text-sm text-[#5f574d] transition hover:text-[#211f1b]"
    >
      {link.label}
    </Link>
  )
}