import type { Request, Response } from 'express'
import { getAuthUser } from '../../middleware/requireAuth.js'
import * as tasksService from './tasks.service.js'
import type { CreateTaskInput, TaskStatus, UpdateTaskInput } from './tasks.types.js'

// Tells TypeScript that routes using this type have an :id in the URL
type IdParams = { id: string }

const VALID_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done']

// Type guards: runtime checks that also teach TypeScript the type
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && VALID_STATUSES.includes(value as TaskStatus)
}

// GET /api/tasks
export function getTasks(req: Request, res: Response) {
  const user = getAuthUser(req)
  res.json(tasksService.getAll(user.id))
}

// GET /api/tasks/:id
export function getTaskById(req: Request<IdParams>, res: Response) {
  const user = getAuthUser(req)
  const task = tasksService.getById(req.params.id, user.id)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.json(task)
}

// POST /api/tasks
export function createTask(req: Request, res: Response) {
  const { title, description } = req.body ?? {}

  if (!isNonEmptyString(title)) {
    res.status(400).json({ error: 'title is required' })
    return
  }
  if (description !== undefined && typeof description !== 'string') {
    res.status(400).json({ error: 'description must be a string' })
    return
  }

  // Build the input from known fields only, so extra fields in the body are ignored
  const input: CreateTaskInput = { title: title.trim() }
  if (description !== undefined) input.description = description

  const user = getAuthUser(req)
  const task = tasksService.create(user.id, input)
  res.status(201).json(task)
}

// PATCH /api/tasks/:id
export function updateTask(req: Request<IdParams>, res: Response) {
  const { title, description, status } = req.body ?? {}
  const input: UpdateTaskInput = {}

  if (title !== undefined) {
    if (!isNonEmptyString(title)) {
      res.status(400).json({ error: 'title must be a non-empty string' })
      return
    }
    input.title = title.trim()
  }
  if (description !== undefined) {
    if (typeof description !== 'string') {
      res.status(400).json({ error: 'description must be a string' })
      return
    }
    input.description = description
  }
  if (status !== undefined) {
    if (!isTaskStatus(status)) {
      res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` })
      return
    }
    input.status = status
  }

  if (Object.keys(input).length === 0) {
    res.status(400).json({ error: 'Nothing to update' })
    return
  }

  const user = getAuthUser(req)
  const task = tasksService.update(req.params.id, user.id, input)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.json(task)
}

// DELETE /api/tasks/:id
export function deleteTask(req: Request<IdParams>, res: Response) {
  const user = getAuthUser(req)
  const deleted = tasksService.remove(req.params.id, user.id)
  if (!deleted) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.status(204).end()
}
