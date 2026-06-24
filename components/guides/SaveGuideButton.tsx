'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { SavedGuideItem } from '@/types/saved-guide'
import {
  isGuideSavedForCurrentUser,
  removeSavedGuideForCurrentUser,
  saveGuideForCurrentUser,
} from '@/lib/savedGuidesStorage'

type SaveGuideButtonProps = {
  guide: Omit<SavedGuideItem, 'savedAt'>
}

type SaveStatus = 'idle' | 'checking' | 'saving' | 'removing'

export default function SaveGuideButton({ guide }: SaveGuideButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [status, setStatus] = useState<SaveStatus>('checking')
  const [note, setNote] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSavedState() {
      setStatus('checking')

      const saved = await isGuideSavedForCurrentUser(guide.slug)

      if (!isMounted) return

      setIsSaved(saved)
      setStatus('idle')
    }

    loadSavedState()

    return () => {
      isMounted = false
    }
  }, [guide.slug])

  async function handleToggleSave() {
    setNote('')

    try {
      if (isSaved) {
        setStatus('removing')

        await removeSavedGuideForCurrentUser(guide.slug)

        setIsSaved(false)
        setNote('Removed from your Willa.')
        setStatus('idle')
        return
      }

      setStatus('saving')

      await saveGuideForCurrentUser(guide)

      setIsSaved(true)
      setNote('Saved to your Willa.')
      setStatus('idle')
    } catch {
      setNote('Something interrupted saving. Please try again.')
      setStatus('idle')
    }
  }

  const isBusy = status !== 'idle'

  const buttonLabel =
    status === 'checking'
      ? 'Checking...'
      : status === 'saving'
        ? 'Saving...'
        : status === 'removing'
          ? 'Removing...'
          : isSaved
            ? 'Saved to my Willa'
            : 'Save to my Willa'

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleToggleSave}
          disabled={isBusy}
          className={`rounded-xl px-5 py-3 text-center text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isSaved
              ? 'bg-[#fbf7ef] text-[#4f5d3d] hover:bg-white'
              : 'bg-[#4f5d3d] text-white hover:bg-[#414d31]'
          }`}
        >
          {buttonLabel}
        </button>

        <Link
          href="/profile#saved-guides"
          className="rounded-xl bg-white/70 px-5 py-3 text-center text-sm font-semibold text-[#4f5d3d] transition hover:bg-white hover:text-[#211f1b]"
        >
          View my Willa →
        </Link>
      </div>

      {note ? (
        <p className="mt-3 text-sm leading-6 text-[#655d52]">{note}</p>
      ) : null}
    </div>
  )
}