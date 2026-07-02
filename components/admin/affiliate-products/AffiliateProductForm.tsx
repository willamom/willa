import Link from 'next/link'

import {
  affiliateCategoryOptions,
  affiliateRetailerOptions,
  affiliateStatusOptions,
} from '@/data/affiliate-products/options'
import type { AffiliateProduct } from '@/types/affiliate-products'

type AffiliateProductFormProps = {
  product?: AffiliateProduct
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export default function AffiliateProductForm({
  product,
  action,
  submitLabel,
}: AffiliateProductFormProps) {
  return (
    <form
      action={action}
      className="rounded-[2rem] border border-[#e2d7c8] bg-white/70 p-5 shadow-[0_18px_55px_rgba(61,50,38,0.055)] sm:p-7"
    >
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-5">
          <Field label="Product title" name="title" required>
            <input
              name="title"
              required
              defaultValue={product?.title ?? ''}
              placeholder="Frida Mom Peri Bottle"
              className="input"
            />
          </Field>

          <Field label="Slug" name="slug" hint="Leave blank to generate from title.">
            <input
              name="slug"
              defaultValue={product?.slug ?? ''}
              placeholder="frida-mom-peri-bottle"
              className="input"
            />
          </Field>

          <Field label="Description" name="description" required>
            <textarea
              name="description"
              required
              defaultValue={product?.description ?? ''}
              placeholder="A helpful postpartum recovery bottle for gentle rinsing after birth."
              rows={5}
              className="textarea"
            />
          </Field>

          <Field label="Affiliate URL" name="affiliate_url" required>
            <input
              name="affiliate_url"
              required
              defaultValue={product?.affiliateUrl ?? ''}
              placeholder="https://..."
              className="input"
            />
          </Field>

          <Field label="Image URL" name="image_url">
            <input
              name="image_url"
              defaultValue={product?.imageUrl ?? ''}
              placeholder="https://..."
              className="input"
            />
          </Field>

          <Field
            label="Tags"
            name="tags"
            hint="Comma separated. Example: postpartum, recovery, hospital bag"
          >
            <input
              name="tags"
              defaultValue={product?.tags.join(', ') ?? ''}
              placeholder="postpartum, recovery, hospital bag"
              className="input"
            />
          </Field>

          <Field label="Notes" name="notes">
            <textarea
              name="notes"
              defaultValue={product?.notes ?? ''}
              placeholder="Internal notes only."
              rows={4}
              className="textarea"
            />
          </Field>
        </div>

        <aside className="grid content-start gap-5 rounded-[1.5rem] bg-[#f8f3eb] p-4">
          <Field label="Retailer" name="retailer" required>
            <select
              name="retailer"
              required
              defaultValue={product?.retailer ?? 'amazon'}
              className="input"
            >
              {affiliateRetailerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Category" name="category" required>
            <select
              name="category"
              required
              defaultValue={product?.category ?? 'postpartum-recovery'}
              className="input"
            >
              {affiliateCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status" name="status" required>
            <select
              name="status"
              required
              defaultValue={product?.status ?? 'draft'}
              className="input"
            >
              {affiliateStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Price label" name="price_label">
            <input
              name="price_label"
              defaultValue={product?.priceLabel ?? ''}
              placeholder="$"
              className="input"
            />
          </Field>

          <Field label="Source" name="source">
            <input
              name="source"
              defaultValue={product?.source ?? 'manual_entry'}
              placeholder="manual_entry"
              className="input"
            />
          </Field>

          <label className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 text-sm leading-6 text-[#655d52]">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product?.isFeatured ?? false}
              className="mt-1 h-4 w-4 rounded border-[#d8cabb] text-[#4f5d3d]"
            />
            <span>
              <span className="block font-semibold text-[#211f1b]">
                Featured product
              </span>
              Use this for products you may want to highlight in guide blocks.
            </span>
          </label>
        </aside>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e5d9ca] pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/admin/affiliate-products"
          className="inline-flex items-center justify-center rounded-full bg-[#f8f3eb] px-5 py-3 text-sm font-semibold text-[#655d52] transition hover:bg-[#f2ece2] hover:text-[#211f1b]"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[#a45f51] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f5145]"
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
  hint,
  required,
  children,
}: {
  label: string
  name: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#39472c]">
        {label}
        {required ? ' *' : ''}
      </span>

      <div className="mt-2">{children}</div>

      {hint ? (
        <span className="mt-2 block text-xs leading-5 text-[#8a8277]">
          {hint}
        </span>
      ) : null}
    </label>
  )
}