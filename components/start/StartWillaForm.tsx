'use client'

import type { ReactNode } from 'react'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

const PROFILE_COOKIE_KEY = 'willa_profile_preview'

const concernOptions = [
  'Recovery',
  'Feeding',
  'Registry',
  'Birth plan',
  'Visitors',
  'Meals',
  'Sleep',
  'Older kids',
  'Mental health',
]

type StartProfileData = {
  name: string
  dueDate: string
  location: string
  babyNumber: string
  concerns: string[]
}

type StartWillaFormProps = {
  initialData?: Partial<StartProfileData>
}

export default function StartWillaForm({ initialData }: StartWillaFormProps) {
  const router = useRouter()

  const [name, setName] = useState(initialData?.name || '')
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '')
  const [location, setLocation] = useState(initialData?.location || '')
  const [babyNumber, setBabyNumber] = useState(
    initialData?.babyNumber || 'first'
  )
  const [concerns, setConcerns] = useState<string[]>(
    initialData?.concerns || []
  )
  const [isSaving, setIsSaving] = useState(false)
  const [saveNote, setSaveNote] = useState('')

  function toggleConcern(concern: string) {
    setConcerns((currentConcerns) =>
      currentConcerns.includes(concern)
        ? currentConcerns.filter((item) => item !== concern)
        : [...currentConcerns, concern]
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSaving(true)
    setSaveNote('')

    const profilePayload: StartProfileData = {
      name: name.trim(),
      dueDate,
      location: location.trim(),
      babyNumber,
      concerns,
    }

    document.cookie = `${PROFILE_COOKIE_KEY}=${encodeURIComponent(
      JSON.stringify(profilePayload)
    )}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`

    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from('willa_profiles').upsert(
          {
            user_id: user.id,
            name: profilePayload.name,
            due_date: profilePayload.dueDate || null,
            location: profilePayload.location,
            baby_number: profilePayload.babyNumber,
            concerns: profilePayload.concerns,
          },
          {
            onConflict: 'user_id',
          }
        )

        if (error) {
          setSaveNote(
            'Your profile was saved on this device. Cloud sync did not finish yet.'
          )
        }
      }

      const params = new URLSearchParams()

      if (profilePayload.name) params.set('name', profilePayload.name)
      if (profilePayload.dueDate) params.set('dueDate', profilePayload.dueDate)
      if (profilePayload.location) {
        params.set('location', profilePayload.location)
      }
      if (profilePayload.babyNumber) {
        params.set('babyNumber', profilePayload.babyNumber)
      }

      for (const concern of profilePayload.concerns) {
        params.append('concerns', concern)
      }

      router.push(`/profile?${params.toString()}`)
    } catch {
      setSaveNote(
        'Your profile was saved on this device, but something interrupted cloud sync.'
      )
      setIsSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2.25rem] bg-white p-5 shadow-[0_24px_80px_rgba(61,50,38,0.08)] sm:rounded-[2.5rem] sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Your details
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#211f1b]">
            Tell Willa where to begin
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5f574d]">
            This helps Willa shape your pregnancy snapshot, care plan,
            suggested guides, and registry ideas.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#4f5d3d]">
          Editable later
        </span>
      </div>

      <div className="mt-7 space-y-5">
        <Field
          label="Name"
          hint="Use your name, nickname, or leave it simple."
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="w-full rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef] px-4 py-3 text-sm text-[#211f1b] outline-none transition placeholder:text-[#8a8277] focus:border-[#a86f62] focus:bg-white"
          />
        </Field>

        <Field
          label="Due date"
          hint="This helps Willa show your pregnancy week."
        >
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef] px-4 py-3 text-sm text-[#211f1b] outline-none transition focus:border-[#a86f62] focus:bg-white"
          />
        </Field>

        <Field
          label="Location"
          hint="A city or area is enough. This helps with support ideas."
        >
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City or area"
            className="w-full rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef] px-4 py-3 text-sm text-[#211f1b] outline-none transition placeholder:text-[#8a8277] focus:border-[#a86f62] focus:bg-white"
          />
        </Field>

        <Field label="Is this your first baby?">
          <div className="grid gap-3 sm:grid-cols-2">
            <ChoiceButton
              isSelected={babyNumber === 'first'}
              onClick={() => setBabyNumber('first')}
            >
              First baby
            </ChoiceButton>

            <ChoiceButton
              isSelected={babyNumber === 'not-first'}
              onClick={() => setBabyNumber('not-first')}
            >
              Not my first
            </ChoiceButton>
          </div>
        </Field>

        <Field
          label="What are you trying to figure out?"
          hint="Pick anything that feels relevant. You can change this later."
        >
          <div className="flex flex-wrap gap-3">
            {concernOptions.map((concern) => {
              const isSelected = concerns.includes(concern)

              return (
                <button
                  key={concern}
                  type="button"
                  onClick={() => toggleConcern(concern)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? 'border-[#4f5d3d] bg-[#4f5d3d] text-white'
                      : 'border-[#e2d7c8] bg-[#fbf7ef] text-[#5f574d] hover:bg-white'
                  }`}
                >
                  {concern}
                </button>
              )
            })}
          </div>
        </Field>
      </div>

      {saveNote ? (
        <p className="mt-5 rounded-2xl bg-[#f5ded5] px-4 py-3 text-sm leading-6 text-[#a45f51]">
          {saveNote}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#4f5d3d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#414d31] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[180px]"
        >
          {isSaving ? 'Saving...' : 'Create my Willa'}
        </button>

        <p className="text-xs leading-5 text-[#8a8277]">
          Willa saves this so your profile, care plan, and saved items can stay
          connected.
        </p>
      </div>
    </form>
  )
}

function ChoiceButton({
  isSelected,
  onClick,
  children,
}: {
  isSelected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
        isSelected
          ? 'border-[#4f5d3d] bg-[#eef0e6] text-[#4f5d3d]'
          : 'border-[#e2d7c8] bg-[#fbf7ef] text-[#5f574d] hover:bg-white'
      }`}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#211f1b]">
        {label}
      </span>

      {children}

      {hint ? (
        <span className="mt-2 block text-xs leading-5 text-[#8a8277]">
          {hint}
        </span>
      ) : null}
    </label>
  )
}