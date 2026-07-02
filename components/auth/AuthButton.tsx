'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/client'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
      setIsLoading(false)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleSignOut() {
    setIsSigningOut(true)

    const supabase = createClient()

    await supabase.auth.signOut()

    setUser(null)
    setIsSigningOut(false)

    window.location.href = '/login'
  }

  if (isLoading) {
    return (
      <span className="rounded-full bg-[#f8f3eb] px-3 py-2 text-xs font-semibold text-[#5f574d] sm:px-4 sm:text-sm">
        Loading...
      </span>
    )
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-[#4f5d3d] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#414d31] sm:px-5 sm:text-sm"
      >
        Sign in
      </Link>
    )
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
      <span className="hidden max-w-[170px] truncate rounded-full bg-[#eef0e6] px-4 py-2 text-sm font-semibold text-[#4f5d3d] sm:block">
        {user.email}
      </span>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-full bg-[#f8f3eb] px-3 py-2 text-xs font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
      >
        {isSigningOut ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  )
}
