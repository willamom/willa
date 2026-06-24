import { createClient } from '@/lib/supabase/client'

export type StoredTaskState = Record<string, boolean>

export type CarePlanTaskGroupKey = 'before' | 'after' | 'added'

export type AddedCareTask = {
  id: string
  label: string
  sourceSlug?: string
  sourceTitle?: string
}

export type CarePlanProfileTaskInput = {
  id: string
  label: string
  groupKey: Exclude<CarePlanTaskGroupKey, 'added'>
  checked: boolean
}

export type CarePlanTaskInput = {
  id: string
  label: string
  groupKey: CarePlanTaskGroupKey
  checked: boolean
  sourceSlug?: string
  sourceTitle?: string
}

export type CarePlanSnapshot = {
  taskState: StoredTaskState
  addedTasks: AddedCareTask[]
}

export const CARE_PLAN_TASK_STATE_KEY = 'willa_care_plan_tasks'
export const ADDED_CARE_TASKS_KEY = 'willa_added_care_tasks'
export const CARE_PLAN_UPDATED_EVENT = 'willa-care-plan-updated'

const MIGRATED_CARE_PLAN_KEY_PREFIX = 'willa_care_plan_migrated_'

type CarePlanTaskRow = {
  task_id: string
  label: string
  checked: boolean
  group_key: CarePlanTaskGroupKey
  source_slug: string | null
  source_title: string | null
}

export function slugifyCareTask(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function buildAddedCareTaskId(sourceSlug: string, label: string) {
  return `guide-${sourceSlug}-${slugifyCareTask(label)}`
}

export function buildCustomCareTaskId(label: string) {
  return `custom-${slugifyCareTask(label)}`
}

export function getStoredTaskState(): StoredTaskState {
  if (typeof window === 'undefined') return {}

  const stored = localStorage.getItem(CARE_PLAN_TASK_STATE_KEY)

  if (!stored) return {}

  try {
    return JSON.parse(stored) as StoredTaskState
  } catch {
    return {}
  }
}

export function setStoredTaskState(state: StoredTaskState) {
  if (typeof window === 'undefined') return

  localStorage.setItem(CARE_PLAN_TASK_STATE_KEY, JSON.stringify(state))
}

export function getAddedCareTasks(): AddedCareTask[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(ADDED_CARE_TASKS_KEY)

  if (!stored) return []

  try {
    return JSON.parse(stored) as AddedCareTask[]
  } catch {
    return []
  }
}

export function saveAddedCareTask(task: AddedCareTask) {
  if (typeof window === 'undefined') return []

  const currentTasks = getAddedCareTasks()
  const alreadyExists = currentTasks.some((item) => item.id === task.id)

  if (alreadyExists) return currentTasks

  const nextTasks = [task, ...currentTasks]

  setLocalAddedCareTasks(nextTasks)
  dispatchCarePlanUpdated()

  return nextTasks
}

export function removeAddedCareTask(taskId: string) {
  if (typeof window === 'undefined') return []

  const nextTasks = getAddedCareTasks().filter((task) => task.id !== taskId)

  const storedTaskState = getStoredTaskState()
  const nextStoredTaskState = { ...storedTaskState }

  delete nextStoredTaskState[taskId]

  setLocalAddedCareTasks(nextTasks)
  setStoredTaskState(nextStoredTaskState)
  dispatchCarePlanUpdated()

  return nextTasks
}

export async function getCarePlanForCurrentUser(
  profileTasks: CarePlanProfileTaskInput[] = []
): Promise<CarePlanSnapshot> {
  if (typeof window === 'undefined') {
    return {
      taskState: {},
      addedTasks: [],
    }
  }

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      taskState: getStoredTaskState(),
      addedTasks: getAddedCareTasks(),
    }
  }

  await migrateLocalCarePlanToSupabase(user.id, profileTasks)

  const firstFetch = await fetchCarePlanRows(user.id)

  if (firstFetch.error) {
    console.error(firstFetch.error)

    return {
      taskState: getStoredTaskState(),
      addedTasks: getAddedCareTasks(),
    }
  }

  let rows = firstFetch.rows

  const existingTaskIds = new Set(rows.map((row) => row.task_id))
  const missingProfileTasks = profileTasks.filter(
    (task) => !existingTaskIds.has(task.id)
  )

  if (missingProfileTasks.length > 0) {
    const localState = getStoredTaskState()

    const { error } = await supabase.from('care_plan_tasks').upsert(
      missingProfileTasks.map((task) => ({
        user_id: user.id,
        task_id: task.id,
        label: task.label,
        checked: localState[task.id] ?? task.checked,
        group_key: task.groupKey,
      })),
      {
        onConflict: 'user_id,task_id',
      }
    )

    if (error) {
      console.error(error)
    }

    const secondFetch = await fetchCarePlanRows(user.id)

    if (!secondFetch.error) {
      rows = secondFetch.rows
    }
  }

  const snapshot = mapCarePlanRows(rows)

  setStoredTaskState(snapshot.taskState)
  setLocalAddedCareTasks(snapshot.addedTasks)

  return snapshot
}

export async function getAddedCareTasksForCurrentUser(): Promise<
  AddedCareTask[]
> {
  const snapshot = await getCarePlanForCurrentUser()

  return snapshot.addedTasks
}

export async function saveAddedCareTaskForCurrentUser(
  task: AddedCareTask
): Promise<AddedCareTask[]> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return saveAddedCareTask(task)
  }

  const localState = getStoredTaskState()

  const { error } = await supabase.from('care_plan_tasks').upsert(
    {
      user_id: user.id,
      task_id: task.id,
      label: task.label,
      checked: localState[task.id] ?? false,
      group_key: 'added',
      source_slug: task.sourceSlug || null,
      source_title: task.sourceTitle || null,
    },
    {
      onConflict: 'user_id,task_id',
    }
  )

  if (error) {
    console.error(error)
    return saveAddedCareTask(task)
  }

  const snapshot = await getCarePlanForCurrentUser()

  dispatchCarePlanUpdated()

  return snapshot.addedTasks
}

export async function removeAddedCareTaskForCurrentUser(
  taskId: string
): Promise<AddedCareTask[]> {
  if (typeof window === 'undefined') return []

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return removeAddedCareTask(taskId)
  }

  const { error } = await supabase
    .from('care_plan_tasks')
    .delete()
    .eq('user_id', user.id)
    .eq('task_id', taskId)

  if (error) {
    console.error(error)
    return removeAddedCareTask(taskId)
  }

  const localTasks = getAddedCareTasks().filter((task) => task.id !== taskId)
  const localState = getStoredTaskState()
  const nextLocalState = { ...localState }

  delete nextLocalState[taskId]

  setLocalAddedCareTasks(localTasks)
  setStoredTaskState(nextLocalState)

  const snapshot = await getCarePlanForCurrentUser()

  dispatchCarePlanUpdated()

  return snapshot.addedTasks
}

export async function setCarePlanTaskCheckedForCurrentUser(
  task: CarePlanTaskInput,
  checked: boolean
) {
  if (typeof window === 'undefined') return

  const nextLocalState = {
    ...getStoredTaskState(),
    [task.id]: checked,
  }

  setStoredTaskState(nextLocalState)

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    dispatchCarePlanUpdated()
    return
  }

  const { error } = await supabase.from('care_plan_tasks').upsert(
    {
      user_id: user.id,
      task_id: task.id,
      label: task.label,
      checked,
      group_key: task.groupKey,
      source_slug: task.sourceSlug || null,
      source_title: task.sourceTitle || null,
    },
    {
      onConflict: 'user_id,task_id',
    }
  )

  if (error) {
    console.error(error)
  }

  dispatchCarePlanUpdated()
}

export function dispatchCarePlanUpdated() {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(CARE_PLAN_UPDATED_EVENT))
}

function setLocalAddedCareTasks(tasks: AddedCareTask[]) {
  if (typeof window === 'undefined') return

  localStorage.setItem(ADDED_CARE_TASKS_KEY, JSON.stringify(tasks))
}

async function migrateLocalCarePlanToSupabase(
  userId: string,
  profileTasks: CarePlanProfileTaskInput[]
) {
  if (typeof window === 'undefined') return

  const migrationKey = `${MIGRATED_CARE_PLAN_KEY_PREFIX}${userId}`

  if (localStorage.getItem(migrationKey) === 'true') return

  const localState = getStoredTaskState()
  const localAddedTasks = getAddedCareTasks()

  const rows = [
    ...profileTasks.map((task) => ({
      user_id: userId,
      task_id: task.id,
      label: task.label,
      checked: localState[task.id] ?? task.checked,
      group_key: task.groupKey,
      source_slug: null,
      source_title: null,
    })),
    ...localAddedTasks.map((task) => ({
      user_id: userId,
      task_id: task.id,
      label: task.label,
      checked: localState[task.id] ?? false,
      group_key: 'added',
      source_slug: task.sourceSlug || null,
      source_title: task.sourceTitle || null,
    })),
  ]

  if (rows.length === 0) {
    localStorage.setItem(migrationKey, 'true')
    return
  }

  const supabase = createClient()

  const { error } = await supabase.from('care_plan_tasks').upsert(rows, {
    onConflict: 'user_id,task_id',
  })

  if (error) {
    console.error(error)
    return
  }

  localStorage.setItem(migrationKey, 'true')
}

async function fetchCarePlanRows(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('care_plan_tasks')
    .select('task_id, label, checked, group_key, source_slug, source_title')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  return {
    rows: (data || []) as CarePlanTaskRow[],
    error,
  }
}

function mapCarePlanRows(rows: CarePlanTaskRow[]): CarePlanSnapshot {
  const taskState: StoredTaskState = {}
  const addedTasks: AddedCareTask[] = []

  for (const row of rows) {
    taskState[row.task_id] = row.checked

    if (row.group_key === 'added') {
      addedTasks.push({
        id: row.task_id,
        label: row.label,
        sourceSlug: row.source_slug || undefined,
        sourceTitle: row.source_title || undefined,
      })
    }
  }

  return {
    taskState,
    addedTasks,
  }
}