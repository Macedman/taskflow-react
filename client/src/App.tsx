import { useEffect, useState } from 'react'
import { getTasks } from './api/tasks'
import { Board } from './components/Board'
import type { Task } from './types/task'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load tasks once, when the component first appears
  useEffect(() => {
    let ignore = false // set by the cleanup, so a stale request can't update state

    getTasks()
      .then((data) => {
        if (!ignore) setTasks(data)
      })
      .catch((err: unknown) => {
        if (!ignore) setError(err instanceof Error ? err.message : 'Something went wrong')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">TaskFlow</h1>

        {isLoading ? (
          <p className="text-slate-600">Loading tasks…</p>
        ) : error ? (
          <p className="rounded-md bg-red-100 p-3 text-red-700">Couldn't load tasks: {error}</p>
        ) : (
          <Board tasks={tasks} />
        )}
      </main>
    </div>
  )
}

export default App
