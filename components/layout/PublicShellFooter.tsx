import Link from 'next/link'

export default function PublicShellFooter() {
  return (
    <footer className="bg-[#fbf7ef] px-5 pb-8 pt-10 text-sm text-[#655d52] sm:px-8 lg:px-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-[#e8ded1] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Willa. Mom-first care planning.</p>

        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="transition hover:text-[#211f1b]">
            Privacy
          </Link>

          <Link href="/terms" className="transition hover:text-[#211f1b]">
            Terms
          </Link>

          <Link href="/cookies" className="transition hover:text-[#211f1b]">
            Cookies
          </Link>

          <Link href="/disclaimer" className="transition hover:text-[#211f1b]">
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  )
}