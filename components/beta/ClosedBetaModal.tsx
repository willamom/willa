'use client'

import { X } from 'lucide-react'

type ClosedBetaModalProps = {
  isOpen: boolean
  onClose: () => void
  onJoinWaitlist: () => void
}

export default function ClosedBetaModal({
  isOpen,
  onClose,
  onJoinWaitlist,
}: ClosedBetaModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211f1b]/35 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Closed beta"
    >
      <button
        type="button"
        aria-label="Close closed beta message"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative w-full max-w-xl rounded-[2.25rem] bg-[#fbf7ef] p-6 text-center shadow-[0_32px_120px_rgba(33,31,27,0.24)] sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#655d52] shadow-sm transition hover:text-[#211f1b]"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={1.8} />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white font-serif text-2xl font-semibold text-[#4f5d3d] shadow-sm">
          W
        </div>

        <h2 className="mt-6 font-serif text-4xl leading-tight text-[#211f1b] sm:text-5xl">
          Willa is almost here 🤍
        </h2>

        <p className="mt-5 text-base font-semibold text-[#4f5d3d]">
          We’re currently in closed beta.
        </p>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#655d52] sm:text-base sm:leading-8">
          Our early families are helping us test Willa before launch. Join the
          waitlist to be among the first to know when we open our doors.
        </p>

        <button
          type="button"
          onClick={onJoinWaitlist}
          className="mt-7 rounded-full bg-[#4f5d3d] px-8 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#414d31]"
        >
          Join the Waitlist
        </button>

        <p className="mt-6 text-sm font-semibold text-[#211f1b]">
          Already 1,000+ parents have joined the waitlist.
        </p>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8a8277]">
          Already on the list? Thank you. We can’t wait to welcome you.
        </p>
      </div>
    </div>
  )
}