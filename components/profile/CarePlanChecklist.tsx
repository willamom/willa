'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

import type { ProfileTask } from '@/types/profile'
import {
  buildCustomCareTaskId,
  CARE_PLAN_UPDATED_EVENT,
  getCarePlanForCurrentUser,
  removeAddedCareTaskForCurrentUser,
  saveAddedCareTaskForCurrentUser,
  setCarePlanTaskCheckedForCurrentUser,
  slugifyCareTask,
  type AddedCareTask,
  type CarePlanProfileTaskInput,
} from '@/lib/carePlanStorage'

type CarePlanChecklistProps = {
  beforeBabyTasks: ProfileTask[]
  afterBabyTasks: ProfileTask[]
}

type CarePlanTask = {
  id: string
  label: string
  checked: boolean
  sourceSlug?: string
  sourceTitle?: string
}

type TaskGroupKey = 'before' | 'after' | 'added'

export default function CarePlanChecklist({
  beforeBabyTasks,
  afterBabyTasks,
}: CarePlanChecklistProps) {
  const [customTaskInput, setCustomTaskInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [removingTaskId, setRemovingTaskId] = useState('')

  const profileTaskInputs = useMemo<CarePlanProfileTaskInput[]>(() => {
    return [
      ...buildProfileTasks(beforeBabyTasks, 'before').map((task) => ({
        id: task.id,
        label: task.label,
        checked: task.checked,
        groupKey: 'before' as const,
      })),
      ...buildProfileTasks(afterBabyTasks, 'after').map((task) => ({
        id: task.id,
        label: task.label,
        checked: task.checked,
        groupKey: 'after' as const,
      })),
    ]
  }, [afterBabyTasks, beforeBabyTasks])

  const [beforeTasks, setBeforeTasks] = useState<CarePlanTask[]>(() =>
    buildProfileTasks(beforeBabyTasks, 'before')
  )

  const [afterTasks, setAfterTasks] = useState<CarePlanTask[]>(() =>
    buildProfileTasks(afterBabyTasks, 'after')
  )

  const [addedTasks, setAddedTasks] = useState<CarePlanTask[]>([])

  useEffect(() => {
    let isMounted = true

    async function loadCarePlan() {
      const snapshot = await getCarePlanForCurrentUser(profileTaskInputs)

      if (!isMounted) return

      setBeforeTasks(
        applyStoredState(
          buildProfileTasks(beforeBabyTasks, 'before'),
          snapshot.taskState
        )
      )

      setAfterTasks(
        applyStoredState(
          buildProfileTasks(afterBabyTasks, 'after'),
          snapshot.taskState
        )
      )

      setAddedTasks(buildAddedTasks(snapshot.taskState, snapshot.addedTasks))
      setIsLoading(false)
    }

    loadCarePlan()

    window.addEventListener(CARE_PLAN_UPDATED_EVENT, loadCarePlan)
    window.addEventListener('storage', loadCarePlan)

    return () => {
      isMounted = false
      window.removeEventListener(CARE_PLAN_UPDATED_EVENT, loadCarePlan)
      window.removeEventListener('storage', loadCarePlan)
    }
  }, [afterBabyTasks, beforeBabyTasks, profileTaskInputs])

  const progress = useMemo(() => {
    const allTasks = [...beforeTasks, ...afterTasks, ...addedTasks]
    const completed = allTasks.filter((task) => task.checked).length
    const total = allTasks.length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      completed,
      total,
      percent,
    }
  }, [addedTasks, afterTasks, beforeTasks])

  function toggleTask(group: TaskGroupKey, taskId: string) {
    const task =
      group === 'before'
        ? beforeTasks.find((item) => item.id === taskId)
        : group === 'after'
          ? afterTasks.find((item) => item.id === taskId)
          : addedTasks.find((item) => item.id === taskId)

    if (!task) return

    const nextChecked = !task.checked

    const updater = (tasks: CarePlanTask[]) =>
      tasks.map((item) =>
        item.id === taskId ? { ...item, checked: nextChecked } : item
      )

    if (group === 'before') {
      setBeforeTasks(updater)
    }

    if (group === 'after') {
      setAfterTasks(updater)
    }

    if (group === 'added') {
      setAddedTasks(updater)
    }

    void setCarePlanTaskCheckedForCurrentUser(
      {
        id: task.id,
        label: task.label,
        checked: nextChecked,
        groupKey: group,
        sourceSlug: task.sourceSlug,
        sourceTitle: task.sourceTitle,
      },
      nextChecked
    )
  }

  async function handleAddCustomTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const label = customTaskInput.trim()

    if (!label) return

    setIsAddingTask(true)

    const nextAddedTasks = await saveAddedCareTaskForCurrentUser({
      id: buildCustomCareTaskId(label),
      label,
    })

    const snapshot = await getCarePlanForCurrentUser(profileTaskInputs)

    setAddedTasks(buildAddedTasks(snapshot.taskState, nextAddedTasks))
    setCustomTaskInput('')
    setIsAddingTask(false)
  }

  async function handleRemoveAddedTask(taskId: string) {
    setRemovingTaskId(taskId)

    const nextAddedTasks = await removeAddedCareTaskForCurrentUser(taskId)
    const snapshot = await getCarePlanForCurrentUser(profileTaskInputs)

    setAddedTasks(buildAddedTasks(snapshot.taskState, nextAddedTasks))
    setRemovingTaskId('')
  }

  return (
    <section
      id="care-plan"
      className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(61,50,38,0.07)]"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#39472c]">
            Care plan
          </p>

          <h2 className="mt-4 font-serif text-3xl">
            Things you may want to prepare
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574d]">
            Use this as a soft checklist for pregnancy, birth prep, and the
            first stretch after baby arrives.
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#f5ded5] px-3 py-1 text-xs font-semibold text-[#a45f51]">
          {isLoading
            ? 'Loading...'
            : `${progress.completed}/${progress.total} done`}
        </span>
      </div>

      <div className="mt-6 rounded-3xl bg-[#f8f3eb] p-5">
        <div className="flex items-center justify-between text-xs font-semibold text-[#655d52]">
          <span>Progress</span>
          <span>{progress.percent}%</span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#eee6da]">
          <div
            className="h-full rounded-full bg-[#4f5d3d] transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-[#655d52]">
          Nothing here has to be perfect. Willa is just helping you catch the
          things your tired future self will thank you for.
        </p>
      </div>

      <form onSubmit={handleAddCustomTask} className="mt-6">
        <p className="mb-3 text-sm font-semibold text-[#211f1b]">
          Add your own task
        </p>

        <div className="overflow-hidden rounded-2xl border border-[#e2d7c8] bg-[#fbf7ef]">
          <div className="flex flex-col sm:flex-row">
            <input
              value={customTaskInput}
              onChange={(event) => setCustomTaskInput(event.target.value)}
              placeholder="e.g. Ask my sister about school pickup"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#211f1b] outline-none placeholder:text-[#8a8277]"
            />

            <button
              type="submit"
              disabled={isAddingTask || !customTaskInput.trim()}
              className="bg-[#4f5d3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#414d31] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[130px]"
            >
              {isAddingTask ? 'Adding...' : 'Add task'}
            </button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <div className="mt-7 grid items-stretch gap-5 sm:grid-cols-2">
            <TaskGroup
              title="Before baby"
              group="before"
              tasks={beforeTasks}
              onToggle={toggleTask}
            />

            <TaskGroup
              title="After baby"
              group="after"
              tasks={afterTasks}
              onToggle={toggleTask}
            />
          </div>

          <div className="mt-7 border-t border-[#eee6da] pt-6">
            <TaskGroup
              title="Added to my care plan"
              group="added"
              tasks={addedTasks}
              onToggle={toggleTask}
              onRemove={handleRemoveAddedTask}
              removingTaskId={removingTaskId}
              emptyText="Add anything personal here: childcare, meals, rides, recovery supplies, or support you want to ask for."
            />
          </div>
        </>
      )}
    </section>
  )
}

function TaskGroup({
  title,
  group,
  tasks,
  onToggle,
  onRemove,
  removingTaskId = '',
  emptyText = 'No tasks here yet.',
}: {
  title: string
  group: TaskGroupKey
  tasks: CarePlanTask[]
  onToggle: (group: TaskGroupKey, taskId: string) => void
  onRemove?: (taskId: string) => void
  removingTaskId?: string
  emptyText?: string
}) {
  return (
    <div className="flex h-full flex-col rounded-3xl bg-[#f8f3eb] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#211f1b]">{title}</p>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#655d52]">
          {tasks.length}
        </span>
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              group={group}
              onToggle={onToggle}
              onRemove={onRemove}
              isRemoving={removingTaskId === task.id}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e5dccf] bg-white/60 p-4">
          <p className="text-sm leading-6 text-[#5f574d]">{emptyText}</p>
        </div>
      )}
    </div>
  )
}

function TaskRow({
  task,
  group,
  onToggle,
  onRemove,
  isRemoving,
}: {
  task: CarePlanTask
  group: TaskGroupKey
  onToggle: (group: TaskGroupKey, taskId: string) => void
  onRemove?: (taskId: string) => void
  isRemoving: boolean
}) {
  return (
    <div className="rounded-2xl bg-white/70 p-4">
      <button
        type="button"
        onClick={() => onToggle(group, task.id)}
        className="flex w-full items-start gap-3 text-left text-sm transition hover:text-[#211f1b]"
      >
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
            task.checked
              ? 'border-[#4f5d3d] bg-[#4f5d3d] text-white'
              : 'border-[#c8bdae] bg-white text-transparent'
          }`}
          aria-hidden="true"
        >
          ✓
        </span>

        <span>
          <span
            className={
              task.checked
                ? 'block leading-6 text-[#3f3b35]'
                : 'block leading-6 text-[#655d52]'
            }
          >
            {task.label}
          </span>

          {task.sourceTitle ? (
            <span className="mt-1 block text-xs leading-5 text-[#8a8277]">
              From: {task.sourceTitle}
            </span>
          ) : null}
        </span>
      </button>

      {group === 'added' && onRemove ? (
        <button
          type="button"
          onClick={() => onRemove(task.id)}
          disabled={isRemoving}
          className="ml-8 mt-3 rounded-full bg-[#f8f3eb] px-3 py-1.5 text-xs font-semibold text-[#a45f51] transition hover:bg-[#f5ded5] hover:text-[#211f1b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRemoving ? 'Removing...' : 'Remove'}
        </button>
      ) : null}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="mt-7 grid gap-5 sm:grid-cols-2">
      {[1, 2].map((item) => (
        <div key={item} className="rounded-3xl bg-[#f8f3eb] p-5">
          <div className="h-5 w-28 rounded-full bg-white" />

          <div className="mt-5 space-y-3">
            {[1, 2, 3].map((row) => (
              <div key={row} className="rounded-2xl bg-white/70 p-4">
                <div className="h-4 w-full rounded-full bg-[#eadfd4]" />
                <div className="mt-2 h-3 w-3/4 rounded-full bg-[#eadfd4]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function buildProfileTasks(
  tasks: ProfileTask[],
  group: Exclude<TaskGroupKey, 'added'>
): CarePlanTask[] {
  return tasks.map((task) => ({
    id: `${group}-${slugifyCareTask(task.label)}`,
    label: task.label,
    checked: Boolean(task.checked),
  }))
}

function buildAddedTasks(
  stored: Record<string, boolean>,
  tasks: AddedCareTask[]
): CarePlanTask[] {
  return tasks.map((task) => ({
    id: task.id,
    label: task.label,
    sourceSlug: task.sourceSlug,
    sourceTitle: task.sourceTitle,
    checked: stored[task.id] ?? false,
  }))
}

function applyStoredState(
  tasks: CarePlanTask[],
  stored: Record<string, boolean>
) {
  return tasks.map((task) => ({
    ...task,
    checked: stored[task.id] ?? task.checked,
  }))
}