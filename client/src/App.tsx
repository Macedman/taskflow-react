import { useEffect, useState } from 'react'
import { createTask, deleteTask, getTasks, updateTask } from './api/tasks'
import { AddTaskForm } from './components/AddTaskForm'
import { Board } from './components/Board'
import type { CreateTaskInput, Task, TaskStatus } from './types/task'

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong'
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Load tasks once, when the component first appears
  useEffect(() => {
    let ignore = false // set by the cleanup, so a stale request can't update state

    getTasks()
      .then((data) => {
        if (!ignore) setTasks(data)
      })
      .catch((err: unknown) => {
        if (!ignore) setLoadError(getErrorMessage(err))
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  // ADD: pessimistic. Wait for the server, because we need the id it generates.
  async function handleAdd(input: CreateTaskInput): Promise<boolean> {
    setActionError(null)
    try {
      const created = await createTask(input)
      setTasks((prev) => [...prev, created])
      return true
    } catch (err) {
      setActionError(`Couldn't add task: ${getErrorMessage(err)}`)
      return false
    }
  }

  // MOVE: optimistic. Update the UI first, then roll back if the server fails.
  async function handleMove(id: string, status: TaskStatus) {
    const original = tasks.find((task) => task.id === id)
    if (!original || original.status === status) return

    setActionError(null)
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)))

    try {
      const updated = await updateTask(id, { status })
      // Replace with the server's version, which is the source of truth
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)))
    } catch (err) {
      // Roll back to how the task was before the move
      setTasks((prev) => prev.map((task) => (task.id === id ? original : task)))
      setActionError(`Couldn't move task: ${getErrorMessage(err)}`)
    }
  }

  // DELETE: pessimistic. Only remove it from the screen once the server confirms.
  async function handleDelete(id: string) {
    setActionError(null)
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err) {
      setActionError(`Couldn't delete task: ${getErrorMessage(err)}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">TaskFlow</h1>

        {actionError && (
          <div
            role="alert"
            className="mb-4 flex items-center justify-between gap-4 rounded-md bg-red-100 p-3 text-red-700"
          >
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="font-medium hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="text-slate-600">Loading tasks…</p>
        ) : loadError ? (
          <p className="rounded-md bg-red-100 p-3 text-red-700">Couldn't load tasks: {loadError}</p>
        ) : (
          <>
            <AddTaskForm onAdd={handleAdd} />
            <Board tasks={tasks} onMove={handleMove} onDelete={handleDelete} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
