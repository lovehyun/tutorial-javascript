
import express from 'express';
import { taskController } from '../controllers/taskController.js';
import { authRequired } from '../middlewares/auth.js';

const router = express.Router({ mergeParams: true });

router.post('/', authRequired, taskController.create);

export default router;
