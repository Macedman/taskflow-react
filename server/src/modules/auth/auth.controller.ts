import type { Request, Response } from 'express'
import { getAuthUser } from '../../middleware/requireAuth.js'
import * as authService from './auth.service.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

// POST /api/auth/register
export async function register(req: Request, res: Response) {
  const { email, password } = req.body ?? {}

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    res.status(400).json({ error: 'A valid email is required' })
    return
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` })
    return
  }

  const user = await authService.register(email, password)
  if (!user) {
    // 409 Conflict: the request is valid, but clashes with existing data
    res.status(409).json({ error: 'An account with this email already exists' })
    return
  }

  // Log the new user straight in by returning a token too
  res.status(201).json({ token: authService.createToken(user), user })
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {}

  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const user = await authService.login(email, password)
  if (!user) {
    // Same message for "no such email" and "wrong password", so attackers
    // can't use this endpoint to find out which emails have accounts
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }

  res.json({ token: authService.createToken(user), user })
}

// GET /api/auth/me  (protected) — "who am I?", used by the client to check a saved token
export function me(req: Request, res: Response) {
  res.json({ user: getAuthUser(req) })
}
