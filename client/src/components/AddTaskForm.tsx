import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateTaskInput } from '../types/task'

type AddTaskFormProps = {
  // Resolves to true if the task was saved, so the form knows whether to clear
  onAdd: (input: CreateTaskInput) => Promise<boolean>
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  // Controlled inputs: React state is the single source of truth for each field
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const canSubmit = title.trim() !== '' && !isSaving

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // stop the browser's default full-page form submit
    if (!canSubmit) return

    const input: CreateTaskInput = { title: title.trim() }
    if (description.trim()) input.description = description.trim()

    setIsSaving(true)
    const saved = await onAdd(input)
    setIsSaving(false)

    // Only clear on success, so the user doesn't lose what they typed
    if (saved) {
      setTitle('')
      setDescription('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 md:flex-row"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        aria-label="Task title"
        className="flex-1 rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        aria-label="Description"
        className="flex-1 rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? 'Adding…' : 'Add task'}
      </button>
    </form>
  )
}
