import { COLUMNS } from '../constants'
import type { Task, TaskStatus } from '../types/task'

type TaskCardProps = {
  task: Task
  onMove: (id: string, status: TaskStatus) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  // Find the columns to the left and right of this task's column
  const index = COLUMNS.findIndex((column) => column.status === task.status)
  const previous = COLUMNS[index - 1] // undefined if already in the first column
  const next = COLUMNS[index + 1] // undefined if already in the last column

  return (
    <article className="rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-900">{task.title}</h3>
        <button
          onClick={() => onDelete(task.id)}
          aria-label={`Delete "${task.title}"`}
          className="rounded px-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
        >
          ✕
        </button>
      </div>

      {task.description && (
        <p className="mt-1 text-sm text-slate-600">{task.description}</p>
      )}

      <div className="mt-3 flex justify-between">
        {previous ? (
          <button
            onClick={() => onMove(task.id, previous.status)}
            className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            ← {previous.title}
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button
            onClick={() => onMove(task.id, next.status)}
            className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            {next.title} →
          </button>
        )}
      </div>
    </article>
  )
}
