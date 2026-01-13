
import { projectService } from '../services/projectService.js';
import { workspaceService } from '../services/workspaceService.js';
import { generateSampleData } from '../database/seed_data.js';
import { ok, fail } from '../utils/helpers.js';
import { openDb } from '../database/db.js';

const dbPath = process.env.DB_PATH || './db/taskflow.sqlite';
const db = openDb(dbPath);

export const projectController = {
  async list(req, res) {
    const { workspaceId } = req.params;
    try {
        const mem = await workspaceService.isMember(db, workspaceId, req.user.id);
        if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');
        
        const rows = await projectService.getProjects(db, workspaceId);
        return ok(res, { items: rows });
    } catch (e) {
        return fail(res, 500, 'SERVER_ERROR', e.message);
    }
  },

  async create(req, res) {
    const { workspaceId } = req.params;
    const { name, description = '' } = req.body || {};
    if (!name) return fail(res, 400, 'VALIDATION_ERROR', 'name is required');

    try {
        const mem = await workspaceService.isMember(db, workspaceId, req.user.id);
        if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

        const projectId = await projectService.createProject(db, workspaceId, req.user.id, { name, description });
        return res.status(201).json({ ok: true, data: { id: projectId, workspaceId, name, description } });
    } catch (e) {
        return fail(res, 500, 'SERVER_ERROR', e.message);
    }
  },

  async seed(req, res) {
      const { workspaceId } = req.params;
      try {
        const mem = await workspaceService.isMember(db, workspaceId, req.user.id);
        if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access');

        const { type } = req.body;
        const { projectId } = await generateSampleData(db, req.user.id, workspaceId, type);
        return ok(res, { projectId });
      } catch (e) {
        return fail(res, 500, 'SERVER_ERROR', e.message);
      }
  },

  async delete(req, res) {
      const { projectId } = req.params;
      try {
          const proj = await projectService.getProject(db, projectId);
          if (!proj) return fail(res, 404, 'NOT_FOUND', 'Project not found');

          const mem = await workspaceService.isMember(db, proj.workspace_id, req.user.id);
          if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access to delete project');

          await projectService.deleteProject(db, projectId);
          return ok(res, { deleted: true });
      } catch (e) {
          return fail(res, 500, 'SERVER_ERROR', e.message);
      }
  },

  async getBoard(req, res) {
    const { projectId } = req.params;
    try {
        const proj = await projectService.getProject(db, projectId);
        if (!proj) return fail(res, 404, 'NOT_FOUND', 'Project not found');

        const mem = await workspaceService.isMember(db, proj.workspace_id, req.user.id);
        if (!mem) return fail(res, 403, 'FORBIDDEN', 'No access to project');

        const { columns, tasks } = await projectService.getBoardData(db, projectId);
        
        // group tasks by column
        const byCol = {};
        for (const c of columns) byCol[c.id] = [];
        for (const t of tasks) {
            if (!byCol[t.columnId]) byCol[t.columnId] = [];
            byCol[t.columnId].push(t);
        }

        const board = {
            id: projectId,
            projectName: proj.name,
            columns: columns.map(c => ({ id: c.id, name: c.name, ord: c.ord })),
            tasksByColumn: byCol
        };
        return ok(res, board);
    } catch (e) {
        console.error(e);
        return fail(res, 500, 'SERVER_ERROR', e.message);
    }
  }
};
