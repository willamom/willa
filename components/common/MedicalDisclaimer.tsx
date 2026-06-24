import Link from 'next/link'

export default function MedicalDisclaimer() {
  return (
    <section className="rounded-[2rem] border border-[#e2d7c8] bg-[#fbf7ef] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39472c]">
        Gentle note
      </p>

      <p className="mt-3 text-sm leading-6 text-[#5f574d]">
        Willa is here to help you organize questions, guides, support, and care
        ideas. It is not medical advice and does not replace your doctor,
        midwife, lactation consultant, therapist, or emergency care.
      </p>

      <Link
        href="/disclaimer"
        className="mt-4 inline-flex text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
      >
        Read the full disclaimer →
      </Link>
    </section>
  )
}