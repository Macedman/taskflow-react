import { Router } from 'express'
import { requireAuth } from './middleware/requireAuth.js'
import authRouter from './modules/auth/auth.routes.js'
import taskRouter from './modules/tasks/tasks.routes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/auth', authRouter)

// Every /api/tasks route requires a valid token
router.use('/tasks', requireAuth, taskRouter)

export default router
