'use client'

import Link from 'next/link'
import { useEffect } from 'react'

type ErrorPageProps = {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-5 text-[#211f1b]">
      <div className="w-full max-w-xl rounded-[2rem] border border-[#e2d7c8] bg-white/70 p-8 text-center shadow-[0_24px_80px_rgba(61,50,38,0.07)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef0e6] font-serif text-2xl text-[#4f5d3d]">
          W
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
          Something went wrong
        </p>

        <h1 className="mt-4 font-serif text-4xl leading-tight text-[#211f1b]">
          Willa hit a little bump.
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#655d52]">
          The page couldn’t load properly. You can try again or go back home.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[#4f5d3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
          >
            Try again
          </button>

          <Link
            href="/"
            className="rounded-full border border-[#d8cabb] bg-white px-6 py-3 text-sm font-semibold text-[#211f1b] transition hover:bg-[#fbf7ef]"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}