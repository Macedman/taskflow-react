import type { AuthUser } from '../modules/auth/auth.types.js'

// Declaration merging: add a `user` property to Express's own Request type,
// so `req.user` is typed everywhere without casting
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}
