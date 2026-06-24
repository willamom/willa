'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { guideCareTaskSuggestions } from '@/data/guideCareTasks'
import type { SavedGuideItem } from '@/types/saved-guide'
import {
  buildAddedCareTaskId,
  CARE_PLAN_UPDATED_EVENT,
  dispatchCarePlanUpdated,
  getAddedCareTasksForCurrentUser,
  saveAddedCareTaskForCurrentUser,
} from '@/lib/carePlanStorage'
import {
  getSavedGuidesForCurrentUser,
  SAVED_GUIDES_UPDATED_EVENT,
} from '@/lib/savedGuidesStorage'

type CareTaskSuggestion = {
  id: string
  label: string
  sourceSlug: string
  sourceTitle: string
}

export default function SuggestedCareTasksFromSavedGuides() {
  const [savedGuides, setSavedGuides] = useState<SavedGuideItem[]>([])
  const [addedTaskIds, setAddedTaskIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingTaskId, setSavingTaskId] = useState('')

  useEffect(() => {
    let isMounted = true

    async function refreshSavedGuides() {
      const [guides, addedTasks] = await Promise.all([
        getSavedGuidesForCurrentUser(),
        getAddedCareTasksForCurrentUser(),
      ])

      if (!isMounted) return

      setSavedGuides(guides)
      setAddedTaskIds(addedTasks.map((task) => task.id))
      setIsLoading(false)
    }

    refreshSavedGuides()

    window.addEventListener(SAVED_GUIDES_UPDATED_EVENT, refreshSavedGuides)
    window.addEventListener(CARE_PLAN_UPDATED_EVENT, refreshSavedGuides)
    window.addEventListener('storage', refreshSavedGuides)

    return () => {
      isMounted = false
      window.removeEventListener(SAVED_GUIDES_UPDATED_EVENT, refreshSavedGuides)
      window.removeEventListener(CARE_PLAN_UPDATED_EVENT, refreshSavedGuides)
      window.removeEventListener('storage', refreshSavedGuides)
    }
  }, [])

  const suggestions = useMemo(() => {
    return savedGuides.flatMap((guide) => {
      const tasks = guideCareTaskSuggestions[guide.slug] || []

      return tasks.map((label) => ({
        id: buildAddedCareTaskId(guide.slug, label),
        label,
        sourceSlug: guide.slug,
        sourceTitle: guide.title,
      }))
    })
  }, [savedGuides])

  const availableSuggestions = useMemo(() => {
    const addedTaskIdSet = new Set(addedTaskIds)

    return suggestions.filter(
      (suggestion) => !addedTaskIdSet.has(suggestion.id)
    )
  }, [addedTaskIds, suggestions])

  async function handleAddTask(suggestion: CareTaskSuggestion) {
    setSavingTaskId(suggestion.id)

    const nextTasks = await saveAddedCareTaskForCurrentUser({
      id: suggestion.id,
      label: suggestion.label,
      sourceSlug: suggestion.sourceSlug,
      sourceTitle: suggestion.sourceTitle,
    })

    setAddedTaskIds(nextTasks.map((task) => task.id))
    setSavingTaskId('')
    dispatchCarePlanUpdated()
  }

  return (
    <section className="rounded-[2rem] bg-[#f2ece2] p-6 shadow-[0_18px_55px_rgba(61,50,38,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            From saved guides
          </p>

          <h2 className="mt-4 font-serif text-3xl">
            Suggested care tasks
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            Willa turns saved guides into practical next steps you can add to
            your care plan.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#fbf7ef] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
          {isLoading
            ? 'Loading...'
            : `${availableSuggestions.length} suggested`}
        </span>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : savedGuides.length === 0 ? (
        <EmptyNoSavedGuides />
      ) : suggestions.length === 0 ? (
        <EmptyNoSuggestions />
      ) : availableSuggestions.length > 0 ? (
        <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-2">
          {availableSuggestions.map((suggestion) => (
            <article
              key={suggestion.id}
              className="flex h-full min-h-[12.5rem] flex-col rounded-2xl bg-[#fbf7ef]/85 p-5 shadow-[0_10px_28px_rgba(61,50,38,0.04)]"
            >
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45f51]">
                  From: {suggestion.sourceTitle}
                </p>

                <p className="mt-4 text-sm font-semibold leading-6 text-[#211f1b]">
                  {suggestion.label}
                </p>
              </div>

              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={() => handleAddTask(suggestion)}
                  disabled={savingTaskId === suggestion.id}
                  className="w-full rounded-xl bg-[#4f5d3d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#414d31] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingTaskId === suggestion.id
                    ? 'Adding...'
                    : 'Add to care plan'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AllAddedState />
      )}
    </section>
  )
}

function LoadingState() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="rounded-2xl bg-[#fbf7ef]/85 p-5 shadow-[0_10px_28px_rgba(61,50,38,0.04)]"
        >
          <div className="h-4 w-40 rounded-full bg-[#eadfd4]" />
          <div className="mt-5 space-y-2">
            <div className="h-3 w-full rounded-full bg-[#eadfd4]" />
            <div className="h-3 w-4/5 rounded-full bg-[#eadfd4]" />
          </div>
          <div className="mt-6 h-10 w-full rounded-xl bg-[#eadfd4]" />
        </div>
      ))}
    </div>
  )
}

function EmptyNoSavedGuides() {
  return (
    <div className="mt-6 rounded-3xl border border-[#e2d7c8] bg-[#fbf7ef]/85 p-6">
      <p className="font-serif text-2xl leading-tight text-[#211f1b]">
        Save a guide first.
      </p>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
        Once you save a guide, Willa can suggest small care tasks from it. Think
        less “giant checklist” and more “one useful next step”.
      </p>

      <Link
        href="/guides"
        className="mt-5 inline-flex rounded-xl bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
      >
        Browse guides
      </Link>
    </div>
  )
}

function EmptyNoSuggestions() {
  return (
    <div className="mt-6 rounded-3xl border border-[#e2d7c8] bg-[#fbf7ef]/85 p-6">
      <p className="font-serif text-2xl leading-tight text-[#211f1b]">
        No care tasks from these guides yet.
      </p>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
        These saved guides do not have task suggestions attached yet. You can
        still add your own tasks directly in the care plan.
      </p>
    </div>
  )
}

function AllAddedState() {
  return (
    <div className="mt-6 rounded-3xl border border-[#e2d7c8] bg-[#fbf7ef]/85 p-6">
      <p className="font-serif text-2xl leading-tight text-[#211f1b]">
        You added all suggested tasks.
      </p>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
        Tiny victory. Your care plan has caught up with your saved guides, which
        is more than most notes apps can say.
      </p>
    </div>
  )
}