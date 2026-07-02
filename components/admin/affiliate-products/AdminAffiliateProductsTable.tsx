'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  Archive,
  Edit3,
  ExternalLink,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'

import {
  affiliateCategoryOptions,
  affiliateRetailerOptions,
  affiliateStatusOptions,
  getAffiliateCategoryLabel,
  getAffiliateRetailerLabel,
} from '@/data/affiliate-products/options'
import type {
  AffiliateProduct,
  AffiliateProductCategory,
  AffiliateProductRetailer,
  AffiliateProductStatus,
} from '@/types/affiliate-products'

type AdminAffiliateProductsTableProps = {
  products: AffiliateProduct[]
  updateStatusAction: (formData: FormData) => Promise<void>
  updateFeaturedAction: (formData: FormData) => Promise<void>
}

type FilterValue<T extends string> = T | 'all'

export default function AdminAffiliateProductsTable({
  products,
  updateStatusAction,
  updateFeaturedAction,
}: AdminAffiliateProductsTableProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] =
    useState<FilterValue<AffiliateProductStatus>>('all')
  const [retailer, setRetailer] =
    useState<FilterValue<AffiliateProductRetailer>>('all')
  const [category, setCategory] =
    useState<FilterValue<AffiliateProductCategory>>('all')

  const stats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter((product) => product.status === 'active').length,
      draft: products.filter((product) => product.status === 'draft').length,
      archived: products.filter((product) => product.status === 'archived')
        .length,
      featured: products.filter((product) => product.isFeatured).length,
    }
  }, [products])

  const filteredProducts = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      if (status !== 'all' && product.status !== status) {
        return false
      }

      if (retailer !== 'all' && product.retailer !== retailer) {
        return false
      }

      if (category !== 'all' && product.category !== category) {
        return false
      }

      if (cleanQuery) {
        const searchable = [
          product.title,
          product.description,
          product.slug,
          product.retailer,
          product.category,
          product.priceLabel,
          product.source,
          product.notes,
          ...product.tags,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        if (!searchable.includes(cleanQuery)) {
          return false
        }
      }

      return true
    })
  }, [products, query, status, retailer, category])

  function resetFilters() {
    setQuery('')
    setStatus('all')
    setRetailer('all')
    setCategory('all')
  }

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
            Affiliate products
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#211f1b]">
            Product catalog
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#655d52]">
            Manage products that can later appear inside Willa guides, registry
            ideas, care plan sections, and affiliate blocks.
          </p>
        </div>

        <Link
          href="/admin/affiliate-products/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#a45f51] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f5145]"
        >
          <Plus className="h-4 w-4" strokeWidth={1.8} />
          New product
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={stats.total} icon={ShoppingBag} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Drafts" value={stats.draft} />
        <StatCard label="Archived" value={stats.archived} icon={Archive} />
        <StatCard label="Featured" value={stats.featured} icon={Sparkles} />
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-[#e2d7c8] bg-[#f8f3eb] p-4 shadow-[0_18px_55px_rgba(61,50,38,0.055)] sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(3,13rem)_auto] lg:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8277]"
              strokeWidth={1.8}
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, tags, retailers..."
              className="h-12 w-full rounded-full border border-[#e2d7c8] bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-[#9a9186] focus:border-[#a45f51]"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as FilterValue<AffiliateProductStatus>)
            }
            className="h-12 rounded-full border border-[#e2d7c8] bg-white px-4 text-sm font-semibold text-[#655d52] outline-none transition focus:border-[#a45f51]"
          >
            <option value="all">All statuses</option>
            {affiliateStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={retailer}
            onChange={(event) =>
              setRetailer(
                event.target.value as FilterValue<AffiliateProductRetailer>
              )
            }
            className="h-12 rounded-full border border-[#e2d7c8] bg-white px-4 text-sm font-semibold text-[#655d52] outline-none transition focus:border-[#a45f51]"
          >
            <option value="all">All retailers</option>
            {affiliateRetailerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as FilterValue<AffiliateProductCategory>
              )
            }
            className="h-12 rounded-full border border-[#e2d7c8] bg-white px-4 text-sm font-semibold text-[#655d52] outline-none transition focus:border-[#a45f51]"
          >
            <option value="all">All categories</option>
            {affiliateCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="h-12 rounded-full bg-white px-5 text-sm font-semibold text-[#a45f51] transition hover:text-[#211f1b]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#e2d7c8] bg-white/70">
        <div className="border-b border-[#e2d7c8] px-5 py-4">
          <p className="text-sm font-semibold text-[#211f1b]">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-6 text-sm leading-6 text-[#655d52]">
            No products found. Try a different filter, or add your first
            affiliate product.
          </div>
        ) : (
          <div className="divide-y divide-[#e5d9ca]">
            {filteredProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                updateStatusAction={updateStatusAction}
                updateFeaturedAction={updateFeaturedAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon?: typeof ShoppingBag
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#e2d7c8] bg-white/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
          {label}
        </p>

        {Icon ? (
          <Icon className="h-4 w-4 text-[#a45f51]" strokeWidth={1.8} />
        ) : null}
      </div>

      <p className="mt-3 font-serif text-3xl text-[#211f1b]">{value}</p>
    </div>
  )
}

function ProductRow({
  product,
  updateStatusAction,
  updateFeaturedAction,
}: {
  product: AffiliateProduct
  updateStatusAction: (formData: FormData) => Promise<void>
  updateFeaturedAction: (formData: FormData) => Promise<void>
}) {
  return (
    <div className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_12rem_12rem_14rem] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              'rounded-full px-2.5 py-1 text-[0.68rem] font-semibold',
              product.status === 'active'
                ? 'bg-[#eef0e6] text-[#4f5d3d]'
                : product.status === 'archived'
                  ? 'bg-[#f1eee8] text-[#8a8277]'
                  : 'bg-[#fff2dc] text-[#a45f51]',
            ].join(' ')}
          >
            {product.status}
          </span>

          {product.isFeatured ? (
            <span className="rounded-full bg-[#f5ded5] px-2.5 py-1 text-[0.68rem] font-semibold text-[#a45f51]">
              Featured
            </span>
          ) : null}

          {product.priceLabel ? (
            <span className="rounded-full bg-[#f8f3eb] px-2.5 py-1 text-[0.68rem] font-semibold text-[#655d52]">
              {product.priceLabel}
            </span>
          ) : null}
        </div>

        <h2 className="mt-3 font-serif text-2xl leading-tight text-[#211f1b]">
          {product.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#655d52]">
          {product.description}
        </p>

        {product.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#f8f3eb] px-2.5 py-1 text-[0.7rem] font-semibold text-[#655d52]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="text-sm leading-6 text-[#655d52]">
        <p className="font-semibold text-[#211f1b]">
          {getAffiliateRetailerLabel(product.retailer)}
        </p>
        <p>{getAffiliateCategoryLabel(product.category)}</p>
      </div>

      <div className="flex flex-wrap gap-2 lg:flex-col">
        <form action={updateStatusAction}>
          <input type="hidden" name="id" value={product.id} />
          <input
            type="hidden"
            name="status"
            value={product.status === 'active' ? 'draft' : 'active'}
          />
          <button
            type="submit"
            className="rounded-full bg-[#4f5d3d] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#414d31]"
          >
            {product.status === 'active' ? 'Move to draft' : 'Make active'}
          </button>
        </form>

        <form action={updateFeaturedAction}>
          <input type="hidden" name="id" value={product.id} />
          <input
            type="hidden"
            name="is_featured"
            value={product.isFeatured ? 'false' : 'true'}
          />
          <button
            type="submit"
            className="rounded-full bg-[#f8f3eb] px-3.5 py-2 text-xs font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b]"
          >
            {product.isFeatured ? 'Unfeature' : 'Feature'}
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#e2d7c8] bg-white px-3.5 py-2 text-xs font-semibold text-[#4f5d3d] transition hover:bg-[#fbf7ef] hover:text-[#211f1b]"
        >
          Link
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
        </a>

        <Link
          href={`/admin/affiliate-products/${product.id}/edit`}
          className="inline-flex items-center gap-2 rounded-full bg-[#211f1b] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#4f5d3d]"
        >
          Edit
          <Edit3 className="h-3.5 w-3.5" strokeWidth={1.8} />
        </Link>
      </div>
    </div>
  )
}