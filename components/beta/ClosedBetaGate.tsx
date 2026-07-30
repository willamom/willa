'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import ComingSoonWaitlist from '@/components/waitlist/ComingSoonWaitlist'

import ClosedBetaModal from './ClosedBetaModal'

export default function ClosedBetaGate() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isClosedBetaOpen, setIsClosedBetaOpen] = useState(false)
  const [waitlistOpenKey, setWaitlistOpenKey] = useState(0)

  useEffect(() => {
    if (searchParams.get('closedBeta') !== '1') return

    setIsClosedBetaOpen(true)
    router.replace('/', { scroll: false })
  }, [router, searchParams])

  function handleCloseClosedBeta() {
    setIsClosedBetaOpen(false)
  }

  function handleJoinWaitlist() {
    setIsClosedBetaOpen(false)
    setWaitlistOpenKey(Date.now())
  }

  return (
    <>
      <ClosedBetaModal
        isOpen={isClosedBetaOpen}
        onClose={handleCloseClosedBeta}
        onJoinWaitlist={handleJoinWaitlist}
      />

      <ComingSoonWaitlist
        hideButtons
        autoOpenAudience="mom"
        autoOpenKey={waitlistOpenKey}
        source="closed_beta_modal"
      />
    </>
  )
}