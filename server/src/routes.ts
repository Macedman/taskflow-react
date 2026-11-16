import { Router } from 'express';
import taskRouter from './modules/tasks/tasks.routes.js';

const router = Router();
router.use('/tasks', taskRouter);

router.get('/', (req, res) => {
  res.send({ status: 'ok' } );
});


export default router;