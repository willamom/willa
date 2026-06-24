const MS_PER_DAY = 1000 * 60 * 60 * 24
const FULL_TERM_DAYS = 280

type PregnancyProgress = {
  daysUntilDue: number
  gestationalDays: number
  week: number
  day: number
  trimester: string
  progressPercent: number
  dueDateLabel: string
  weekLabel: string
  daysLabel: string
}

function parseDateAsUTC(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)

  return new Date(Date.UTC(year, month - 1, day))
}

function getTodayAsUTC() {
  const now = new Date()

  return new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getTrimester(week: number) {
  if (week < 14) return 'First trimester'
  if (week < 28) return 'Second trimester'

  return 'Third trimester'
}

export function getPregnancyProgress(dueDate: string): PregnancyProgress {
  const due = parseDateAsUTC(dueDate)
  const today = getTodayAsUTC()

  const daysUntilDue = Math.ceil(
    (due.getTime() - today.getTime()) / MS_PER_DAY
  )

  const gestationalDays = clamp(
    FULL_TERM_DAYS - daysUntilDue,
    0,
    FULL_TERM_DAYS
  )

  const week = Math.floor(gestationalDays / 7)
  const day = gestationalDays % 7

  const progressPercent = Math.round(
    (gestationalDays / FULL_TERM_DAYS) * 100
  )

  const dueDateLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(due)

  const weekLabel = day === 0 ? `${week} weeks pregnant` : `${week}w + ${day}d pregnant`

  const daysLabel =
    daysUntilDue > 1
      ? `${daysUntilDue} days until due date`
      : daysUntilDue === 1
        ? '1 day until due date'
        : 'Due date has arrived'

  return {
    daysUntilDue,
    gestationalDays,
    week,
    day,
    trimester: getTrimester(week),
    progressPercent,
    dueDateLabel,
    weekLabel,
    daysLabel,
  }
}