
import express from 'express';
import { projectController } from '../controllers/projectController.js';
import { authRequired } from '../middlewares/auth.js';

const router = express.Router();

// Note: some project routes are under /workspaces in REST (nested), but here we handle root paths
// Actually route structure is flexible. 
// Old: 
// POST /workspaces/:wid/projects
// GET /workspaces/:wid/projects
// DEL /projects/:pid
// GET /projects/:pid/board
// POST /workspaces/:wid/seed

// We will map them in index.js or handle nested router there.
// For now, let's export separated routers or handle logic here.

// Since the previous impl had /workspaces/:workspaceId/projects ..
// We can define a router for /workspaces and another for /projects
// Or use this file for /projects paths and another for /workspaces paths.

router.delete('/:projectId', authRequired, projectController.delete);
router.get('/:projectId/board', authRequired, projectController.getBoard);

export default router;
