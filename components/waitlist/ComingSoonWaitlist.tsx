'use client'

import type { FormEvent, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Apple,
  Baby,
  Bone,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  ChevronDown,
  Droplet,
  Dumbbell,
  HandHeart,
  Heart,
  HeartHandshake,
  Home,
  Leaf,
  LockKeyhole,
  Moon,
  MoreHorizontal,
  Package,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

type Audience = 'mom' | 'provider'

type ComingSoonWaitlistProps = {
  defaultAudience?: Audience
}

type BusinessTypeOption = {
  label: string
  Icon: LucideIcon
}

type MomStageOption = {
  label: string
  description: string
  Icon: LucideIcon
}

type MomNeedOption = {
  label: string
  Icon: LucideIcon
}

const momStageOptions: MomStageOption[] = [
  {
    label: 'Pregnant',
    description: 'I’m preparing for baby and myself.',
    Icon: Baby,
  },
  {
    label: 'Postpartum',
    description: 'I’m in the thick of recovery, feeding, sleep, and feelings.',
    Icon: Heart,
  },
  {
    label: 'Trying or planning',
    description: 'I’m gathering information before the next chapter.',
    Icon: Sparkles,
  },
  {
    label: 'Mom of older kids',
    description: 'I still want support, ideas, and a softer village.',
    Icon: Home,
  },
]

const momNeedOptions: MomNeedOption[] = [
  { label: 'Pregnancy guides', Icon: BookOpen },
  { label: 'Birth planning', Icon: CalendarDays },
  { label: 'Postpartum recovery', Icon: Heart },
  { label: 'Registry help', Icon: Package },
  { label: 'Local support', Icon: HeartHandshake },
  { label: 'Feeding support', Icon: Droplet },
  { label: 'Mental load & emotions', Icon: Brain },
  { label: 'I’m not sure yet', Icon: Sparkles },
]

const businessTypeOptions: BusinessTypeOption[] = [
  { label: 'Doula', Icon: HeartHandshake },
  { label: 'Midwife', Icon: UserRound },
  { label: 'OB/GYN', Icon: Stethoscope },
  { label: 'Childbirth Educator', Icon: BookOpen },

  { label: 'Lactation Consultant / IBCLC', Icon: Droplet },
  { label: 'Postpartum Care Specialist', Icon: HandHeart },
  { label: 'Therapist / Mental Health Professional', Icon: Brain },
  { label: 'Pediatrician / Pediatric Practice', Icon: Baby },
  { label: 'Physical Therapist', Icon: Activity },
  { label: 'Chiropractor', Icon: Bone },
  { label: 'Nutritionist / Dietitian', Icon: Apple },
  { label: 'Sleep Consultant', Icon: Moon },
  { label: 'Fitness / Wellness Coach', Icon: Dumbbell },

  { label: 'Photographer / Videographer', Icon: Camera },
  { label: 'Event Planner', Icon: CalendarDays },

  { label: 'Baby Brand / Product Company', Icon: ShoppingBag },
  { label: 'Baby Gear / Product Brand', Icon: Package },
  { label: 'Maternity Clothing Brand', Icon: Shirt },
  { label: 'Nursery / Home Decor Brand', Icon: Home },
  { label: 'Health & Wellness Brand', Icon: Sparkles },
  { label: 'Health / Skincare Brand', Icon: Leaf },
  { label: 'Insurance Provider', Icon: ShieldCheck },

  { label: 'Other Service Provider', Icon: BriefcaseBusiness },
  { label: 'Other Brand / Retailer', Icon: ShoppingBag },
  { label: 'Other', Icon: MoreHorizontal },
]

export default function ComingSoonWaitlist({
  defaultAudience = 'mom',
}: ComingSoonWaitlistProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [audience, setAudience] = useState<Audience>(defaultAudience)

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')

  const [momStage, setMomStage] = useState('')
  const [dueDateOrBabyAge, setDueDateOrBabyAge] = useState('')
  const [momNeeds, setMomNeeds] = useState<string[]>([])

  const [businessType, setBusinessType] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [website, setWebsite] = useState('')
  const [socialHandle, setSocialHandle] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const selectedBusinessType = useMemo(
    () => businessTypeOptions.find((option) => option.label === businessType),
    [businessType]
  )

  function openModal(nextAudience: Audience) {
    setAudience(nextAudience)
    setIsOpen(true)
    setErrorMessage('')
    setSuccessMessage('')
    setIsBusinessDropdownOpen(false)
  }

  function closeModal() {
    if (isSubmitting) return

    setIsOpen(false)
    setErrorMessage('')
    setIsBusinessDropdownOpen(false)
  }

  function toggleMomNeed(need: string) {
    setMomNeeds((currentNeeds) => {
      if (currentNeeds.includes(need)) {
        return currentNeeds.filter((item) => item !== need)
      }

      return [...currentNeeds, need]
    })
  }

  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSubmitting) {
        setIsOpen(false)
        setErrorMessage('')
        setIsBusinessDropdownOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isSubmitting])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (honeypot) {
      setSuccessMessage('You’re on the list.')
      return
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your name.')
      return
    }
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }

    if (audience === 'mom' && !momStage) {
      setErrorMessage('Please choose where you are in motherhood right now.')
      return
    }

    if (audience === 'mom' && momNeeds.length === 0) {
      setErrorMessage('Please choose at least one thing Willa can help with.')
      return
    }

    if (audience === 'provider' && !businessType) {
      setErrorMessage('Please select your business type.')
      return
    }

    if (audience === 'provider' && !businessName.trim()) {
      setErrorMessage('Please enter your business name.')
      return
    }

    setIsSubmitting(true)

    const supabase = createClient()

    const { error } = await supabase.from('waitlist_submissions').insert({
      audience,
      email: email.trim().toLowerCase(),
      full_name: fullName.trim(),

      mom_stage: audience === 'mom' ? momStage : null,
      due_date_or_baby_age:
        audience === 'mom' ? dueDateOrBabyAge.trim() || null : null,
      mom_needs: audience === 'mom' ? momNeeds : null,
      mom_message: null,

      business_type: audience === 'provider' ? businessType : null,
      business_name: audience === 'provider' ? businessName.trim() : null,
      website: audience === 'provider' ? website.trim() || null : null,
      social_handle:
        audience === 'provider' ? socialHandle.trim() || null : null,
      message: audience === 'provider' ? message.trim() || null : null,

      source: 'coming_soon',
      status: 'new',
    })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage('Something went wrong. Please try again.')
      return
    }

    setSuccessMessage(
      audience === 'provider'
        ? 'Thank you. We’ll be in touch when Willa opens provider partnerships.'
        : 'You’re on the list. Willa will meet you where motherhood actually is.'
    )

    setEmail('')
    setFullName('')

    setMomStage('')
    setDueDateOrBabyAge('')
    setMomNeeds([])

    setBusinessType('')
    setBusinessName('')
    setWebsite('')
    setSocialHandle('')
    setMessage('')
    setIsBusinessDropdownOpen(false)
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => openModal('mom')}
          className="rounded-xl bg-[#4f5d3d] px-8 py-4 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#414d31]"
        >
          Join the waitlist
        </button>

        <button
          type="button"
          onClick={() => openModal('provider')}
          className="rounded-xl border border-[#c8bdae] bg-white/70 px-8 py-4 text-center text-sm font-semibold text-[#211f1b] shadow-sm transition hover:bg-white"
        >
          Work with Willa
        </button>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211f1b]/35 px-4 py-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close waitlist form"
            onClick={closeModal}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2.25rem] bg-[#fbf7ef] p-5 shadow-[0_32px_120px_rgba(33,31,27,0.24)] [scrollbar-width:none] sm:p-8 [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#655d52] shadow-sm transition hover:text-[#211f1b] disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>

            <div className="mx-auto max-w-xl text-center">
              <p className="font-serif text-4xl font-semibold tracking-tight text-[#39472c]">
                willa
              </p>

              <h2 className="mt-6 font-serif text-4xl leading-tight text-[#211f1b] sm:text-5xl">
                {audience === 'mom'
                  ? 'Find your Willa starting point'
                  : 'Join the provider list'}
              </h2>

              <p className="mt-4 text-base leading-7 text-[#655d52]">
                {audience === 'mom'
                  ? 'Tell us where you are, what feels loud right now, and what kind of support would actually help.'
                  : 'Tell us a little about your work so we can keep you in the loop as Willa grows.'}
              </p>

              <div className="mx-auto mt-7 flex max-w-md items-center gap-4">
                <span className="h-px flex-1 bg-[#e8ded1]" />
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#c09a8c] shadow-sm">
                  <Leaf className="h-4 w-4" strokeWidth={1.7} />
                </span>
                <span className="h-px flex-1 bg-[#e8ded1]" />
              </div>
            </div>

            {successMessage ? (
              <div className="mt-8 rounded-[1.75rem] border border-[#d9e2cf] bg-white/80 p-6 text-center shadow-[0_14px_45px_rgba(61,50,38,0.05)]">
                <p className="font-serif text-3xl text-[#211f1b]">
                  You’re in.
                </p>

                <p className="mt-3 text-sm leading-6 text-[#655d52]">
                  {successMessage}
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-6 rounded-xl bg-[#4f5d3d] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <input
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a45f51]">
                    I’m joining as...
                  </p>

                  <div className="mt-4 grid gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAudience('mom')
                        setIsBusinessDropdownOpen(false)
                      }}
                      className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                        audience === 'mom'
                          ? 'border-[#b56f5f] bg-white shadow-[0_12px_35px_rgba(61,50,38,0.06)]'
                          : 'border-[#e2d7c8] bg-white/55 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          audience === 'mom'
                            ? 'border-[#b56f5f]'
                            : 'border-[#d8cfc2]'
                        }`}
                      >
                        {audience === 'mom' ? (
                          <span className="h-3 w-3 rounded-full bg-[#b56f5f]" />
                        ) : null}
                      </span>

                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8f3eb] text-[#a45f51]">
                        <Heart className="h-5 w-5" strokeWidth={1.8} />
                      </span>

                      <span className="text-base font-semibold text-[#211f1b]">
                        An expecting or new mom
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAudience('provider')}
                      className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                        audience === 'provider'
                          ? 'border-[#b56f5f] bg-white shadow-[0_12px_35px_rgba(61,50,38,0.06)]'
                          : 'border-[#e2d7c8] bg-white/55 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          audience === 'provider'
                            ? 'border-[#b56f5f]'
                            : 'border-[#d8cfc2]'
                        }`}
                      >
                        {audience === 'provider' ? (
                          <span className="h-3 w-3 rounded-full bg-[#b56f5f]" />
                        ) : null}
                      </span>

                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8f3eb] text-[#a45f51]">
                        <BriefcaseBusiness
                          className="h-5 w-5"
                          strokeWidth={1.8}
                        />
                      </span>

                      <span className="text-base font-semibold text-[#211f1b]">
                        A provider or brand
                      </span>
                    </button>
                  </div>
                </div>

                <Field label="Your name" required>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-[#e2d7c8] bg-white/70 px-5 py-4 text-base text-[#211f1b] outline-none transition placeholder:text-[#aaa196] focus:border-[#4f5d3d] focus:bg-white"
                  />
                </Field>
                
                <Field label="Email address" required>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-[#e2d7c8] bg-white/70 px-5 py-4 text-base text-[#211f1b] outline-none transition placeholder:text-[#aaa196] focus:border-[#4f5d3d] focus:bg-white"
                  />
                </Field>

                {audience === 'mom' ? (
                  <div className="rounded-[1.75rem] border border-[#e8ded1] bg-white/55 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a45f51]">
                      Your Willa compass
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#655d52]">
                      A few tiny questions so Willa can build for the real
                      middle-of-the-night searches, not the imaginary perfect
                      version of motherhood.
                    </p>

                    <div className="mt-5 space-y-6">
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#211f1b]">
                          Where are you right now? *
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {momStageOptions.map(({ label, description, Icon }) => {
                            const isSelected = momStage === label

                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => setMomStage(label)}
                                className={`rounded-2xl border p-4 text-left transition ${
                                  isSelected
                                    ? 'border-[#b56f5f] bg-white shadow-[0_12px_35px_rgba(61,50,38,0.06)]'
                                    : 'border-[#e2d7c8] bg-white/65 hover:bg-white'
                                }`}
                              >
                                <span className="flex items-center gap-3">
                                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8f3eb] text-[#a45f51]">
                                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                                  </span>

                                  <span className="font-semibold text-[#211f1b]">
                                    {label}
                                  </span>
                                </span>

                                <span className="mt-2 block text-sm leading-6 text-[#655d52]">
                                  {description}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <Field label="Due date or baby age" optional>
                        <input
                          type="text"
                          value={dueDateOrBabyAge}
                          onChange={(event) =>
                            setDueDateOrBabyAge(event.target.value)
                          }
                          placeholder="August 2026, 3 weeks postpartum, 8 months old..."
                          className="w-full rounded-2xl border border-[#e2d7c8] bg-white/80 px-5 py-4 text-base text-[#211f1b] outline-none transition placeholder:text-[#aaa196] focus:border-[#4f5d3d] focus:bg-white"
                        />
                      </Field>

                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#211f1b]">
                          What do you want Willa to help with? *
                        </p>

                        <div className="grid gap-2.5 sm:grid-cols-2">
                          {momNeedOptions.map(({ label, Icon }) => {
                            const isSelected = momNeeds.includes(label)

                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => toggleMomNeed(label)}
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                                  isSelected
                                    ? 'border-[#b56f5f] bg-[#fffaf7] text-[#211f1b] shadow-[0_10px_28px_rgba(61,50,38,0.055)]'
                                    : 'border-[#e2d7c8] bg-white/65 text-[#48443d] hover:bg-white'
                                }`}
                              >
                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                    isSelected
                                      ? 'bg-[#f5ded5] text-[#a45f51]'
                                      : 'bg-[#f8f3eb] text-[#8a8277]'
                                  }`}
                                >
                                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                                </span>

                                {label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                ) : null}

                {audience === 'provider' ? (
                  <div className="rounded-[1.75rem] border border-[#e8ded1] bg-white/55 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a45f51]">
                      Tell us about your business
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#655d52]">
                      This helps us connect you with the right opportunities and
                      keep you in the loop.
                    </p>

                    <div className="mt-5 space-y-5">
                      <Field label="Business type" required>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setIsBusinessDropdownOpen((current) => !current)
                            }
                            className={`flex w-full items-center justify-between gap-4 rounded-2xl border bg-white/80 px-5 py-4 text-left text-base outline-none transition hover:bg-white ${
                              isBusinessDropdownOpen
                                ? 'border-[#b56f5f] bg-white shadow-[0_14px_38px_rgba(61,50,38,0.08)]'
                                : 'border-[#e2d7c8]'
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8f3eb] text-[#a45f51]">
                                {selectedBusinessType ? (
                                  <selectedBusinessType.Icon
                                    className="h-4 w-4"
                                    strokeWidth={1.8}
                                  />
                                ) : (
                                  <BriefcaseBusiness
                                    className="h-4 w-4"
                                    strokeWidth={1.8}
                                  />
                                )}
                              </span>

                              <span
                                className={`truncate ${
                                  selectedBusinessType
                                    ? 'text-[#211f1b]'
                                    : 'text-[#aaa196]'
                                }`}
                              >
                                {selectedBusinessType
                                  ? selectedBusinessType.label
                                  : 'Select what best describes you'}
                              </span>
                            </span>

                            <ChevronDown
                              className={`h-5 w-5 shrink-0 text-[#8a8277] transition ${
                                isBusinessDropdownOpen ? 'rotate-180' : ''
                              }`}
                              strokeWidth={1.8}
                            />
                          </button>

                          {isBusinessDropdownOpen ? (
                            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-72 overflow-y-auto rounded-2xl border border-[#e2d7c8] bg-white p-2 shadow-[0_22px_65px_rgba(61,50,38,0.16)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                              {businessTypeOptions.map(({ label, Icon }) => {
                                const isSelected = businessType === label

                                return (
                                  <button
                                    key={label}
                                    type="button"
                                    onClick={() => {
                                      setBusinessType(label)
                                      setIsBusinessDropdownOpen(false)
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                                      isSelected
                                        ? 'bg-[#f5ded5] text-[#211f1b]'
                                        : 'text-[#3c3832] hover:bg-[#f8f3eb]'
                                    }`}
                                  >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fbf7ef] text-[#a45f51]">
                                      <Icon
                                        className="h-4 w-4"
                                        strokeWidth={1.8}
                                      />
                                    </span>

                                    <span className="font-medium">{label}</span>
                                  </button>
                                )
                              })}
                            </div>
                          ) : null}
                        </div>
                      </Field>

                      <Field label="Business name" required>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(event) =>
                            setBusinessName(event.target.value)
                          }
                          placeholder="Your business name"
                          className="w-full rounded-2xl border border-[#e2d7c8] bg-white/80 px-5 py-4 text-base text-[#211f1b] outline-none transition placeholder:text-[#aaa196] focus:border-[#4f5d3d] focus:bg-white"
                        />
                      </Field>

                      <Field label="Website" optional>
                        <input
                          type="url"
                          value={website}
                          onChange={(event) => setWebsite(event.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="w-full rounded-2xl border border-[#e2d7c8] bg-white/80 px-5 py-4 text-base text-[#211f1b] outline-none transition placeholder:text-[#aaa196] focus:border-[#4f5d3d] focus:bg-white"
                        />
                      </Field>

                      <Field label="Instagram or social handle" optional>
                        <input
                          type="text"
                          value={socialHandle}
                          onChange={(event) =>
                            setSocialHandle(event.target.value)
                          }
                          placeholder="@yourhandle"
                          className="w-full rounded-2xl border border-[#e2d7c8] bg-white/80 px-5 py-4 text-base text-[#211f1b] outline-none transition placeholder:text-[#aaa196] focus:border-[#4f5d3d] focus:bg-white"
                        />
                      </Field>

                      <Field label="Tell us more" optional>
                        <textarea
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                          placeholder="Share a bit about your business and how you’d like to partner with Willa."
                          rows={4}
                          className="w-full resize-none rounded-2xl border border-[#e2d7c8] bg-white/80 px-5 py-4 text-base leading-7 text-[#211f1b] outline-none transition placeholder:text-[#aaa196] focus:border-[#4f5d3d] focus:bg-white"
                        />
                      </Field>
                    </div>
                  </div>
                ) : null}

                {errorMessage ? (
                  <p className="rounded-2xl bg-[#fff3ef] px-4 py-3 text-sm font-semibold text-[#a45f51]">
                    {errorMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-[#4f5d3d] px-8 py-4 text-center text-base font-semibold text-white shadow-sm transition hover:bg-[#414d31] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Joining...' : 'Join the waitlist'}
                </button>

                <p className="flex items-center justify-center gap-2 text-center text-sm leading-6 text-[#8a8277]">
                  <LockKeyhole
                    className="h-4 w-4 text-[#c09a8c]"
                    strokeWidth={1.8}
                  />
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string
  required?: boolean
  optional?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#211f1b]">
        {label}
        {required ? ' *' : ''}
        {optional ? ' (optional)' : ''}
      </span>

      {children}
    </label>
  )
}