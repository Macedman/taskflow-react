import { Router } from 'express'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from './tasks.controller.js'

const router = Router()

// Paths are relative: this router is mounted at /api/tasks,
// so '/' means /api/tasks and '/:id' means /api/tasks/:id
router.get('/', getTasks)
router.get('/:id', getTaskById)
router.post('/', createTask)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router
