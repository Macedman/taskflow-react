import type { Task } from '../types/task'

// One place that knows how to talk to the API.
// fetch() does NOT throw on 404/500, so we check res.ok ourselves.
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })

  if (!res.ok) {
    // Our API sends { error: '...' }; fall back to the status code if not
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `Request failed with status ${res.status}`)
  }

  return res.json() as Promise<T>
}

export function getTasks(): Promise<Task[]> {
  return request<Task[]>('/api/tasks')
}
