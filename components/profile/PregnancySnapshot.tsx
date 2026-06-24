type PregnancySnapshotProps = {
  pregnancy: {
    week: number
    day: number
    trimester: string
    progressPercent: number
    daysLabel: string
  }
}

export default function PregnancySnapshot({
  pregnancy,
}: PregnancySnapshotProps) {
  const progressPercent = Math.min(
    100,
    Math.max(0, pregnancy.progressPercent)
  )

  const dayLabel =
    pregnancy.day === 1
      ? '1 day'
      : pregnancy.day > 1
        ? `${pregnancy.day} days`
        : ''

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Pregnancy timeline
          </p>

          <h2 className="mt-4 font-serif text-3xl text-[#211f1b]">
            {pregnancy.week} weeks
            {dayLabel ? ` + ${dayLabel}` : ''}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            Willa uses your pregnancy week to keep your guides, care tasks, and
            support ideas more relevant to where you are now.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
          {pregnancy.trimester}
        </span>
      </div>

      <div className="mt-7 rounded-3xl bg-[#f8f3eb] p-5">
        <div className="flex items-center justify-between text-xs font-semibold text-[#655d52]">
          <span>0 weeks</span>
          <span>{progressPercent}%</span>
          <span>40 weeks</span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#eee6da]">
          <div
            className="h-full rounded-full bg-[#4f5d3d] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <TimelineStat label="Current week" value={`${pregnancy.week}`} />
          <TimelineStat label="Trimester" value={pregnancy.trimester} />
          <TimelineStat label="Countdown" value={pregnancy.daysLabel} />
        </div>
      </div>
    </section>
  )
}

function TimelineStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold leading-6 text-[#211f1b]">
        {value}
      </p>
    </div>
  )
}