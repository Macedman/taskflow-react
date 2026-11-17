import { COLUMNS } from '../constants'
import type { Task, TaskStatus } from '../types/task'
import { Column } from './Column'

type BoardProps = {
  tasks: Task[]
  onMove: (id: string, status: TaskStatus) => void
  onDelete: (id: string) => void
}

export function Board({ tasks, onMove, onDelete }: BoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((column) => (
        <Column
          key={column.status}
          title={column.title}
          // Derived state: filter the one tasks array instead of storing three
          tasks={tasks.filter((task) => task.status === column.status)}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
