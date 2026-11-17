import type { Task, TaskStatus } from '../types/task'
import { Column } from './Column'

// The board's columns, in display order
const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
]

type BoardProps = {
  tasks: Task[]
}

export function Board({ tasks }: BoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((column) => (
        <Column
          key={column.status}
          title={column.title}
          // Derived state: filter the one tasks array instead of storing three
          tasks={tasks.filter((task) => task.status === column.status)}
        />
      ))}
    </div>
  )
}
