import { createClient } from '@/lib/supabase/client'

export type SavedQuestionItem = {
  id: string
  question: string
  tag: string
  savedAt: string
}

export const SAVED_QUESTIONS_KEY = 'willa_saved_questions'
export const SAVED_QUESTIONS_UPDATED_EVENT = 'willa-saved-questions-updated'

const MIGRATED_SAVED_QUESTIONS_KEY_PREFIX = 'willa_saved_questions_migrated_'

type SavedQuestionRow = {
  question_id: string
  question: string
  tag: string
  saved_at: string
}

export function slugifyQuestion(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function buildQuestionId(question: string) {
  return `question-${slugifyQuestion(question)}`
}

export function getSavedQuestions(): SavedQuestionItem[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(SAVED_QUESTIONS_KEY)

  if (!stored) return []

  try {
    return JSON.parse(stored) as SavedQuestionItem[]
  } catch {
    return []
  }
}

export function saveQuestion(question: string): SavedQuestionItem[] {
  if (typeof window === 'undefined') return []

  const trimmedQuestion = question.trim()

  if (!trimmedQuestion) return getSavedQuestions()

  const currentQuestions = getSavedQuestions()
  const questionId = buildQuestionId(trimmedQuestion)

  const alreadySaved = currentQuestions.some((item) => item.id === questionId)

  if (alreadySaved) return currentQuestions

  const nextQuestions: SavedQuestionItem[] = [
    {
      id: questionId,
      question: trimmedQuestion,
      tag: 'Saved question',
      savedAt: new Date().toISOString(),
    },
    ...currentQuestions,
  ]

  setLocalSavedQuestions(nextQuestions)
  dispatchSavedQuestionsUpdated()

  return nextQuestions
}

export function removeQuestion(questionId: string): SavedQuestionItem[] {
  if (typeof window === 'undefined') return []

  const nextQuestions = getSavedQuestions().filter(
    (question) => question.id !== questionId
  )

  setLocalSavedQuestions(nextQuestions)
  dispatchSavedQuestionsUpdated()

  return nextQuestions
}

export async function getSavedQuestionsForCurrentUser(): Promise<
  SavedQuestionItem[]
> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return getSavedQuestions()
  }

  await migrateLocalSavedQuestionsToSupabase(user.id)

  const { data, error } = await supabase
    .from('saved_questions')
    .select('question_id, question, tag, saved_at')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  if (error) {
    console.error(error)
    return getSavedQuestions()
  }

  const questions = (data || []).map(mapSavedQuestionRow)

  setLocalSavedQuestions(questions)

  return questions
}

export async function saveQuestionForCurrentUser(
  question: string
): Promise<SavedQuestionItem[]> {
  if (typeof window === 'undefined') return []

  const trimmedQuestion = question.trim()

  if (!trimmedQuestion) {
    return getSavedQuestionsForCurrentUser()
  }

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return saveQuestion(trimmedQuestion)
  }

  const questionId = buildQuestionId(trimmedQuestion)

  const { error } = await supabase.from('saved_questions').upsert(
    {
      user_id: user.id,
      question_id: questionId,
      question: trimmedQuestion,
      tag: 'Saved question',
      saved_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,question_id',
    }
  )

  if (error) {
    console.error(error)
    return saveQuestion(trimmedQuestion)
  }

  const nextQuestions = await getSavedQuestionsForCurrentUser()

  dispatchSavedQuestionsUpdated()

  return nextQuestions
}

export async function removeQuestionForCurrentUser(
  questionId: string
): Promise<SavedQuestionItem[]> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return removeQuestion(questionId)
  }

  const { error } = await supabase
    .from('saved_questions')
    .delete()
    .eq('user_id', user.id)
    .eq('question_id', questionId)

  if (error) {
    console.error(error)
    return removeQuestion(questionId)
  }

  const nextQuestions = await getSavedQuestionsForCurrentUser()

  dispatchSavedQuestionsUpdated()

  return nextQuestions
}

export function dispatchSavedQuestionsUpdated() {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(SAVED_QUESTIONS_UPDATED_EVENT))
}

function setLocalSavedQuestions(questions: SavedQuestionItem[]) {
  if (typeof window === 'undefined') return

  localStorage.setItem(SAVED_QUESTIONS_KEY, JSON.stringify(questions))
}

async function migrateLocalSavedQuestionsToSupabase(userId: string) {
  if (typeof window === 'undefined') return

  const migrationKey = `${MIGRATED_SAVED_QUESTIONS_KEY_PREFIX}${userId}`

  if (localStorage.getItem(migrationKey) === 'true') return

  const localQuestions = getSavedQuestions()

  if (localQuestions.length === 0) {
    localStorage.setItem(migrationKey, 'true')
    return
  }

  const supabase = createClient()

  const { error } = await supabase.from('saved_questions').upsert(
    localQuestions.map((question) => ({
      user_id: userId,
      question_id: question.id,
      question: question.question,
      tag: question.tag,
      saved_at: question.savedAt,
    })),
    {
      onConflict: 'user_id,question_id',
    }
  )

  if (error) {
    console.error(error)
    return
  }

  localStorage.setItem(migrationKey, 'true')
}

function mapSavedQuestionRow(row: SavedQuestionRow): SavedQuestionItem {
  return {
    id: row.question_id,
    question: row.question,
    tag: row.tag,
    savedAt: row.saved_at,
  }
}