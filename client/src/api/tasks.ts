import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task'
import { request } from './http'

export function getTasks(): Promise<Task[]> {
  return request<Task[]>('/api/tasks')
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return request<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  return request<Task>(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`/api/tasks/${id}`, { method: 'DELETE' })
}
