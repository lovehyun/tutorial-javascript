
import { all, run, get } from '../database/db.js';
import { uid } from '../utils/helpers.js';

export const taskService = {
  async getColumn(db, columnId) {
    return get(db, 'SELECT id, project_id FROM columns WHERE id=?', [columnId]);
  },

  async getTask(db, taskId) {
    return get(db, 'SELECT id, project_id, column_id FROM tasks WHERE id=?', [taskId]);
  },

  async createTask(db, projectId, columnId, assigneeId, { title, description, startDate, endDate, priority }) {
    const last = await get(db, 'SELECT ord FROM tasks WHERE column_id=? ORDER BY ord DESC LIMIT 1', [columnId]);
    const ord = (last?.ord || 0) + 1000;
    const taskId = uid('t');

    await run(db, `
      INSERT INTO tasks(id, Project_id, column_id, title, description, assignee_id, start_date, end_date, priority, status, ord)
      VALUES (?,?,?,?,?,?,?,?,?,'active',?)
    `, [taskId, projectId, columnId, title, description || '', assigneeId, startDate, endDate, priority || 'medium', ord]);
    
    return taskId;
  },

  async updateTask(db, taskId, updates) {
    // Only update allowed fields
    const allowed = ['title', 'description', 'start_date', 'end_date', 'priority', 'assignee_id'];
    const fields = [];
    const vals = [];
    
    // mapping frontend camelCase to snake_case
    const map = {
        title: 'title',
        description: 'description',
        startDate: 'start_date',
        endDate: 'end_date',
        priority: 'priority',
        assigneeId: 'assignee_id'
    };

    for (const [key, val] of Object.entries(updates)) {
        if (map[key]) {
            fields.push(`${map[key]}=?`);
            vals.push(val);
        }
    }
    
    if (fields.length === 0) return;
    vals.push(taskId);
    await run(db, `UPDATE tasks SET ${fields.join(', ')} WHERE id=?`, vals);
  },

  async moveTask(db, taskId, { columnId, ord }) {
    await run(db, 'UPDATE tasks SET column_id=?, ord=? WHERE id=?', [columnId, ord, taskId]);
  },

  async deleteTask(db, taskId) {
    await run(db, 'DELETE FROM tasks WHERE id=?', [taskId]);
  }
};
