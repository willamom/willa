export type ProfileTask = {
  label: string
  checked?: boolean
}

export type ProfileGuide = {
  title: string
  description: string
  category: string
  readTime: string
  href: string
}

export type ProfileQuestion = {
  question: string
  tag: string
  href: string
}

export type RegistryIdea = {
  title: string
  description: string
  category: string
}

export type ProfileRegistryIdea = RegistryIdea

export type NearMeProvider = {
  type: string
  description: string
  distance: string
  href: string
}

export type ProfileNearMeProvider = NearMeProvider

export type WillaProfile = {
  name: string
  dueDate: string
  location: string
  note: string
  focusItems: string[]
  beforeBabyTasks: ProfileTask[]
  afterBabyTasks: ProfileTask[]
  suggestedGuides: ProfileGuide[]
  savedQuestions: ProfileQuestion[]
  registryIdeas: RegistryIdea[]
  nearMeProviders: NearMeProvider[]
}