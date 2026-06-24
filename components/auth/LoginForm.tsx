'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

type AuthMode = 'signin' | 'signup' | 'magic'

export default function LoginForm() {
  const router = useRouter()

  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>(
    'idle'
  )
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) return

    if (mode !== 'magic' && password.length < 6) {
      setStatus('error')
      setMessage('Password must be at least 6 characters.')
      return
    }

    setStatus('loading')
    setMessage('')

    const supabase = createClient()

    if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
        },
      })

      if (error) {
        setStatus('error')

        if (error.message.toLowerCase().includes('rate limit')) {
          setMessage(
            'Too many sign-in emails requested. Please wait a bit before trying again, or use email + password.'
          )
        } else {
          setMessage(error.message)
        }

        return
      }

      setStatus('sent')
      setMessage('Check your email for your Willa sign-in link.')
      return
    }

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      })

      if (error) {
        setStatus('error')
        setMessage(error.message)
        return
      }

      if (!data.session) {
        setStatus('sent')
        setMessage(
          'Account created. Check your email to confirm your account, then sign in.'
        )
        return
      }

      router.push('/profile')
      router.refresh()
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (error) {
      setStatus('error')
      setMessage(error.message)
      return
    }

    router.push('/profile')
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2.5rem] bg-white p-6 shadow-[0_24px_80px_rgba(61,50,38,0.08)] sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
        Your account
      </p>

      <h2 className="mt-4 font-serif text-4xl leading-tight">
        Sign in to your Willa
      </h2>

      <p className="mt-4 text-sm leading-6 text-[#5f574d]">
        Use email and password while we build the demo. Magic link is still
        available, but Supabase can rate-limit sign-in emails during testing.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <AuthModeButton
          label="Sign in"
          isActive={mode === 'signin'}
          onClick={() => {
            setMode('signin')
            setMessage('')
            setStatus('idle')
          }}
        />

        <AuthModeButton
          label="Create account"
          isActive={mode === 'signup'}
          onClick={() => {
            setMode('signup')
            setMessage('')
            setStatus('idle')
          }}
        />

        <AuthModeButton
          label="Magic link"
          isActive={mode === 'magic'}
          onClick={() => {
            setMode('magic')
            setMessage('')
            setStatus('idle')
          }}
        />
      </div>

      <div className="mt-7 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#211f1b]">
            Email address
          </span>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef] px-4 py-3 text-sm text-[#211f1b] outline-none transition placeholder:text-[#8a8277] focus:border-[#a86f62] focus:bg-white"
          />
        </label>

        {mode !== 'magic' ? (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#211f1b]">
              Password
            </span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef] px-4 py-3 text-sm text-[#211f1b] outline-none transition placeholder:text-[#8a8277] focus:border-[#a86f62] focus:bg-white"
            />
          </label>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-6 rounded-xl bg-[#4f5d3d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#414d31] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading'
          ? 'Working...'
          : mode === 'signup'
            ? 'Create account'
            : mode === 'magic'
              ? 'Send sign-in link'
              : 'Sign in'}
      </button>

      {message ? (
        <p
          className={`mt-5 rounded-2xl px-4 py-3 text-sm leading-6 ${
            status === 'error'
              ? 'bg-[#f5ded5] text-[#a45f51]'
              : 'bg-[#eef0e6] text-[#4f5d3d]'
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}

function AuthModeButton({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? 'border-[#4f5d3d] bg-[#eef0e6] text-[#4f5d3d]'
          : 'border-[#e2d7c8] bg-[#fbf7ef] text-[#5f574d] hover:bg-white'
      }`}
    >
      {label}
    </button>
  )
}