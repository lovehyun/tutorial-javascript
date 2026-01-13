
import { taskService } from '../services/taskService.js';
import { projectService } from '../services/projectService.js';
import { workspaceService } from '../services/workspaceService.js';
import { ok, fail } from '../utils/helpers.js';
import { openDb } from '../database/db.js';

const dbPath = process.env.DB_PATH || './db/taskflow.sqlite';
const db = openDb(dbPath);

export const taskController = {
  async create(req, res) {
    const { columnId } = req.params;
    const { title, description, startDate, endDate, priority, assigneeId } = req.body || {};
    if (!title) return fail(res, 400, 'VALIDATION_ERROR', 'title is required');

    try {
        const col = await taskService.getColumn(db, columnId);
        if (!col) return fail(res, 404, 'NOT_FOUND', 'Column not found');

        const proj = await projectService.getProject(db, col.project_id);
        const mem = await workspaceService.isMember(db, proj.workspace_id, req.user.id);
        if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

        const taskId = await taskService.createTask(db, col.project_id, columnId, assigneeId || req.user.id, {
            title, description, startDate, endDate, priority
        });
        return res.status(201).json({ ok: true, data: { id: taskId, title } });
    } catch (e) {
        return fail(res, 500, 'SERVER_ERROR', e.message);
    }
  },

  async update(req, res) {
      const { taskId } = req.params;
      const updates = req.body || {};
      try {
          const task = await taskService.getTask(db, taskId);
          if (!task) return fail(res, 404, 'NOT_FOUND', 'Task not found');

          const proj = await projectService.getProject(db, task.project_id);
          const mem = await workspaceService.isMember(db, proj.workspace_id, req.user.id);
          if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

          await taskService.updateTask(db, taskId, updates);
          return ok(res, { updated: true });
      } catch (e) {
          return fail(res, 500, 'SERVER_ERROR', e.message);
      }
  },

  async move(req, res) {
      const { taskId } = req.params;
      const { columnId, ord } = req.body || {};
      if (!columnId || ord === undefined) return fail(res, 400, 'VALIDATION_ERROR', 'columnId/ord required');

      try {
          const task = await taskService.getTask(db, taskId);
          if (!task) return fail(res, 404, 'NOT_FOUND', 'Task not found');
          
          // Verify source project
          const proj = await projectService.getProject(db, task.project_id);
          const mem = await workspaceService.isMember(db, proj.workspace_id, req.user.id);
          if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

          // Verify target column (must be in same project?? Usually yes, but technically could be different if DND across boards? 
          // For now assume same project or standard auth checks target column existence)
          // Simple check: user has access to project.
          
          await taskService.moveTask(db, taskId, { columnId, ord });
          return ok(res, { moved: true });
      } catch (e) {
          return fail(res, 500, 'SERVER_ERROR', e.message);
      }
  },

  async delete(req, res) {
      const { taskId } = req.params;
      try {
          const task = await taskService.getTask(db, taskId);
          if (!task) return fail(res, 404, 'NOT_FOUND', 'Task not found');
          
          const proj = await projectService.getProject(db, task.project_id);
          const mem = await workspaceService.isMember(db, proj.workspace_id, req.user.id);
          if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

          await taskService.deleteTask(db, taskId);
          return ok(res, { deleted: true });
      } catch (e) {
          return fail(res, 500, 'SERVER_ERROR', e.message);
      }
  }
};
