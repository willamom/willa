import { cookies } from 'next/headers'

import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import StartWillaForm from '@/components/start/StartWillaForm'

import { siteConfig } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

const PROFILE_COOKIE_KEY = 'willa_profile_preview'

type StartProfileData = {
  name: string
  dueDate: string
  location: string
  babyNumber: string
  concerns: string[]
}

export const metadata = {
  title: `Start my Willa | ${siteConfig.name}`,
  description:
    'Create your mom-first Willa profile for pregnancy, birth prep, postpartum planning, registry ideas, and support.',
}

export default async function StartPage() {
  const cookieStore = await cookies()
  const profileCookie = cookieStore.get(PROFILE_COOKIE_KEY)?.value

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialData = getProfileFromCookie(profileCookie)

  if (user) {
    const { data: savedProfile } = await supabase
      .from('willa_profiles')
      .select('name, due_date, location, baby_number, concerns')
      .eq('user_id', user.id)
      .maybeSingle()

    if (savedProfile) {
      initialData = {
        name: savedProfile.name || '',
        dueDate: savedProfile.due_date || '',
        location: savedProfile.location || '',
        babyNumber: savedProfile.baby_number || '',
        concerns: Array.isArray(savedProfile.concerns)
          ? savedProfile.concerns
          : [],
      }
    }
  }

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="relative overflow-hidden rounded-[2.25rem] bg-[#f2ece2] px-5 py-10 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:rounded-[3rem] sm:px-10 sm:py-12 lg:sticky lg:top-28 lg:px-12">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#eadfd4]/70 blur-3xl" />
              <div className="absolute -bottom-28 left-1/2 h-72 w-72 rounded-full bg-[#f5ded5]/55 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c] sm:tracking-[0.32em]">
                  Start my Willa
                </p>

                <h1 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-[#211f1b] sm:text-6xl">
                  Build a care plan around you.
                </h1>

                <p className="mt-6 text-base leading-7 text-[#5f574d] sm:text-lg sm:leading-8">
                  Tell Willa a little about where you are in pregnancy and what
                  you’re trying to figure out. Your profile will shape your care
                  plan, guides, registry ideas, and support suggestions.
                </p>

                <div className="mt-7 grid gap-3">
                  <StartNote title="Pregnancy week">
                    Willa tracks pregnancy by week, not just by due date.
                  </StartNote>

                  <StartNote title="Mom-first planning">
                    Save care needs, support ideas, questions, and registry
                    items for you.
                  </StartNote>

                  <StartNote title="Editable anytime">
                    Your Willa can change as your pregnancy and postpartum needs
                    change.
                  </StartNote>
                </div>
              </div>
            </div>

            <StartWillaForm initialData={initialData} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}

function StartNote({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-[#fbf7ef]/72 p-4 shadow-[0_10px_30px_rgba(61,50,38,0.035)]">
      <p className="text-sm font-semibold text-[#211f1b]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[#655d52]">{children}</p>
    </div>
  )
}

function getProfileFromCookie(
  profileCookie?: string
): StartProfileData | undefined {
  if (!profileCookie) return undefined

  try {
    return JSON.parse(decodeURIComponent(profileCookie)) as StartProfileData
  } catch {
    return undefined
  }
}