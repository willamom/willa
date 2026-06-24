'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'

import type { ProfileQuestion } from '@/types/profile'
import {
  getSavedQuestionsForCurrentUser,
  removeQuestionForCurrentUser,
  saveQuestionForCurrentUser,
  SAVED_QUESTIONS_UPDATED_EVENT,
  type SavedQuestionItem,
} from '@/lib/questionStorage'

type SavedQuestionsProps = {
  questions: ProfileQuestion[]
}

export default function SavedQuestions({ questions }: SavedQuestionsProps) {
  const [customQuestions, setCustomQuestions] = useState<SavedQuestionItem[]>([])
  const [questionInput, setQuestionInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [removingQuestionId, setRemovingQuestionId] = useState('')

  useEffect(() => {
    let isMounted = true

    async function refreshQuestions() {
      const savedQuestions = await getSavedQuestionsForCurrentUser()

      if (!isMounted) return

      setCustomQuestions(savedQuestions)
      setIsLoading(false)
    }

    refreshQuestions()

    window.addEventListener(SAVED_QUESTIONS_UPDATED_EVENT, refreshQuestions)
    window.addEventListener('storage', refreshQuestions)

    return () => {
      isMounted = false
      window.removeEventListener(SAVED_QUESTIONS_UPDATED_EVENT, refreshQuestions)
      window.removeEventListener('storage', refreshQuestions)
    }
  }, [])

  const totalQuestions = useMemo(
    () => questions.length + customQuestions.length,
    [customQuestions.length, questions.length]
  )

  const hasQuestions = totalQuestions > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuestion = questionInput.trim()

    if (!trimmedQuestion) return

    setIsSaving(true)

    const nextQuestions = await saveQuestionForCurrentUser(trimmedQuestion)

    setCustomQuestions(nextQuestions)
    setQuestionInput('')
    setIsSaving(false)
  }

  async function handleRemoveQuestion(questionId: string) {
    setRemovingQuestionId(questionId)

    const nextQuestions = await removeQuestionForCurrentUser(questionId)

    setCustomQuestions(nextQuestions)
    setRemovingQuestionId('')
  }

  return (
    <section
      id="my-questions"
      className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            My questions
          </p>

          <h2 className="mt-4 font-serif text-3xl">
            Things I’m figuring out
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            Save the questions you want to come back to, then use them to find
            guides, care tasks, and support ideas.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
          {isLoading ? 'Loading...' : `${totalQuestions} questions`}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="overflow-hidden rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef]">
          <div className="flex flex-col sm:flex-row">
            <input
              value={questionInput}
              onChange={(event) => setQuestionInput(event.target.value)}
              placeholder="Add a question... e.g. What do I need after birth?"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#211f1b] outline-none placeholder:text-[#8a8277]"
            />

            <button
              type="submit"
              disabled={isSaving || !questionInput.trim()}
              className="bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[120px]"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <LoadingState />
      ) : hasQuestions ? (
        <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-2">
          {customQuestions.map((item) => (
            <CustomQuestionCard
              key={item.id}
              item={item}
              isRemoving={removingQuestionId === item.id}
              onRemove={() => handleRemoveQuestion(item.id)}
            />
          ))}

          {questions.map((item) => (
            <SuggestedQuestionCard key={item.question} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  )
}

function CustomQuestionCard({
  item,
  isRemoving,
  onRemove,
}: {
  item: SavedQuestionItem
  isRemoving: boolean
  onRemove: () => void
}) {
  return (
    <article className="flex h-full min-h-[12rem] flex-col rounded-2xl bg-[#f8f3eb] p-5 transition hover:bg-[#f2ece2]">
      <div className="flex-1">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#a45f51]">
          {item.tag}
        </span>

        <p className="mt-4 text-sm font-semibold leading-6 text-[#211f1b]">
          {item.question}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center">
        <Link
          href={`/guides?query=${encodeURIComponent(item.question)}`}
          className="inline-flex justify-center rounded-xl bg-[#4f5d3d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#414d31]"
        >
          Find answers
        </Link>

        <button
          type="button"
          onClick={onRemove}
          disabled={isRemoving}
          className="inline-flex justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#a45f51] transition hover:bg-[#fffdf9] hover:text-[#211f1b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRemoving ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </article>
  )
}

function SuggestedQuestionCard({ item }: { item: ProfileQuestion }) {
  return (
    <Link
      href={item.href}
      className="group flex h-full min-h-[12rem] flex-col rounded-2xl bg-[#f8f3eb] p-5 transition hover:bg-[#f2ece2]"
    >
      <div className="flex-1">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#a45f51]">
          {item.tag}
        </span>

        <p className="mt-4 text-sm font-semibold leading-6 text-[#211f1b]">
          {item.question}
        </p>
      </div>

      <p className="mt-auto pt-5 text-sm font-semibold text-[#4f5d3d] transition group-hover:text-[#211f1b]">
        Read guide →
      </p>
    </Link>
  )
}

function LoadingState() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      {[1, 2].map((item) => (
        <div key={item} className="rounded-2xl bg-[#f8f3eb] p-5">
          <div className="h-6 w-24 rounded-full bg-white" />
          <div className="mt-5 space-y-2">
            <div className="h-3 w-full rounded-full bg-[#eadfd4]" />
            <div className="h-3 w-5/6 rounded-full bg-[#eadfd4]" />
          </div>
          <div className="mt-6 h-9 w-32 rounded-xl bg-[#eadfd4]" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-3xl border border-[#e5dccf] bg-[#f8f3eb] p-6">
      <div className="max-w-2xl">
        <p className="font-serif text-2xl leading-tight text-[#211f1b]">
          No questions saved yet.
        </p>

        <p className="mt-3 text-sm leading-6 text-[#5f574d]">
          Add the question that is taking up the most space in your head right
          now. Willa will keep it here so you can come back to it when you are
          ready.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/guides"
            className="rounded-xl bg-[#4f5d3d] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#414d31]"
          >
            Browse guides
          </Link>

          <Link
            href="/guides?query=postpartum"
            className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#fffdf9] hover:text-[#211f1b]"
          >
            Look at postpartum guides
          </Link>
        </div>
      </div>
    </div>
  )
}