import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errors'

type Mode = 'login' | 'register'

export function LoginPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  // Pre-filled with the demo account so anyone opening the app can try it
  const [email, setEmail] = useState('demo@taskflow.dev')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isLogin = mode === 'login'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await (isLogin ? login(email, password) : register(email, password))
      // On success AuthProvider switches to the board, so this page unmounts
    } catch (err) {
      setError(getErrorMessage(err))
      setIsSubmitting(false)
    }
  }

  function switchMode() {
    setMode(isLogin ? 'register' : 'login')
    setError(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">TaskFlow</h1>
          <p className="text-slate-600">{isLogin ? 'Log in to your board' : 'Create an account'}</p>
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="rounded-md border border-slate-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            minLength={isLogin ? undefined : 8}
            required
            className="rounded-md border border-slate-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
        </button>

        <button type="button" onClick={switchMode} className="text-sm text-blue-600 hover:underline">
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Log in'}
        </button>

        {isLogin && (
          <p className="text-center text-xs text-slate-500">
            Demo account: demo@taskflow.dev / password123
          </p>
        )}
      </form>
    </div>
  )
}
