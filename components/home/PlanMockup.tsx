import {
  afterBabyTasks,
  beforeBabyTasks,
  villageProviders,
} from '@/data/home'

const registryPreviewItems = [
  'Recovery',
  'Meals',
  'Feeding',
  'Home help',
]

export default function PlanMockup() {
  return (
    <div
      className="relative mx-auto w-full max-w-2xl"
      aria-label="Preview of a Willa care plan"
    >
      <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] bg-white p-5 shadow-[0_22px_70px_rgba(61,50,38,0.12)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-[#211f1b]">My Care Plan</p>
              <p className="mt-1 text-sm text-[#655d52]">
                Pregnancy + postpartum support
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
              Week 1
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-[#f8f3eb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#39472c]">
              Focus
            </p>

            <p className="mt-2 font-serif text-xl leading-snug text-[#211f1b]">
              Rest, meals, recovery, and fewer “what now?” moments.
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-[#211f1b]">
              Before baby
            </p>

            <div className="space-y-3">
              {beforeBabyTasks.map((task) => (
                <TaskRow
                  key={task.label}
                  label={task.label}
                  checked={task.checked}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-[#211f1b]">
              After baby
            </p>

            <div className="space-y-3">
              {afterBabyTasks.map((task) => (
                <TaskRow
                  key={task.label}
                  label={task.label}
                  checked={task.checked}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#eadfd4] bg-[#fbf7ef] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#39472c]">
              Next suggested step
            </p>

            <p className="mt-2 text-sm leading-6 text-[#5f574d]">
              Ask someone to handle dinner during your first week home.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div
            id="registry"
            className="rounded-[2rem] bg-white p-5 shadow-[0_18px_55px_rgba(61,50,38,0.09)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[#211f1b]">Mom Registry</p>
                <p className="mt-1 text-xs text-[#655d52]">
                  Care ideas to save
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#f5ded5] px-3 py-1 text-xs font-semibold text-[#a45f51]">
                Care
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {registryPreviewItems.map((item) => (
                <ProductThumb key={item} label={item} />
              ))}
            </div>

            <p className="mt-4 text-xs leading-5 text-[#655d52]">
              Add recovery items, meals, feeding support, and help at home
              without feeling weird for needing care too.
            </p>
          </div>

          <div
            id="near-me"
            className="rounded-[2rem] bg-white p-5 shadow-[0_18px_55px_rgba(61,50,38,0.09)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[#211f1b]">Near Me</p>
                <p className="mt-1 text-xs text-[#655d52]">
                  Support to look for
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
                Local
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {villageProviders.map((provider) => (
                <div key={provider.name} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d8b8a9] text-xs font-semibold text-[#7b4f45]">
                    {provider.type.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#211f1b]">
                      {provider.type}
                    </p>
                    <p className="text-xs text-[#655d52]">
                      {provider.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[#f8f3eb] p-4">
              <p className="text-xs leading-5 text-[#655d52]">
                Save doulas, feeding help, pelvic floor support, and other care
                options for later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskRow({
  label,
  checked,
}: {
  label: string
  checked?: boolean
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#eee6da] pb-3 text-sm last:border-0 last:pb-0">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
          checked
            ? 'border-[#4f5d3d] bg-[#4f5d3d] text-white'
            : 'border-[#c8bdae] bg-white'
        }`}
        aria-hidden="true"
      >
        {checked ? '✓' : ''}
      </span>

      <span
        className={
          checked
            ? 'leading-6 text-[#3f3b35]'
            : 'leading-6 text-[#655d52]'
        }
      >
        {label}
      </span>
    </div>
  )
}

function ProductThumb({ label }: { label: string }) {
  return (
    <div className="rounded-2xl bg-[#eadfd4] px-3 py-4 text-center">
      <div className="mx-auto h-8 w-8 rounded-full bg-[#fbf7ef]/80" />

      <p className="mt-3 text-xs font-semibold text-[#5f574d]">
        {label}
      </p>
    </div>
  )
}