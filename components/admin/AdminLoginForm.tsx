'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

type AdminLoginFormProps = {
  nextPath: string
}

export default function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setIsSubmitting(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage('Could not sign in. Check your email and password.')
      return
    }

    router.replace(nextPath)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#211f1b]">
          Email
        </span>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className="w-full rounded-2xl border border-[#e2d7c8] bg-white px-5 py-4 text-base text-[#211f1b] outline-none transition placeholder:text-[#aaa196] focus:border-[#4f5d3d]"
          placeholder="admin@willamom.com"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#211f1b]">
          Password
        </span>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-[#e2d7c8] bg-white px-5 py-4 text-base text-[#211f1b] outline-none transition placeholder:text-[#aaa196] focus:border-[#4f5d3d]"
          placeholder="Password"
        />
      </label>

      {errorMessage ? (
        <p className="rounded-2xl bg-[#fff3ef] px-4 py-3 text-sm font-semibold text-[#a45f51]">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-[#4f5d3d] px-8 py-4 text-center text-base font-semibold text-white shadow-sm transition hover:bg-[#414d31] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}