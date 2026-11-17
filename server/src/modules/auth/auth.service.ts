import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../../config.js'
import type { AuthUser, PublicUser, User } from './auth.types.js'

// Cost factor: bcrypt runs 2^10 rounds. Higher = slower to brute-force (and to log in).
const SALT_ROUNDS = 10

// A demo account so the app has something to log into after every restart
export const DEMO_USER_ID = 'demo-user'

// In-memory "database", like tasks. Resets on restart.
const users: User[] = [
  {
    id: DEMO_USER_ID,
    email: 'demo@taskflow.dev',
    passwordHash: bcrypt.hashSync('password123', SALT_ROUNDS),
    createdAt: new Date().toISOString(),
  },
]

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Explicitly pick safe fields (an allowlist), so a new secret field added to User later
// can't leak by accident
function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, createdAt: user.createdAt }
}

// Returns null if the email is already taken
export async function register(email: string, password: string): Promise<PublicUser | null> {
  const normalized = normalizeEmail(email)
  if (users.some((user) => user.email === normalized)) return null

  // Never store the password itself, only a salted hash of it
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user: User = {
    id: randomUUID(),
    email: normalized,
    passwordHash,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  return toPublicUser(user)
}

// Returns null for a wrong email OR a wrong password; the caller can't tell which
export async function login(email: string, password: string): Promise<PublicUser | null> {
  const user = users.find((u) => u.email === normalizeEmail(email))
  if (!user) return null

  // Hashes the attempt with the salt stored inside passwordHash and compares
  const passwordMatches = await bcrypt.compare(password, user.passwordHash)
  return passwordMatches ? toPublicUser(user) : null
}

export function createToken(user: AuthUser): string {
  return jwt.sign(
    { email: user.email }, // payload: readable by anyone, so never put secrets here
    config.jwtSecret, // signature key: proves the server created this token
    { subject: user.id, expiresIn: config.jwtExpiresIn }, // sets the "sub" and "exp" claims
  )
}

// Returns the user inside a valid token, or null if it's forged, tampered with or expired
export function verifyToken(token: string): AuthUser | null {
  try {
    // Pin the algorithm so an attacker can't pick a weaker one in the token header
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] })
    if (typeof payload === 'string' || !payload.sub || typeof payload.email !== 'string') {
      return null
    }
    return { id: payload.sub, email: payload.email }
  } catch {
    return null
  }
}
