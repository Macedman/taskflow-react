import { randomUUID } from 'node:crypto'
import { DEMO_USER_ID } from '../auth/auth.service.js'
import type { Task, CreateTaskInput, UpdateTaskInput } from './tasks.types.js'

// In-memory "database". Resets every time the server restarts.
// Later this file is the only one that changes when you add a real database.
const tasks: Task[] = [
  {
    id: randomUUID(),
    userId: DEMO_USER_ID,
    title: 'Set up the Express server',
    status: 'done',
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    userId: DEMO_USER_ID,
    title: 'Build the task endpoints',
    description: 'GET, POST, PATCH, DELETE',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    userId: DEMO_USER_ID,
    title: 'Add JWT authentication',
    status: 'todo',
    createdAt: new Date().toISOString(),
  },
]

// Every lookup matches BOTH the task id and the owner, so one user can never
// read or change another user's task (it just looks "not found" to them)
function isOwnedTask(task: Task, id: string, userId: string): boolean {
  return task.id === id && task.userId === userId
}

export function getAll(userId: string): Task[] {
  return tasks.filter((task) => task.userId === userId)
}

export function getById(id: string, userId: string): Task | undefined {
  return tasks.find((task) => isOwnedTask(task, id, userId))
}

export function create(userId: string, input: CreateTaskInput): Task {
  const task: Task = {
    ...input,
    // Server-controlled fields come AFTER the spread, so the client can't override them
    id: randomUUID(),
    userId,
    status: 'todo',
    createdAt: new Date().toISOString(),
  }
  tasks.push(task)
  return task
}

export function update(id: string, userId: string, input: UpdateTaskInput): Task | undefined {
  const index = tasks.findIndex((task) => isOwnedTask(task, id, userId))
  const existing = tasks[index] // tasks[-1] is undefined when not found
  if (!existing) return undefined

  const updated: Task = {
    ...existing,
    ...input,
    // Never let an update change these, even if the request body sneaks them in
    id: existing.id,
    userId: existing.userId,
    createdAt: existing.createdAt,
  }
  tasks[index] = updated
  return updated
}

export function remove(id: string, userId: string): boolean {
  const index = tasks.findIndex((task) => isOwnedTask(task, id, userId))
  if (index === -1) return false

  tasks.splice(index, 1)
  return true
}
