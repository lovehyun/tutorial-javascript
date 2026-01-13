
import express from 'express';
import { taskController } from '../controllers/taskController.js';
import { authRequired } from '../middlewares/auth.js';

const router = express.Router();

router.patch('/:taskId/move', authRequired, taskController.move);
router.patch('/:taskId', authRequired, taskController.update);
router.delete('/:taskId', authRequired, taskController.delete);

export default router;
