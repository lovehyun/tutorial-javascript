
import express from 'express';
import { projectController } from '../controllers/projectController.js';
import { authRequired } from '../middlewares/auth.js';

// This router handles /workspaces/:workspaceId/projects...
const router = express.Router({ mergeParams: true });

router.get('/', authRequired, projectController.list);
router.post('/', authRequired, projectController.create);
router.post('/seed', authRequired, projectController.seed);

export default router;
