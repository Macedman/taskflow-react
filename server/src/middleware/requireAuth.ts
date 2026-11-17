import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../modules/auth/auth.service.js'
import type { AuthUser } from '../modules/auth/auth.types.js'

// Runs before protected routes. Expects the header:  Authorization: Bearer <token>
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined
  const user = token ? verifyToken(token) : null

  if (!user) {
    // 401 = "we don't know who you are" (missing, invalid or expired token)
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  req.user = user // available to every handler after this one
  next() // pass control to the next middleware / route handler
}

// For handlers behind requireAuth: returns req.user, typed as definitely present.
// Throws (500) if someone forgets to put requireAuth on the route.
export function getAuthUser(req: Request): AuthUser {
  if (!req.user) {
    throw new Error('getAuthUser was called on a route without requireAuth')
  }
  return req.user
}
