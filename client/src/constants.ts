import type { TaskStatus } from './types/task'

// The board's columns, in display order.
// Used by Board (to render columns) and TaskCard (to know the previous/next column).
export const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
]
