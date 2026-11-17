// A user as stored on the server. passwordHash must NEVER be sent to a client.
export type User = {
  id: string
  email: string
  passwordHash: string
  createdAt: string
}

// What the API returns about a user
export type PublicUser = Omit<User, 'passwordHash'>

// Who is making the request, read from a verified JWT (attached as req.user)
export type AuthUser = Pick<User, 'id' | 'email'>
