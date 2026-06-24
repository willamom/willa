'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import {
  CARE_PLAN_UPDATED_EVENT,
  getAddedCareTasksForCurrentUser,
} from '@/lib/carePlanStorage'
import {
  getSavedGuidesForCurrentUser,
  SAVED_GUIDES_UPDATED_EVENT,
} from '@/lib/savedGuidesStorage'
import {
  getSavedRegistryItemsForCurrentUser,
  SAVED_REGISTRY_UPDATED_EVENT,
} from '@/lib/registryStorage'
import {
  getSavedNearMeProvidersForCurrentUser,
  SAVED_NEAR_ME_UPDATED_EVENT,
} from '@/lib/nearMeStorage'
import {
  getSavedQuestionsForCurrentUser,
  SAVED_QUESTIONS_UPDATED_EVENT,
} from '@/lib/questionStorage'

type OverviewCounts = {
  guides: number
  questions: number
  careTasks: number
  registryIdeas: number
  nearMe: number
}

const overviewItems = [
  {
    key: 'guides',
    label: 'Saved guides',
    description: 'Guides to revisit',
    href: '#saved-guides',
  },
  {
    key: 'questions',
    label: 'My questions',
    description: 'Things to figure out',
    href: '#my-questions',
  },
  {
    key: 'careTasks',
    label: 'Care tasks',
    description: 'Steps added to plan',
    href: '#care-plan',
  },
  {
    key: 'registryIdeas',
    label: 'Registry ideas',
    description: 'Support to save',
    href: '#registry-ideas',
  },
  {
    key: 'nearMe',
    label: 'Near Me',
    description: 'Support options',
    href: '#near-me',
  },
] as const

export default function WillaOverview() {
  const [counts, setCounts] = useState<OverviewCounts>({
    guides: 0,
    questions: 0,
    careTasks: 0,
    registryIdeas: 0,
    nearMe: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function refreshCounts() {
      const [guides, questions, careTasks, registryItems, nearMeProviders] =
        await Promise.all([
          getSavedGuidesForCurrentUser(),
          getSavedQuestionsForCurrentUser(),
          getAddedCareTasksForCurrentUser(),
          getSavedRegistryItemsForCurrentUser(),
          getSavedNearMeProvidersForCurrentUser(),
        ])

      if (!isMounted) return

      setCounts({
        guides: guides.length,
        questions: questions.length,
        careTasks: careTasks.length,
        registryIdeas: registryItems.length,
        nearMe: nearMeProviders.length,
      })
      setIsLoading(false)
    }

    refreshCounts()

    window.addEventListener(SAVED_GUIDES_UPDATED_EVENT, refreshCounts)
    window.addEventListener(SAVED_QUESTIONS_UPDATED_EVENT, refreshCounts)
    window.addEventListener(CARE_PLAN_UPDATED_EVENT, refreshCounts)
    window.addEventListener(SAVED_REGISTRY_UPDATED_EVENT, refreshCounts)
    window.addEventListener(SAVED_NEAR_ME_UPDATED_EVENT, refreshCounts)
    window.addEventListener('storage', refreshCounts)

    return () => {
      isMounted = false
      window.removeEventListener(SAVED_GUIDES_UPDATED_EVENT, refreshCounts)
      window.removeEventListener(SAVED_QUESTIONS_UPDATED_EVENT, refreshCounts)
      window.removeEventListener(CARE_PLAN_UPDATED_EVENT, refreshCounts)
      window.removeEventListener(SAVED_REGISTRY_UPDATED_EVENT, refreshCounts)
      window.removeEventListener(SAVED_NEAR_ME_UPDATED_EVENT, refreshCounts)
      window.removeEventListener('storage', refreshCounts)
    }
  }, [])

  const totalSaved = useMemo(() => {
    return (
      counts.guides +
      counts.questions +
      counts.careTasks +
      counts.registryIdeas +
      counts.nearMe
    )
  }, [counts])

  return (
    <section className="mt-8 rounded-[2rem] bg-white p-5 shadow-[0_18px_55px_rgba(61,50,38,0.07)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Your Willa at a glance
          </p>

          <h2 className="mt-3 font-serif text-3xl text-[#211f1b]">
            What you’ve started saving
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            A quick look at the guides, questions, care tasks, registry ideas,
            and support options you have collected so far.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 sm:justify-end">
          <span className="w-fit rounded-full bg-[#f5ded5] px-3 py-1 text-xs font-semibold text-[#a45f51]">
            {isLoading ? 'Loading...' : `${totalSaved} saved total`}
          </span>

          <Link
            href="/guides"
            className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d] transition hover:bg-[#dde5d0] hover:text-[#211f1b]"
          >
            Browse guides →
          </Link>
        </div>
      </div>

      {isLoading ? (
        <LoadingOverview />
      ) : (
        <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {overviewItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group flex h-full min-h-[9.5rem] flex-col rounded-3xl bg-[#f8f3eb] p-5 transition hover:-translate-y-0.5 hover:bg-[#f2ece2]"
            >
              <p className="font-serif text-4xl leading-none text-[#211f1b]">
                {counts[item.key]}
              </p>

              <div className="mt-auto pt-5">
                <p className="text-sm font-semibold text-[#211f1b]">
                  {item.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#655d52]">
                  {item.description}
                </p>

                <p className="mt-3 text-xs font-semibold text-[#4f5d3d] transition group-hover:text-[#211f1b]">
                  View section →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

function LoadingOverview() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="min-h-[9.5rem] rounded-3xl bg-[#f8f3eb] p-5">
          <div className="h-9 w-12 rounded-full bg-[#eadfd4]" />
          <div className="mt-8 h-4 w-24 rounded-full bg-[#eadfd4]" />
          <div className="mt-3 h-3 w-20 rounded-full bg-[#eadfd4]" />
        </div>
      ))}
    </div>
  )
}