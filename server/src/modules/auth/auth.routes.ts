import { Router } from 'express'
import { requireAuth } from '../../middleware/requireAuth.js'
import { login, me, register } from './auth.controller.js'

const router = Router()

router.post('/register', register) // public
router.post('/login', login) // public
router.get('/me', requireAuth, me) // protected: middleware runs first

export default router
