import Link from 'next/link'

const popularGuides = [
  {
    title: 'What do I actually need after birth?',
    category: 'Postpartum',
    readTime: '7 min',
    description:
      'A realistic guide to recovery, bleeding, food, help, visitors, and the tiny things that suddenly matter.',
    tag: 'Start here',
  },
  {
    title: 'How to ask for help without feeling awkward',
    category: 'Support',
    readTime: '5 min',
    description:
      'Scripts, examples, and practical ways to tell people exactly what would help after baby arrives.',
    tag: 'Most saved',
  },
  {
    title: 'Baby blues vs postpartum depression',
    category: 'Mental health',
    readTime: '8 min',
    description:
      'What can be normal, what needs support, and when it is time to reach out to someone trained.',
    tag: 'Important',
  },
  {
    title: 'What to put on a registry for mom',
    category: 'Registry',
    readTime: '6 min',
    description:
      'Not another list of onesies. Meals, recovery care, lactation help, home support, and rest.',
    tag: 'Coming next',
  },
]

const guideCategories = [
  {
    title: 'Pregnancy',
    count: '18 guides',
    description: 'Symptoms, appointments, planning, body changes, and what is worth preparing.',
    icon: '◐',
  },
  {
    title: 'Birth',
    count: '14 guides',
    description: 'Hospital bags, birth plans, doulas, interventions, recovery, and the first hours.',
    icon: '✦',
  },
  {
    title: 'Postpartum',
    count: '26 guides',
    description: 'The messy, tender, underslept bit people keep calling magical and then underexplaining.',
    icon: '☾',
  },
  {
    title: 'Feeding',
    count: '21 guides',
    description: 'Breastfeeding, bottles, combo feeding, pumping, formula, and support without judgment.',
    icon: '◡',
  },
  {
    title: 'Recovery',
    count: '17 guides',
    description: 'Bleeding, stitches, C-section recovery, pelvic floor, pain, movement, and healing.',
    icon: '♡',
  },
  {
    title: 'Mental Health',
    count: '15 guides',
    description: 'Baby blues, anxiety, rage, depression, identity shifts, support, and warning signs.',
    icon: '☁',
  },
]

const quickQuestions = [
  'Is this bleeding normal?',
  'What should I ask visitors to do?',
  'Do I need a postpartum doula?',
  'When should breastfeeding stop hurting?',
  'What do I need after a C-section?',
  'How do I make a freezer meal plan?',
  'What should go on my mom registry?',
  'How do I know if I need pelvic floor therapy?',
]

const answerCards = [
  {
    question: 'I am 3 days postpartum and crying a lot. Is that normal?',
    answer:
      'It can be common to feel very emotional in the first days after birth, but you should not be left alone with it. Willa explains what baby blues can feel like, what is not normal, and who to contact.',
    cta: 'Read the guide',
  },
  {
    question: 'Everyone wants to visit. I want help, not guests.',
    answer:
      'You are allowed to make rules. Willa gives you scripts for visitors, meal drop-offs, sibling help, cleaning help, and how to say no without writing a courtroom statement.',
    cta: 'Get the scripts',
  },
  {
    question: 'People keep asking what to buy. I need actual support.',
    answer:
      'Start with a care list: meals, recovery items, lactation help, cleaning, childcare, mental health support, and rest. Later, this becomes your Willa registry.',
    cta: 'Build a care list',
  },
]

const roadmapItems = [
  {
    step: '01',
    title: 'Read the guide',
    description: 'Clear answers first. No 900-comment spiral. No weirdly cheerful nonsense.',
  },
  {
    step: '02',
    title: 'Know what you need',
    description: 'Each guide ends with practical next steps, what to prepare, and when to ask for help.',
  },
  {
    step: '03',
    title: 'Turn it into support',
    description: 'Later, Willa will turn those needs into a registry, care plan, provider map, and support list.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f3eb] text-[#292620]">
      <Header />

      <section className="relative overflow-hidden border-b border-[#e6dccd]">
        <div className="absolute left-[-12rem] top-[-14rem] h-[36rem] w-[36rem] rounded-full bg-[#e7d7c4] blur-3xl" />
        <div className="absolute bottom-[-18rem] right-[-12rem] h-[40rem] w-[40rem] rounded-full bg-[#d9dfcc] blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-14 lg:py-24">
          <div className="flex items-center">
            <div className="max-w-2xl">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.32em] text-[#637049]">
                Pregnancy, birth & postpartum guides
              </p>

              <h1 className="font-serif text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                The manual mothers end up searching for at{' '}
                <span className="italic text-[#9b6f62]">3:07am</span>.
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-[#625c52]">
                Willa gives clear, practical guides for pregnancy, birth,
                postpartum, recovery, feeding, mental health, and asking for
                help. Less panic-searching. More knowing what to do next.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#popular"
                  className="rounded-full bg-[#53603f] px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#445033]"
                >
                  Browse guides
                </Link>

                <Link
                  href="#ask"
                  className="rounded-full border border-[#b8ad9e] bg-white/65 px-7 py-4 text-center text-sm font-semibold text-[#292620] transition hover:bg-white"
                >
                  Ask Willa
                </Link>
              </div>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <Stat number="100+" label="planned guides" />
                <Stat number="7" label="motherhood stages" />
                <Stat number="0" label="judgy lectures" />
              </div>
            </div>
          </div>

          <HeroPanel />
        </div>
      </section>

      <section
        id="popular"
        className="border-b border-[#e6dccd] px-6 py-16 sm:px-10 lg:px-14"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#637049]">
                Start here
              </p>

              <h2 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
                Popular guides for the foggy parts.
              </h2>
            </div>

            <Link
              href="#categories"
              className="text-sm font-semibold text-[#53603f] hover:text-[#292620]"
            >
              View all topics →
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {popularGuides.map((guide) => (
              <GuideCard key={guide.title} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="ask"
        className="grid border-b border-[#e6dccd] bg-[#eef0e6] lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="px-6 py-14 sm:px-10 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#637049]">
            Ask Willa
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Short answers first. Deeper guides when you need them.
          </h2>

          <p className="mt-5 max-w-md leading-8 text-[#625c52]">
            Think FAQ, tutorial, and the useful parts of Reddit, without making
            you dig through 312 replies while holding a baby and a cold coffee.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {quickQuestions.slice(0, 4).map((question) => (
              <Link
                key={question}
                href="#"
                className="rounded-full border border-[#cdd2c0] bg-white/60 px-4 py-2 text-sm text-[#4f5741] transition hover:bg-white"
              >
                {question}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 px-6 py-14 sm:px-10 lg:px-14">
          {answerCards.map((card) => (
            <article
              key={card.question}
              className="rounded-3xl border border-[#dfe4d5] bg-[#fbfaf6] p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-[#53603f]">
                “{card.question}”
              </p>

              <p className="mt-4 leading-7 text-[#625c52]">{card.answer}</p>

              <Link
                href="#"
                className="mt-5 inline-flex text-sm font-semibold text-[#53603f] hover:text-[#292620]"
              >
                {card.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        id="categories"
        className="border-b border-[#e6dccd] px-6 py-16 sm:px-10 lg:px-14"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#637049]">
              Browse by stage
            </p>

            <h2 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              The answers change depending on where you are.
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#625c52]">
              Pregnancy is not postpartum. Birth is not recovery. Feeding is not
              one neat little lane. Willa keeps the mess organized.
            </p>
          </div>

          <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {guideCategories.map((category) => (
              <CategoryCard key={category.title} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#e6dccd] bg-[#fbfaf6] px-6 py-16 sm:px-10 lg:px-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#637049]">
              Guide format
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Every guide should leave you calmer and more prepared.
            </h2>

            <p className="mt-5 max-w-md leading-8 text-[#625c52]">
              Not longer for the sake of longer. Not medical cosplay. Just
              clear sections that help a mother understand what is happening,
              what to do, what to buy or prepare, and when to get help.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#e1d7c8] bg-[#f8f3eb] p-5 shadow-sm sm:p-7">
            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#53603f]">
                  Postpartum
                </span>
                <span className="text-xs text-[#7b7368]">7 min read</span>
              </div>

              <h3 className="mt-5 font-serif text-3xl leading-tight">
                What do I actually need after birth?
              </h3>

              <div className="mt-6 space-y-4">
                <GuideSection title="Quick answer">
                  You need recovery supplies, food, rest, help at home, feeding
                  support if needed, and a plan for visitors before they start
                  arriving with opinions and tiny socks.
                </GuideSection>

                <GuideSection title="What to prepare">
                  Bathroom basket, bedside basket, freezer meals, visitor rules,
                  emergency contacts, feeding station, and a list of people who
                  can help without needing a full diplomatic briefing.
                </GuideSection>

                <GuideSection title="When to ask for help">
                  Heavy bleeding, fever, severe pain, scary thoughts, worsening
                  mood, feeding pain, or anything that makes you feel unsafe or
                  ignored.
                </GuideSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e6dccd] px-6 py-16 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-3">
            {roadmapItems.map((item) => (
              <article
                key={item.step}
                className="rounded-[2rem] border border-[#e1d7c8] bg-white/65 p-7"
              >
                <p className="text-sm font-semibold text-[#9b6f62]">
                  {item.step}
                </p>

                <h3 className="mt-5 font-serif text-3xl">{item.title}</h3>

                <p className="mt-4 leading-7 text-[#625c52]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ded2c4] px-6 py-16 sm:px-10 lg:px-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#637049]">
              Registry comes later
            </p>

            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              First Willa teaches you what you need. Then it helps you ask for it.
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-[#5d554b]">
              Guides first. Registry, provider map, support directory, and care
              plan later. A quiet little empire, built in the right order.
            </p>
          </div>

          <Link
            href="#popular"
            className="inline-flex rounded-full bg-[#53603f] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#445033]"
          >
            Start reading
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e6dccd] bg-[#fbfaf6]/90 px-6 py-4 backdrop-blur-xl sm:px-10 lg:px-14">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link href="/" className="font-serif text-4xl font-semibold tracking-tight">
          willa
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#292620] lg:flex">
          <Link href="#popular" className="hover:text-[#53603f]">
            Guides
          </Link>
          <Link href="#ask" className="hover:text-[#53603f]">
            Ask Willa
          </Link>
          <Link href="#categories" className="hover:text-[#53603f]">
            Topics
          </Link>
          <Link href="#" className="hover:text-[#53603f]">
            Registry
          </Link>
          <Link href="#" className="hover:text-[#53603f]">
            About
          </Link>
        </nav>

        <Link
          href="#popular"
          className="rounded-full bg-[#53603f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#445033]"
        >
          Read guides
        </Link>
      </div>
    </header>
  )
}

function HeroPanel() {
  return (
    <div className="relative">
      <div className="absolute -right-6 top-8 hidden rounded-full bg-[#9b6f62] px-5 py-3 text-sm font-semibold text-white shadow-lg sm:block">
        3:07 AM search mode
      </div>

      <div className="rounded-[2.5rem] border border-[#e1d7c8] bg-[#fbfaf6] p-5 shadow-xl sm:p-7">
        <div className="rounded-[2rem] bg-[#292620] p-5 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#c8b9a8]">
                Willa guide finder
              </p>
              <h2 className="mt-2 font-serif text-3xl">What do you need?</h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              ☾
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-4 text-[#292620]">
            <p className="text-sm text-[#7b7368]">
              Search pregnancy, birth, postpartum, feeding, recovery...
            </p>
            <p className="mt-2 font-medium">
              “I’m home from the hospital. Now what?”
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MiniTopic title="Postpartum bleeding" label="What is normal?" />
            <MiniTopic title="Visitors" label="Scripts that work" />
            <MiniTopic title="Feeding pain" label="When to get help" />
            <MiniTopic title="Mom registry" label="What to ask for" />
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.5rem] bg-[#eef0e6] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#637049]">
              Today’s guide
            </p>

            <h3 className="mt-3 font-serif text-2xl leading-tight">
              How to make visitors useful after birth
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#625c52]">
              Tell them what to bring, what to do, when to leave, and why
              holding the baby is not a personality trait.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-[#eadfd4] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b6f62]">
              Later becomes
            </p>

            <h3 className="mt-3 font-serif text-2xl leading-tight">
              Your care plan
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#625c52]">
              Save guide takeaways, build your registry, and turn “I need help”
              into something people can actually do.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[#e1d7c8] bg-white/55 p-4">
      <p className="font-serif text-3xl">{number}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#7b7368]">
        {label}
      </p>
    </div>
  )
}

function GuideCard({
  guide,
}: {
  guide: {
    title: string
    category: string
    readTime: string
    description: string
    tag: string
  }
}) {
  return (
    <article className="group flex min-h-[320px] flex-col justify-between rounded-[2rem] border border-[#e1d7c8] bg-[#fbfaf6] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#eef0e6] px-3 py-1 text-xs font-semibold text-[#53603f]">
            {guide.category}
          </span>

          <span className="text-xs text-[#7b7368]">{guide.readTime}</span>
        </div>

        <h3 className="font-serif text-3xl leading-tight">{guide.title}</h3>

        <p className="mt-4 leading-7 text-[#625c52]">{guide.description}</p>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-[#e8dfd2] pt-5">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b6f62]">
          {guide.tag}
        </span>

        <Link
          href="#"
          className="text-sm font-semibold text-[#53603f] group-hover:text-[#292620]"
        >
          Read →
        </Link>
      </div>
    </article>
  )
}

function CategoryCard({
  category,
}: {
  category: {
    title: string
    count: string
    description: string
    icon: string
  }
}) {
  return (
    <article className="rounded-[2rem] border border-[#e1d7c8] bg-[#fbfaf6] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef0e6] text-2xl text-[#53603f]">
          {category.icon}
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-xs text-[#7b7368]">
          {category.count}
        </span>
      </div>

      <h3 className="font-serif text-3xl">{category.title}</h3>

      <p className="mt-4 leading-7 text-[#625c52]">{category.description}</p>

      <Link
        href="#"
        className="mt-6 inline-flex text-sm font-semibold text-[#53603f] hover:text-[#292620]"
      >
        Explore {category.title.toLowerCase()} →
      </Link>
    </article>
  )
}

function MiniTopic({ title, label }: { title: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-[#d8cab9]">{label}</p>
    </div>
  )
}

function GuideSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#e8dfd2] bg-[#fbfaf6] p-5">
      <h4 className="font-semibold text-[#53603f]">{title}</h4>
      <p className="mt-2 leading-7 text-[#625c52]">{children}</p>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[#e6dccd] bg-[#fbfaf6] px-6 py-8 sm:px-10 lg:px-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#625c52] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Willa</p>
        <p>
          Practical guides for mothers. Not medical advice, not a replacement
          for care.
        </p>
      </div>
    </footer>
  )
}