
import { all, get } from '../database/db.js';

export const workspaceService = {
  async getWorkspaces(db, userId) {
    return all(db, `
      SELECT w.id, w.name, m.role
      FROM memberships m
      JOIN workspaces w ON m.workspace_id = w.id
      WHERE m.user_id = ?
    `, [userId]);
  },

  async isMember(db, workspaceId, userId) {
    return get(db, 'SELECT role FROM memberships WHERE workspace_id=? AND user_id=?', [workspaceId, userId]);
  }
};
