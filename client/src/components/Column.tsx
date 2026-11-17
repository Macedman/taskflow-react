import type { Task } from '../types/task'
import { TaskCard } from './TaskCard'

type ColumnProps = {
  title: string
  tasks: Task[]
}

export function Column({ title, tasks }: ColumnProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg bg-slate-200/60 p-4">
      <header className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-700">{title}</h2>
        <span className="rounded-full bg-slate-300 px-2 text-sm text-slate-700">
          {tasks.length}
        </span>
      </header>

      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No tasks</p>
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </section>
  )
}
