
import { authService } from '../services/authService.js';
import { signToken } from '../middlewares/auth.js';
import { ok, fail } from '../utils/helpers.js';
import { openDb } from '../database/db.js';

const dbPath = process.env.DB_PATH || './db/taskflow.sqlite';
const db = openDb(dbPath);

export const authController = {
  async signup(req, res) {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) return fail(res, 400, 'VALIDATION_ERROR', 'email, password, name are required');

    try {
        const exists = await authService.findUserByEmail(db, email);
        if (exists) return fail(res, 409, 'CONFLICT', 'Email already exists');

        const userId = await authService.createUser(db, { email, password, name });
        const { wsId, projId } = await authService.createInitialWorkspace(db, { userId, name });

        return res.status(201).json({ ok: true, data: { userId, workspaceId: wsId, projectId: projId } });
    } catch (e) {
        console.error(e);
        return fail(res, 500, 'SERVER_ERROR', e.message);
    }
  },

  async login(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) return fail(res, 400, 'VALIDATION_ERROR', 'email and password are required');

    try {
        const user = await authService.findUserByEmail(db, email);
        if (!user) return fail(res, 401, 'UNAUTHORIZED', 'Invalid email or password');

        const match = await authService.comparePassword(password, user.password_hash);
        if (!match) return fail(res, 401, 'UNAUTHORIZED', 'Invalid email or password');

        const accessToken = signToken({ id: user.id, email: user.email, name: user.name });
        return ok(res, { accessToken, user: { id: user.id, email: user.email, name: user.name } });
    } catch (e) {
        return fail(res, 500, 'SERVER_ERROR', e.message);
    }
  },

  async sample(req, res) {
    try {
        const creds = await authService.createSampleUser(db);
        return ok(res, creds);
    } catch (e) {
        return fail(res, 500, 'SERVER_ERROR', e.message);
    }
  },

  async me(req, res) {
    try {
        const u = await authService.findUserById(db, req.user.id);
        if (!u) return fail(res, 404, 'NOT_FOUND', 'User not found');
        return ok(res, u);
    } catch (e) {
        return fail(res, 500, 'SERVER_ERROR', e.message);
    }
  }
};
