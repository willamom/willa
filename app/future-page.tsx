import BetaNotice from '@/components/common/BetaNotice'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import HeroSection from '@/components/home/HeroSection'
import AnswerSearchSection from '@/components/home/AnswerSearchSection'
import WillaPillarsSection from '@/components/home/WillaPillarsSection'
import CarePlanPreviewSection from '@/components/home/CarePlanPreviewSection'
import TrustSection from '@/components/home/TrustSection'

import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `${siteConfig.name} | Mom-first pregnancy and postpartum planning`,
  description:
    'Willa helps mothers prepare for pregnancy, birth, postpartum, and support with trusted guides, a care plan, registry ideas, and saved resources.',
}

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-[#4f5d3d] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main
        id="main-content"
        className="min-h-screen bg-[#fbf7ef] text-[#211f1b]"
      >
        <HeroSection />

        <section className="px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <BetaNotice />
          </div>
        </section>

        <AnswerSearchSection />
        <WillaPillarsSection />
        <CarePlanPreviewSection />
        <TrustSection />
      </main>

      <SiteFooter />
    </>
  )
}