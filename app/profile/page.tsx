import { cookies } from 'next/headers'

import BetaNotice from '@/components/common/BetaNotice'
import MedicalDisclaimer from '@/components/common/MedicalDisclaimer'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import CarePlanChecklist from '@/components/profile/CarePlanChecklist'
import NearMePreview from '@/components/profile/NearMePreview'
import PregnancySnapshot from '@/components/profile/PregnancySnapshot'
import ProfileHero from '@/components/profile/ProfileHero'
import ProfileNextSteps from '@/components/profile/ProfileNextSteps'
import RegistryIdeas from '@/components/profile/RegistryIdeas'
import SavedGuidesFromStorage from '@/components/profile/SavedGuidesFromStorage'
import SavedQuestions from '@/components/profile/SavedQuestions'
import SuggestedCareTasksFromSavedGuides from '@/components/profile/SuggestedCareTasksFromSavedGuides'
import SuggestedGuides from '@/components/profile/SuggestedGuides'
import ThisWeekFocus from '@/components/profile/ThisWeekFocus'
import WillaOverview from '@/components/profile/WillaOverview'

import { getPregnancyProgress } from '@/lib/pregnancy'
import { getProfileFromSearchParams } from '@/lib/profile'
import { siteConfig } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

const PROFILE_COOKIE_KEY = 'willa_profile_preview'

export const metadata = {
  title: `My Willa | ${siteConfig.name}`,
  description:
    'Your mom-first pregnancy and postpartum planning space with saved guides, care tasks, registry ideas, and support options.',
}

type ProfilePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = (await searchParams) ?? {}
  const cookieStore = await cookies()
  const profileCookie = cookieStore.get(PROFILE_COOKIE_KEY)?.value

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profileSource = profileCookie

  if (user) {
    const { data: savedProfile } = await supabase
      .from('willa_profiles')
      .select('name, due_date, location, baby_number, concerns')
      .eq('user_id', user.id)
      .maybeSingle()

    if (savedProfile) {
      profileSource = encodeURIComponent(
        JSON.stringify({
          name: savedProfile.name || '',
          dueDate: savedProfile.due_date || '',
          location: savedProfile.location || '',
          babyNumber: savedProfile.baby_number || '',
          concerns: Array.isArray(savedProfile.concerns)
            ? savedProfile.concerns
            : [],
        })
      )
    }
  }

  const profile = getProfileFromSearchParams(params, profileSource)
  const pregnancy = getPregnancyProgress(profile.dueDate)

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <ProfileHero profile={profile} pregnancy={pregnancy} />

            <div className="mt-6">
              <BetaNotice />
            </div>

            <WillaOverview />

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-6">
                <PregnancySnapshot pregnancy={pregnancy} />
                <ThisWeekFocus items={profile.focusItems} />
                <SavedQuestions questions={profile.savedQuestions} />
                <SavedGuidesFromStorage />
              </div>

              <div className="space-y-6">
                <CarePlanChecklist
                  beforeBabyTasks={profile.beforeBabyTasks}
                  afterBabyTasks={profile.afterBabyTasks}
                />

                <SuggestedCareTasksFromSavedGuides />

                <SuggestedGuides guides={profile.suggestedGuides} />
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <RegistryIdeas ideas={profile.registryIdeas} />
              <NearMePreview providers={profile.nearMeProviders} />
            </div>

            <div className="mt-8">
              <MedicalDisclaimer />
            </div>

            <ProfileNextSteps />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}