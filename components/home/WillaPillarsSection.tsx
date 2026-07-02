import { pillarCards } from '@/data/home'

import PillarCard from './cards/PillarCard'

export default function WillaPillarsSection() {
  return (
    <section className="px-4 pb-10 pt-4 sm:px-8 sm:pb-14 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39472c]">
            Your care home base
          </p>

          <h2 className="mt-4 font-serif text-[2.35rem] leading-[1.08] tracking-tight text-[#211f1b] sm:text-5xl">
            Everything <span className="italic text-[#a45f51]">you</span> need,
            all in one place.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#5f574d] sm:text-base sm:leading-7">
            Willa brings together the parts of motherhood prep that usually end
            up scattered across group chats, notes apps, registries, and late
            night searches.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-4 sm:gap-5 md:grid-cols-2 lg:mt-9 lg:grid-cols-4">
          {pillarCards.map((card) => (
            <PillarCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
