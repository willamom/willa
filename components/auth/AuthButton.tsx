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
      <span className="rounded-full bg-[#f8f3eb] px-4 py-2 text-sm font-semibold text-[#5f574d]">
        Loading...
      </span>
    )
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-[#4f5d3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#414d31]"
      >
        Sign in
      </Link>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="max-w-[170px] truncate rounded-full bg-[#eef0e6] px-4 py-2 text-sm font-semibold text-[#4f5d3d]">
        {user.email}
      </span>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-full bg-[#f8f3eb] px-4 py-2 text-sm font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  )
}