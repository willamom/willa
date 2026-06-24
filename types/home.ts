export type PillarCard = {
  title: string
  description: string
  icon: 'answers' | 'plan' | 'registry' | 'village'
  iconBg: string
  iconColor: string
  action: string
}

export type SearchChip = {
  label: string
  icon: string
}

export type TrustItem = {
  title: string
  description: string
  icon: 'heart' | 'shield' | 'lock' | 'leaf'
  iconBg: string
  iconColor: string
}

export type CarePlanTask = {
  label: string
  checked?: boolean
}

export type VillageProvider = {
  name: string
  type: string
  location: string
}