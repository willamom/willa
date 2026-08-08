import AdminLoginForm from '@/components/admin/AdminLoginForm'
import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `Admin Login | ${siteConfig.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: {
    next?: string
  }
}) {
  const nextPath =
    searchParams?.next && searchParams.next.startsWith('/admin')
      ? searchParams.next
      : '/admin'

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4 py-10 text-[#211f1b]">
      <section className="w-full max-w-md rounded-[2rem] border border-[#e2d7c8] bg-white/80 p-6 shadow-[0_24px_80px_rgba(61,50,38,0.08)] sm:p-8">
        <p className="font-serif text-4xl font-semibold tracking-tight text-[#39472c]">
          willa
        </p>

        <h1 className="mt-6 font-serif text-4xl leading-tight text-[#211f1b]">
          Admin login
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#655d52]">
          Private access for Willa admin tools.
        </p>

        <AdminLoginForm nextPath={nextPath} />
      </section>
    </main>
  )
}