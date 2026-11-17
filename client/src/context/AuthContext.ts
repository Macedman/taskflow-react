import { createContext, useContext } from 'react'
import type { User } from '../types/auth'

// checking      = we have a saved token and are asking the server if it's still valid
// authenticated = logged in
// anonymous     = logged out
export type AuthStatus = 'checking' | 'authenticated' | 'anonymous'

export type AuthContextValue = {
  user: User | null
  status: AuthStatus
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

// null by default, so useAuth can detect a missing <AuthProvider>
export const AuthContext = createContext<AuthContextValue | null>(null)

// Components call useAuth() instead of useContext(AuthContext) directly
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return value
}
