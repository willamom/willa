import { pillarCards } from '@/data/home'

import PillarCard from './cards/PillarCard'

export default function WillaPillarsSection() {
  return (
    <section className="px-4 pb-10 pt-16 sm:px-8 sm:pb-14 sm:pt-20 lg:px-14 lg:pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-4 font-serif text-[2.35rem] leading-[1.08] tracking-tight text-[#211f1b] sm:text-5xl">
            Everything <span className="italic text-[#a45f51]">you</span> need,
            all in one place.
          </h2>
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