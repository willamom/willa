'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { searchChips } from '@/data/home'

export default function AnswerSearchSection() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      router.push('/guides')
      return
    }

    router.push(`/guides?query=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <section
      id="answers"
      className="relative z-10 px-5 pb-14 pt-12 sm:px-8 sm:pt-16 lg:px-14 lg:pt-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c]">
            Start here
          </p>

          <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#211f1b] sm:text-4xl lg:text-5xl">
            What are you dealing with right now?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#5f574d] sm:text-base sm:leading-7">
            Search Willa’s guides by question, worry, stage, or support need.
            Start messy. Willa can handle messy.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 overflow-hidden rounded-[2rem] border border-[#e2d7c8] bg-white shadow-[0_12px_35px_rgba(61,50,38,0.06)] sm:rounded-full"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-5 py-4 text-[#8a8277] sm:px-6">
              <span className="shrink-0 text-sm">⌕</span>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try: postpartum recovery, visitors, feeding, hospital bag..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#211f1b] outline-none placeholder:text-[#8a8277] sm:text-base"
              />

              {query.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8f3eb] text-sm font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b]"
                >
                  ×
                </button>
              ) : null}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center bg-[#a86f62] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#955f54] sm:min-w-[180px]"
            >
              Search guides
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {searchChips.map((chip) => (
            <Link
              key={chip.label}
              href={`/guides?query=${encodeURIComponent(chip.label)}`}
              className="rounded-full border border-[#e2d7c8] bg-[#fffdf9] px-4 py-2 text-sm text-[#3f3b35] transition hover:border-[#d8cbbb] hover:bg-white hover:text-[#211f1b]"
            >
              <span className="mr-2 text-[#a86f62]">{chip.icon}</span>
              {chip.label}
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-[#5f574d]">
          <span className="mr-2 text-[#d59b45]">✦</span>
          Plain-language guides for the questions that usually get buried under
          baby checklists.
        </p>
      </div>
    </section>
  )
}