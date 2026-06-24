type ThisWeekFocusProps = {
  items: string[]
}

export default function ThisWeekFocus({ items }: ThisWeekFocusProps) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            This week
          </p>

          <h2 className="mt-4 font-serif text-3xl text-[#211f1b]">
            What to focus on now
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            A few gentle focus points based on your profile and what you told
            Willa you care about.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
          {items.length} focus {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {items.length > 0 ? (
        <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-2">
          {items.map((item, index) => (
            <article
              key={item}
              className="flex h-full min-h-[8.5rem] gap-4 rounded-2xl bg-[#f8f3eb] p-5 transition hover:bg-[#f2ece2]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5ded5] text-sm font-semibold text-[#a45f51]">
                {index + 1}
              </span>

              <div>
                <p className="text-sm font-semibold leading-6 text-[#211f1b]">
                  {item}
                </p>

                <p className="mt-2 text-xs leading-5 text-[#655d52]">
                  Save anything useful, skip anything that does not fit your
                  actual life.
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-[#e5dccf] bg-[#f8f3eb] p-6">
          <p className="font-serif text-2xl leading-tight text-[#211f1b]">
            No focus items yet.
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            Add a few concerns or goals to your Willa profile, and this section
            can help turn them into softer next steps.
          </p>
        </div>
      )}
    </section>
  )
}