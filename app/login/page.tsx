import Link from 'next/link'

import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import LoginForm from '@/components/auth/LoginForm'
import { createClient } from '@/lib/supabase/server'

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const authError = params?.error

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#211f1b]">
      <SiteHeader />

      <section className="px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[3rem] bg-[#f2ece2] px-6 py-12 shadow-[0_24px_80px_rgba(61,50,38,0.07)] sm:px-10 lg:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#39472c]">
              Your Willa account
            </p>

            <h1 className="mt-5 font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
              Keep your care plan with you.
            </h1>

            <p className="mt-6 text-lg leading-8 text-[#5f574d]">
              Sign in so your guides, questions, registry, support saves, and
              care plan can eventually follow you across devices.
            </p>

            <Link
              href="/profile"
              className="mt-8 inline-flex text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
            >
              ← Back to my Willa
            </Link>
          </div>

          <div>
            {authError ? (
              <div className="mb-5 rounded-2xl bg-[#f5ded5] px-4 py-3 text-sm font-semibold text-[#a45f51]">
                Something went wrong with that sign-in link. Try sending a new
                one.
              </div>
            ) : null}

            {user ? (
              <div className="rounded-[2.5rem] bg-white p-6 shadow-[0_24px_80px_rgba(61,50,38,0.08)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
                  Signed in
                </p>

                <h2 className="mt-4 font-serif text-4xl leading-tight">
                  You’re already signed in.
                </h2>

                <p className="mt-4 text-sm leading-6 text-[#5f574d]">
                  You’re signed in as {user.email}.
                </p>

                <Link
                  href="/profile"
                  className="mt-7 inline-flex rounded-xl bg-[#4f5d3d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#414d31]"
                >
                  Go to my Willa
                </Link>
              </div>
            ) : (
              <LoginForm />
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}