import { randomUUID } from 'node:crypto'
import type { Task, CreateTaskInput, UpdateTaskInput } from './tasks.types.js'

// In-memory "database". Resets every time the server restarts.
// Later this file is the only one that changes when you add a real database.
const tasks: Task[] = [
  {
    id: randomUUID(),
    title: 'Set up the Express server',
    status: 'done',
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    title: 'Build the task endpoints',
    description: 'GET, POST, PATCH, DELETE',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    title: 'Add JWT authentication',
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
]

export function getAll(): Task[] {
  return [...tasks]
}

export function getById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id)
}

export function create(input: CreateTaskInput): Task {
  const task: Task = {
    ...input,
    // Server-controlled fields come AFTER the spread, so the client can't override them
    id: randomUUID(),
    status: 'todo',
    createdAt: new Date().toISOString(),
  }
  tasks.push(task)
  return task
}

export function update(id: string, input: UpdateTaskInput): Task | undefined {
  const index = tasks.findIndex((task) => task.id === id)
  const existing = tasks[index] // tasks[-1] is undefined when not found
  if (!existing) return undefined

  const updated: Task = {
    ...existing,
    ...input,
    // Never let an update change these, even if the request body sneaks them in
    id: existing.id,
    createdAt: existing.createdAt,
  }
  tasks[index] = updated
  return updated
}

export function remove(id: string): boolean {
  const index = tasks.findIndex((task) => task.id === id)
  if (index === -1) return false

  tasks.splice(index, 1)
  return true
}
