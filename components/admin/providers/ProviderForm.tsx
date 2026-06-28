import type { ReactNode } from 'react'

import ProviderLocationFields from '@/components/admin/providers/ProviderLocationFields'
import { providerCategories } from '@/data/providers/categories'
import type { AdminProvider } from '@/lib/admin/providers'
import ProviderImageUrlField from '@/components/admin/providers/ProviderImageUrlField'

type ProviderFormProps = {
  provider?: AdminProvider
  action: (formData: FormData) => void | Promise<void>
  submitLabel: string
}

export default function ProviderForm({
  provider,
  action,
  submitLabel,
}: ProviderFormProps) {
  return (
    <form
      action={action}
      className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Field
          label="Name"
          name="name"
          defaultValue={provider?.name}
          required
        />

        <Field
          label="Slug"
          name="slug"
          defaultValue={provider?.slug}
          placeholder="gentle-birth-doula"
        />

        <FieldGroup label="Category">
          <select
            name="category"
            defaultValue={provider?.category ?? 'doula'}
            className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
          >
            {providerCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup label="Status">
          <select
            name="status"
            defaultValue={provider?.status ?? 'draft'}
            className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </FieldGroup>

        <ProviderLocationFields
          initialLocation={{
            address: provider?.location.address,
            city: provider?.location.city,
            state: provider?.location.state,
            country: provider?.location.country,
            lat: provider?.location.lat,
            lng: provider?.location.lng,
          }}
        />

        <Field
          label="Website"
          name="website"
          defaultValue={provider?.website}
          placeholder="https://..."
        />

        <Field
          label="Instagram"
          name="instagram"
          defaultValue={provider?.instagram}
          placeholder="@handle or https://..."
        />

        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={provider?.email}
        />

        <Field
          label="Phone"
          name="phone"
          defaultValue={provider?.phone}
        />

        <ProviderImageUrlField defaultValue={provider?.image} />

        <Field
          label="Source"
          name="source"
          defaultValue={provider?.source}
          placeholder="manual, seed, import..."
        />
      </div>

      <FieldGroup label="Description" className="mt-5">
        <textarea
          name="description"
          defaultValue={provider?.description}
          required
          rows={5}
          className="w-full rounded-xl border border-[#e2d7c8] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#a45f51]"
        />
      </FieldGroup>

      <FieldGroup label="Specialties" className="mt-5">
        <textarea
          name="specialties"
          defaultValue={provider?.specialties.join('\n')}
          rows={5}
          placeholder={'Birth support\nPostpartum planning\nVBAC support'}
          className="w-full rounded-xl border border-[#e2d7c8] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#a45f51]"
        />

        <p className="mt-2 text-xs text-[#8a8277]">
          One per line or separated by commas.
        </p>
      </FieldGroup>

      <FieldGroup label="Notes" className="mt-5">
        <textarea
          name="notes"
          defaultValue={provider?.notes}
          rows={4}
          className="w-full rounded-xl border border-[#e2d7c8] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#a45f51]"
        />
      </FieldGroup>

      <div className="mt-5 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 rounded-full bg-[#f8f3eb] px-4 py-2 text-sm font-semibold text-[#655d52]">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={provider?.isFeatured ?? false}
            className="h-4 w-4"
          />
          Featured
        </label>

        <label className="flex items-center gap-2 rounded-full bg-[#f8f3eb] px-4 py-2 text-sm font-semibold text-[#655d52]">
          <input
            type="checkbox"
            name="is_verified"
            defaultChecked={provider?.isVerified ?? false}
            className="h-4 w-4"
          />
          Verified
        </label>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-[#4f5d3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  step,
  defaultValue,
  placeholder,
  required = false,
}: {
  label: string
  name: string
  type?: string
  step?: string
  defaultValue?: string | number
  placeholder?: string
  required?: boolean
}) {
  return (
    <FieldGroup label={label}>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
      />
    </FieldGroup>
  )
}

function FieldGroup({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
      </span>

      {children}
    </label>
  )
}