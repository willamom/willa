import type {
  CarePlanTask,
  PillarCard,
  SearchChip,
  TrustItem,
  VillageProvider,
} from '@/types/home'

export const searchChips: SearchChip[] = [
  {
    label: 'I’m home from the hospital',
    icon: '⌂',
  },
  {
    label: 'Postpartum bleeding',
    icon: '♧',
  },
  {
    label: 'Feeding pain',
    icon: '♡',
  },
  {
    label: 'Visitors & boundaries',
    icon: '♢',
  },
  {
    label: 'Feeling overwhelmed',
    icon: '♥',
  },
]

export const pillarCards: PillarCard[] = [
  {
    title: 'Find trusted answers',
    description: 'Guides for every stage of pregnancy, birth, and postpartum.',
    icon: 'answers',
    iconBg: 'bg-[#f5ded5]',
    iconColor: 'text-[#c96f5c]',
    action: 'Browse guides',
  },
  {
    title: 'Build your care plan',
    description:
      'Personalized checklists and timelines for before birth and beyond.',
    icon: 'plan',
    iconBg: 'bg-[#e8ede0]',
    iconColor: 'text-[#596946]',
    action: 'Create your plan',
  },
  {
    title: 'Create your registry',
    description: 'Add the products, services, and support you actually need.',
    icon: 'registry',
    iconBg: 'bg-[#eee7f2]',
    iconColor: 'text-[#7d6694]',
    action: 'Build your registry',
  },
  {
    title: 'Find your village',
    description: 'Connect with trusted professionals and helpful people near you.',
    icon: 'village',
    iconBg: 'bg-[#f3e3cf]',
    iconColor: 'text-[#bd7a3f]',
    action: 'Find support',
  },
]

export const beforeBabyTasks: CarePlanTask[] = [
  {
    label: 'Prepare freezer meals',
    checked: true,
  },
  {
    label: 'Pack hospital bag',
  },
  {
    label: 'Set up feeding station',
  },
]

export const afterBabyTasks: CarePlanTask[] = [
  {
    label: 'Postpartum check-in',
  },
  {
    label: 'Pelvic floor support',
  },
  {
    label: 'Ask for meal help',
  },
]

export const villageProviders: VillageProvider[] = [
  {
    name: 'Maya Collins',
    type: 'Lactation Consultant',
    location: 'Austin, TX',
  },
  {
    name: 'Rooted Doula Co.',
    type: 'Postpartum Doula',
    location: 'Austin, TX',
  },
  {
    name: 'Claire Bowen',
    type: 'Pelvic Floor Therapist',
    location: 'Austin, TX',
  },
]

export const trustItems: TrustItem[] = [
  {
    title: 'Made by moms',
    description: 'We get it because we’ve lived it.',
    icon: 'heart',
    iconBg: 'bg-[#f5ded5]',
    iconColor: 'text-[#b86a5b]',
  },
  {
    title: 'Expert reviewed',
    description: 'Content written and reviewed with health professionals.',
    icon: 'shield',
    iconBg: 'bg-[#e8ede0]',
    iconColor: 'text-[#596946]',
  },
  {
    title: 'Private & secure',
    description: 'Your data is yours. Always.',
    icon: 'lock',
    iconBg: 'bg-[#eee7f2]',
    iconColor: 'text-[#75638a]',
  },
  {
    title: 'Here for the whole journey',
    description: 'From pregnancy through postpartum and beyond.',
    icon: 'leaf',
    iconBg: 'bg-[#f3e3cf]',
    iconColor: 'text-[#b87943]',
  },
]