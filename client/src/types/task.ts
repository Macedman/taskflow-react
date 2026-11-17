// Mirrors server/src/modules/tasks/tasks.types.ts.
// Keep the two in sync (in a bigger project: a shared package).
export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: string
}
