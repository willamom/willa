'use client'

import { useActionState, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Mail, X } from 'lucide-react'

import {
  createProviderInquiryAction,
  type ProviderInquiryFormState,
} from '@/lib/provider-inquiries'
import type { WillaProvider } from '@/types/providers'

type ProviderInquiryButtonProps = {
  provider: WillaProvider
  className?: string
}

const initialState: ProviderInquiryFormState = {
  success: false,
  message: '',
}

export default function ProviderInquiryButton({
  provider,
  className,
}: ProviderInquiryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [state, formAction, isPending] = useActionState(
    createProviderInquiryAction,
    initialState
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const modal = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#211f1b]/45 px-4 py-6 backdrop-blur-md">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close contact form"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-[#fbf7ef] p-5 shadow-[0_30px_100px_rgba(33,31,27,0.28)] [scrollbar-width:none] sm:p-7 [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#655d52] transition hover:text-[#211f1b]"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={1.8} />
        </button>

        <div className="pr-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a45f51]">
            Contact provider
          </p>

          <h2 className="mt-3 font-serif text-4xl leading-tight text-[#211f1b]">
            Get in touch with {provider.name}
          </h2>
        </div>

        {state.success ? (
          <div className="mt-6 rounded-[1.5rem] border border-[#dce4d2] bg-[#eef0e6] p-5">
            <p className="font-serif text-3xl text-[#211f1b]">
              Message received
            </p>

            <p className="mt-2 text-sm leading-6 text-[#4f5d3d]">
              {state.message}
            </p>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-5 rounded-full bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31]"
            >
              Close
            </button>
          </div>
        ) : (
          <form action={formAction} className="mt-6 space-y-4">
            <input type="hidden" name="provider_slug" value={provider.slug} />

            <input
              className="hidden"
              name="company"
              tabIndex={-1}
              autoComplete="off"
            />

            <Field label="Your name">
              <input
                name="sender_name"
                required
                placeholder="Your name"
                className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none transition focus:border-[#a45f51]"
              />
            </Field>

            <Field label="Your email">
              <input
                type="email"
                name="sender_email"
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none transition focus:border-[#a45f51]"
              />
            </Field>

            <Field label="Stage">
              <select
                name="sender_stage"
                className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm text-[#655d52] outline-none transition focus:border-[#a45f51]"
                defaultValue=""
              >
                <option value="">Choose one optional</option>
                <option value="Pregnant">Pregnant</option>
                <option value="Trying to conceive">Trying to conceive</option>
                <option value="Postpartum">Postpartum</option>
                <option value="Planning ahead">Planning ahead</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="Message">
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell them what kind of support you’re looking for..."
                className="w-full rounded-xl border border-[#e2d7c8] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#a45f51]"
              />
            </Field>

            <label className="flex gap-3 rounded-[1.25rem] bg-white/70 p-4 text-sm leading-6 text-[#655d52]">
              <input
                type="checkbox"
                name="consent_to_share"
                required
                className="mt-1 h-4 w-4 rounded border-[#d8cab9]"
              />

              <span>
                I understand Willa will share my name, email, and message with
                this provider.
              </span>
            </label>

            {state.message ? (
              <p className="rounded-xl bg-[#fff2dc] px-4 py-3 text-sm font-medium text-[#a45f51]">
                {state.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-[#a45f51] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f5145] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ??
          'inline-flex items-center justify-center gap-2 rounded-xl border border-[#a45f51] bg-white px-4 py-3 text-sm font-semibold text-[#4f5d3d] transition hover:bg-[#f8f3eb]'
        }
      >
        <Mail className="h-4 w-4" strokeWidth={1.8} />
        Get in touch
      </button>

      {isOpen && isMounted ? createPortal(modal, document.body) : null}
    </>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
      </span>

      {children}
    </label>
  )
}