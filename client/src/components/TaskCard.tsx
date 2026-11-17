import type { Task } from '../types/task'

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <h3 className="font-medium text-slate-900">{task.title}</h3>
      {task.description && (
        <p className="mt-1 text-sm text-slate-600">{task.description}</p>
      )}
    </article>
  )
}
