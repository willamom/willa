import { Suspense } from 'react'

import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import HeroSection from '@/components/home/HeroSection'
import WillaPillarsSection from '@/components/home/WillaPillarsSection'
import FindSupportSection from '@/components/home/FindSupportSection'
import AnswerSearchSection from '@/components/home/AnswerSearchSection'
import ClosedBetaGate from '@/components/beta/ClosedBetaGate'

import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `${siteConfig.name} | Mom-first pregnancy, birth, and postpartum support`,
  description:
    'Willa helps mothers prepare for pregnancy, birth, postpartum, and real-life support with practical guides, provider discovery, care planning, registry ideas, and saved resources.',
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <Suspense fallback={null}>
        <ClosedBetaGate />
      </Suspense>

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <HeroSection />

        <WillaPillarsSection />
        <FindSupportSection />
        <AnswerSearchSection />
      </main>

      <SiteFooter />
    </>
  )
}