// The kanban columns. A union of string literals: only these 3 values are allowed.
export type TaskStatus = 'todo' | 'in_progress' | 'done'

// The full shape of a task as stored and returned by the API
export type Task = {
  id: string
  userId: string // the owner; each user only sees their own tasks
  title: string
  description?: string
  status: TaskStatus
  createdAt: string
}

// What the client sends to create a task.
// The server sets id, userId, createdAt and status itself, so the client can't.
export type CreateTaskInput = Omit<Task, 'id' | 'userId' | 'createdAt' | 'status'>

// What the client sends to update a task.
// Every field is optional (PATCH = partial update), and id/userId/createdAt can't be changed.
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>
