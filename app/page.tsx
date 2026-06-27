import Link from 'next/link'
import type { IconType } from 'react-icons'
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6'

import ComingSoonWaitlist from '@/components/waitlist/ComingSoonWaitlist'
import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `${siteConfig.name} | Coming soon`,
  description:
    'Willa is a mom-first space for pregnancy, birth, postpartum guides, care planning, registry ideas, and support.',
}

const previewItems = [
  {
    title: 'Learn',
    description: 'Practical guides from pregnancy to postpartum.',
  },
  {
    title: 'Plan',
    description: 'Keep track of what matters, from appointments to recovery.',
  },
  {
    title: 'Save',
    description:
      'Collect registry ideas, checklists, and resources all in one place.',
  },
]

const socialLinks: Array<{
  label: string
  href: string
  Icon: IconType
}> = [
  { label: 'TikTok', href: siteConfig.social.tiktok, Icon: FaTiktok },
  { label: 'Instagram', href: siteConfig.social.instagram, Icon: FaInstagram },
  { label: 'Pinterest', href: siteConfig.social.pinterest, Icon: FaPinterestP },
  { label: 'Facebook', href: siteConfig.social.facebook, Icon: FaFacebookF },
  { label: 'X', href: siteConfig.social.x, Icon: FaXTwitter },
]

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7ef] text-[#211f1b]">
      <section className="relative min-h-screen px-5 py-6 sm:px-8 lg:px-14">
        <div className="absolute -right-32 top-20 h-[28rem] w-[28rem] rounded-full bg-[#eadfd4]/60 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#f5ded5]/55 blur-3xl" />

        <header className="relative mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="font-serif text-4xl font-semibold tracking-tight text-[#39472c]"
          >
            willa
          </Link>
        </header>

        <div className="relative mx-auto grid max-w-7xl gap-10 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:pt-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c] sm:tracking-[0.34em]">
              Pregnancy · Birth · Postpartum
            </p>

            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.03] tracking-tight text-[#211f1b] sm:text-6xl lg:text-[5rem]">
              Everyone prepares for baby.{' '}
              <span className="italic text-[#a45f51]">
                Willa prepares you.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-[#5f574d] sm:text-lg sm:leading-8">
              Honest guides, practical checklists, registry ideas, and support
              for every stage of pregnancy, birth, and postpartum.
            </p>

            <ComingSoonWaitlist />

            <p className="mt-5 max-w-xl text-sm leading-6 text-[#8a8277]">
              The nursery is only one part of getting ready. Willa is here for
              the rest.
            </p>
          </div>

          <div className="rounded-[2.5rem] bg-[#f2ece2]/82 p-5 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:p-7 lg:p-8">
            <div className="rounded-[2rem] bg-white/80 p-5 shadow-[0_16px_50px_rgba(61,50,38,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a45f51]">
                A first look
              </p>

              <p className="mt-4 font-serif text-3xl leading-tight text-[#211f1b]">
                For every part of becoming a mom.
              </p>

              <div className="mt-6 space-y-3">
                {previewItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-[#f8f3eb] p-4"
                  >
                    <p className="text-sm font-semibold text-[#211f1b]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#655d52]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[#eadfd4] bg-[#fbf7ef] p-4">
                <p className="font-serif text-xl leading-snug text-[#211f1b]">
                  Preparing for motherhood starts here.
                </p>

                <p className="mt-2 text-sm leading-6 text-[#655d52]">
                  From pregnancy to postpartum, we&apos;re with you every step
                  of the way.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="relative mx-auto mt-16 max-w-7xl border-t border-[#e8ded1] pt-6 text-sm text-[#655d52]">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-4">
              <Link
                href="/privacy"
                className="transition hover:text-[#211f1b]"
              >
                Privacy
              </Link>

              <Link href="/terms" className="transition hover:text-[#211f1b]">
                Terms
              </Link>

              <Link
                href="/cookies"
                className="transition hover:text-[#211f1b]"
              >
                Cookies
              </Link>

              <Link
                href="/disclaimer"
                className="transition hover:text-[#211f1b]"
              >
                Disclaimer
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-9 w-9 items-center justify-center rounded-full bg-white/65 text-[#4f5d3d] shadow-[0_8px_20px_rgba(61,50,38,0.035)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[#211f1b]"
                >
                  <Icon className="h-3.5 w-3.5 transition group-hover:scale-105" />
                </a>
              ))}
            </div>

            <p className="text-sm text-[#655d52]">
              © {new Date().getFullYear()} Willa. All rights reserved.
            </p>
          </div>
        </footer>
      </section>
    </main>
  )
}