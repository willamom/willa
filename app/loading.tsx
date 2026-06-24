export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-6 text-[#211f1b]">
      <section className="w-full max-w-md rounded-[2.5rem] bg-white p-8 text-center shadow-[0_24px_80px_rgba(61,50,38,0.08)]">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-[#d8b8a9]" />

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
          Willa is loading
        </p>

        <h1 className="mt-4 font-serif text-4xl leading-tight">
          Gathering your care plan.
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#5f574d]">
          Just a moment while Willa brings your saved guides, questions, and
          support back into view.
        </p>
      </section>
    </main>
  )
}