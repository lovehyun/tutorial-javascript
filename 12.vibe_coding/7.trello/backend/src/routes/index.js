
import express from 'express';
import authRoutes from './authRoutes.js';
import workspaceRoutes from './workspaceRoutes.js';
import workspaceProjectRoutes from './workspaceProjectRoutes.js';
import projectRoutes from './projectRoutes.js';
import taskRoutes from './taskRoutes.js';
import columnTaskRoutes from './columnTaskRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
// Nested routes: /workspaces/:workspaceId/projects...
router.use('/workspaces/:workspaceId/projects', workspaceProjectRoutes);

router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

// Nested: /columns/:columnId/tasks
router.use('/columns/:columnId/tasks', columnTaskRoutes);

export default router;
