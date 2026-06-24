import Link from 'next/link'

export default function PublicShellHeader() {
  return (
    <header className="border-b border-[#eee6da] bg-[#fbf7ef]/94 px-5 py-5 backdrop-blur-xl sm:px-8 lg:px-14">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link
          href="/"
          className="font-serif text-4xl font-semibold tracking-tight text-[#39472c]"
        >
          willa
        </Link>

        <span className="rounded-full border border-[#e2d7c8] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f5d3d] shadow-sm">
          Coming soon
        </span>
      </div>
    </header>
  )
}