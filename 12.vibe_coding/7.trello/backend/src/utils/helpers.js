
import { v4 as uuidv4 } from 'uuid';

export function uid(prefix = '') {
  const id = uuidv4();
  return prefix ? `${prefix}_${id}` : id;
}

export function ok(res, data) {
  return res.json({ ok: true, data });
}

export function fail(res, status, code, message) {
  return res.status(status).json({ ok: false, error: { code, message } });
}
