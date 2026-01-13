
import express from 'express';
import { workspaceController } from '../controllers/workspaceController.js';
import { authRequired } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authRequired, workspaceController.list);

export default router;
