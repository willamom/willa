import Link from 'next/link'
import {
  BadgeCheck,
  HeartHandshake,
  Mail,
  MapPinned,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { createProviderSuggestionAction } from '@/lib/provider-suggestions'

type SuggestProviderPageProps = {
  searchParams: Promise<{
    error?: string
    success?: string
  }>
}

function getErrorMessage(error?: string) {
  switch (error) {
    case 'missing':
      return 'Please add the provider or practice name.'
    case 'contact':
      return 'Please add at least a location, website, email, or Instagram so Willa can review the suggestion.'
    case 'provider_email':
      return 'Please enter a valid provider email address.'
    case 'suggested_email':
      return 'Please enter a valid email address for yourself, or leave it blank.'
    case 'server':
      return 'Something went wrong while sending your suggestion. Please try again.'
    default:
      return null
  }
}

const providerCategories = [
  { value: '', label: 'Select a category' },
  { value: 'doula', label: 'Doula' },
  { value: 'midwife', label: 'Midwife' },
  { value: 'obgyn', label: 'OB/GYN' },
  { value: 'lactation', label: 'Lactation Consultant' },
  { value: 'postpartum-care', label: 'Postpartum Care' },
  { value: 'mental-health', label: 'Mental Health' },
  { value: 'pelvic-floor-pt', label: 'Pelvic Floor PT' },
  { value: 'sleep-consultant', label: 'Sleep Consultant' },
  { value: 'childbirth-educator', label: 'Childbirth Educator' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'photography', label: 'Photography' },
  { value: 'meal-service', label: 'Meal Service' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'baby-brand', label: 'Baby Brand' },
  { value: 'other', label: 'Other' },
]

const relationshipOptions = [
  { value: '', label: 'Select one' },
  { value: 'I am this provider', label: 'I am this provider' },
  { value: 'I used this provider', label: 'I used this provider' },
  { value: 'I know this provider', label: 'I know this provider' },
  { value: 'I found them online', label: 'I found them online' },
  { value: 'Other', label: 'Other' },
]

export const metadata = {
  title: 'Suggest a Provider | Willa',
  description:
    'Suggest a doula, midwife, lactation consultant, postpartum provider, or other pregnancy and motherhood support provider for Willa.',
}

export default async function SuggestProviderPage({
  searchParams,
}: SuggestProviderPageProps) {
  const { error, success } = await searchParams
  const errorMessage = getErrorMessage(error)
  const didSubmit = success === '1'

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-10 lg:py-14">
          <div>
            <Link
              href="/providers"
              className="text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              ← Back to provider directory
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
              Provider suggestions
            </p>

            <h1 className="mt-4 max-w-xl font-serif text-5xl leading-tight tracking-tight text-[#211f1b] sm:text-6xl">
              Suggest someone Willa should include.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#655d52]">
              Know a doula, midwife, lactation consultant, pelvic floor
              therapist, mental health provider, or postpartum support provider?
              Send them our way and we’ll review the suggestion.
            </p>

            <div className="mt-8 space-y-3">
              <InfoPoint
                icon={<MapPinned className="h-4 w-4" strokeWidth={1.8} />}
                title="Help grow the directory"
                description="Suggestions help Willa find local providers moms may be searching for."
              />

              <InfoPoint
                icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.8} />}
                title="Suggestions are reviewed"
                description="Submitting a suggestion does not automatically publish a provider profile."
              />

              <InfoPoint
                icon={<BadgeCheck className="h-4 w-4" strokeWidth={1.8} />}
                title="Providers can claim later"
                description="Once listed, providers can request to claim and complete their Willa profile."
              />

              <InfoPoint
                icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}
                title="Contact details help"
                description="A website, email, Instagram, or location makes it easier for Willa to review the suggestion."
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e2d7c8] bg-white p-5 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:p-6">
            {didSubmit ? (
              <div className="rounded-[1.5rem] bg-[#eef0e6] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#4f5d3d]">
                  <Sparkles className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <h2 className="mt-4 font-serif text-3xl leading-tight text-[#211f1b]">
                  Suggestion sent.
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#655d52]">
                  Thank you. Willa will review the provider suggestion before
                  adding anything to the directory.
                </p>

                <Link
                  href="/providers"
                  className="mt-4 inline-flex text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
                >
                  Back to providers →
                </Link>
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-[#f8f3eb] p-4">
                <h2 className="font-serif text-3xl leading-tight text-[#211f1b]">
                  Provider details
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#655d52]">
                  Add as much as you know. A name and at least one way to review
                  the provider is enough to start.
                </p>
              </div>
            )}

            {errorMessage ? (
              <div className="mt-5 rounded-[1.25rem] bg-[#f5ded5] p-4 text-sm font-semibold leading-6 text-[#a45f51]">
                {errorMessage}
              </div>
            ) : null}

            {!didSubmit ? (
              <form
                action={createProviderSuggestionAction}
                className="mt-6 space-y-5"
              >
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <Field
                  label="Provider or practice name"
                  name="provider_name"
                  placeholder="Provider or practice name"
                  required
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Category"
                    name="provider_category"
                    options={providerCategories}
                  />

                  <Field
                    label="Services"
                    name="provider_services"
                    placeholder="Home birth, birth doula, lactation support..."
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field
                    label="City"
                    name="provider_city"
                    placeholder="San Diego"
                  />

                  <Field
                    label="State"
                    name="provider_state"
                    placeholder="CA"
                  />

                  <Field
                    label="Country"
                    name="provider_country"
                    defaultValue="USA"
                    placeholder="USA"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Website"
                    name="provider_website"
                    placeholder="https://..."
                  />

                  <Field
                    label="Instagram"
                    name="provider_instagram"
                    placeholder="@handle or https://..."
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Provider email"
                    name="provider_email"
                    type="email"
                    placeholder="hello@example.com"
                  />

                  <Field
                    label="Provider phone"
                    name="provider_phone"
                    placeholder="+1..."
                  />
                </div>

                <div className="rounded-[1.5rem] bg-[#f8f3eb] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
                    Your details
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#655d52]">
                    Optional, but helpful if Willa needs to follow up.
                  </p>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Your name"
                      name="suggested_by_name"
                      placeholder="Optional"
                    />

                    <Field
                      label="Your email"
                      name="suggested_by_email"
                      type="email"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="mt-5">
                    <SelectField
                      label="Your relationship"
                      name="relationship"
                      options={relationshipOptions}
                    />
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
                    Notes
                  </span>

                  <textarea
                    name="notes"
                    rows={5}
                    placeholder="Anything Willa should know? For example, where you found them, what they offer, or why they would be useful for moms."
                    className="w-full rounded-xl border border-[#e2d7c8] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#a45f51]"
                  />
                </label>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
                >
                  <Send className="h-4 w-4" strokeWidth={1.8} />
                  Submit provider suggestion
                </button>
              </form>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}

function InfoPoint({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-[1.5rem] bg-white/65 p-4">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef0e6] text-[#4f5d3d]">
        {icon}
      </div>

      <div>
        <p className="font-semibold text-[#211f1b]">{title}</p>

        <p className="mt-1 text-sm leading-6 text-[#655d52]">
          {description}
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required = false,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
        {required ? ' *' : ''}
      </span>

      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
      />
    </label>
  )
}

function SelectField({
  label,
  name,
  options,
  required = false,
}: {
  label: string
  name: string
  options: {
    value: string
    label: string
  }[]
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
        {required ? ' *' : ''}
      </span>

      <select
        name={name}
        required={required}
        className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}