import { useAuth } from './context/AuthContext'
import { BoardPage } from './pages/BoardPage'
import { LoginPage } from './pages/LoginPage'

function App() {
  const { status, user, logout } = useAuth()

  // Saved token found: wait for the server to confirm it before showing anything
  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Loading…
      </div>
    )
  }

  if (status === 'anonymous' || !user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-slate-900">TaskFlow</h1>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span>{user.email}</span>
            <button
              onClick={logout}
              className="rounded-md px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-white"
            >
              Log out
            </button>
          </div>
        </header>

        {/* key: a different user gets a brand-new BoardPage, with no leftover state */}
        <BoardPage key={user.id} />
      </main>
    </div>
  )
}

export default App
