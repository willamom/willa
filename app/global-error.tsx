'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-6 text-[#211f1b]">
          <section className="w-full max-w-xl rounded-[3rem] bg-[#f2ece2] p-8 text-center shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c]">
              Willa needs a refresh
            </p>

            <h1 className="mt-5 font-serif text-5xl leading-tight">
              Something got tangled.
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#5f574d]">
              The page ran into a problem. Try refreshing, or return to Willa.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="rounded-full bg-[#4f5d3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
              >
                Try again
              </button>

              <a
                href="/"
                className="rounded-full bg-[#fbf7ef] px-6 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-white hover:text-[#211f1b]"
              >
                Go home
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  )
}