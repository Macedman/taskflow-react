export type User = {
  id: string
  email: string
}

// What POST /api/auth/login and /register return
export type AuthResponse = {
  token: string
  user: User
}
