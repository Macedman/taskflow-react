import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '../api/auth'
import { setUnauthorizedHandler, tokenStorage } from '../api/http'
import type { AuthResponse, User } from '../types/auth'
import { AuthContext } from './AuthContext'
import type { AuthContextValue, AuthStatus } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Lazy initial state: only read localStorage once, on the first render
  const [status, setStatus] = useState<AuthStatus>(() =>
    tokenStorage.get() ? 'checking' : 'anonymous',
  )

  // useCallback keeps the same function between renders, so effects that
  // depend on it don't re-run every render
  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    setStatus('anonymous')
  }, [])

  // Any request that comes back 401 (e.g. expired token) logs the user out
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  // On page load: if a token was saved, ask the server who it belongs to
  useEffect(() => {
    if (!tokenStorage.get()) return
    let ignore = false

    authApi
      .getMe()
      .then(({ user }) => {
        if (ignore) return
        setUser(user)
        setStatus('authenticated')
      })
      .catch(() => {
        if (!ignore) logout() // invalid or expired token
      })

    return () => {
      ignore = true
    }
  }, [logout])

  const handleAuthResponse = useCallback(({ token, user }: AuthResponse) => {
    tokenStorage.set(token)
    setUser(user)
    setStatus('authenticated')
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      handleAuthResponse(await authApi.login(email, password))
    },
    [handleAuthResponse],
  )

  const register = useCallback(
    async (email: string, password: string) => {
      handleAuthResponse(await authApi.register(email, password))
    },
    [handleAuthResponse],
  )

  // useMemo: a new object every render would re-render every component using useAuth()
  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  )

  // React 19: <AuthContext> works as the provider (no .Provider needed)
  return <AuthContext value={value}>{children}</AuthContext>
}
