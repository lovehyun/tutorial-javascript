
import { workspaceService } from '../services/workspaceService.js';
import { ok, fail } from '../utils/helpers.js';
import { openDb } from '../database/db.js';

const dbPath = process.env.DB_PATH || './db/taskflow.sqlite';
const db = openDb(dbPath);

export const workspaceController = {
  async list(req, res) {
    try {
      const items = await workspaceService.getWorkspaces(db, req.user.id);
      return ok(res, { items });
    } catch (e) {
      return fail(res, 500, 'SERVER_ERROR', e.message);
    }
  }
};
