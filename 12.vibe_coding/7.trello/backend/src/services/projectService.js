
import { all, run, get } from '../database/db.js';
import { uid } from '../utils/helpers.js';

export const projectService = {
  async getProjects(db, workspaceId) {
    return all(db, `
      SELECT id, name, description, created_at 
      FROM projects 
      WHERE workspace_id = ? 
      ORDER BY created_at DESC
    `, [workspaceId]);
  },

  async createProject(db, workspaceId, userId, { name, description }) {
    const projectId = uid('p');
    await run(db, 'INSERT INTO projects(id,workspace_id,name,description,created_by) VALUES (?,?,?,?,?)',
      [projectId, workspaceId, name, description, userId]
    );

    const cols = [
      { name: 'Todo', ord: 1 },
      { name: 'Doing', ord: 2 },
      { name: 'Done', ord: 3 },
    ];
    for (const c of cols) {
      await run(db, 'INSERT INTO columns(id,project_id,name,ord) VALUES (?,?,?,?)', [uid('c'), projectId, c.name, c.ord]);
    }
    return projectId;
  },

  async getProject(db, projectId) {
    return get(db, 'SELECT id, workspace_id, name FROM projects WHERE id=?', [projectId]);
  },

  async deleteProject(db, projectId) {
    // SQLite with FK constraint should handle cascade, or explicit delete
    // For now assuming existing logic
    await run(db, 'DELETE FROM projects WHERE id=?', [projectId]);
  },

  async getBoardData(db, projectId) {
     const columns = await all(db, 'SELECT id, name, ord FROM columns WHERE project_id=? ORDER BY ord ASC', [projectId]);
     const tasks = await all(db, `
       SELECT id, column_id as columnId, project_id as projectId, title, description, assignee_id as assigneeId,
              due_date as dueDate, start_date as startDate, end_date as endDate, priority, status, ord, created_at as createdAt
       FROM tasks
       WHERE project_id=?
       ORDER BY column_id, ord
     `, [projectId]);
     return { columns, tasks };
  }
};
