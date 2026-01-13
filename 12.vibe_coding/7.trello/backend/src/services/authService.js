
import bcrypt from 'bcryptjs';
import { get, run } from '../database/db.js';
import { uid } from '../utils/helpers.js';

export const authService = {
  async findUserByEmail(db, email) {
    return get(db, 'SELECT id, email, password_hash, name FROM users WHERE email = ?', [email]);
  },

  async findUserById(db, id) {
    return get(db, 'SELECT id, email, name, created_at FROM users WHERE id = ?', [id]);
  },

  async createUser(db, { email, password, name }) {
    const userId = uid('u');
    const hash = await bcrypt.hash(password, 10);
    await run(db, 'INSERT INTO users(id, email, password_hash, name) VALUES (?,?,?,?)', [userId, email, hash, name]);
    return userId;
  },

  async createInitialWorkspace(db, { userId, name }) {
    const wsId = uid('w');
    await run(db, 'INSERT INTO workspaces(id, name) VALUES (?,?)', [wsId, `${name}의 워크스페이스`]);
    await run(db, 'INSERT INTO memberships(id, workspace_id, user_id, role) VALUES (?,?,?,?)', [uid('m'), wsId, userId, 'owner']);
    
    // Create default project
    const projId = uid('p');
    await run(db, 'INSERT INTO projects(id, workspace_id, name, description, created_by) VALUES (?,?,?,?,?)',
      [projId, wsId, '첫 프로젝트', '자동 생성된 기본 프로젝트', userId]
    );

    // Default columns
    const columns = [
      { name: 'Todo', ord: 1 },
      { name: 'Doing', ord: 2 },
      { name: 'Done', ord: 3 },
    ];
    for (const c of columns) {
      await run(db, 'INSERT INTO columns(id, project_id, name, ord) VALUES (?,?,?,?)', [uid('c'), projId, c.name, c.ord]);
    }

    return { wsId, projId };
  },

  async createSampleUser(db) {
    const email = 'demo@sample.com';
    const password = 'password'; // Simple password for demo
    const name = 'Demo User';

    // Check if already exists to avoid error
    const existing = await this.findUserByEmail(db, email);
    if (existing) {
        return { email, password, name };
    }

    const userId = await this.createUser(db, { email, password, name });
    await this.createInitialWorkspace(db, { userId, name });
    return { email, password, name };
  },

  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
};
