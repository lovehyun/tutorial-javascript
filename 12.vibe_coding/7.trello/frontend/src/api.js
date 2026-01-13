const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api/v1';

export function setToken(token) {
  localStorage.setItem('taskflow_token', token || '');
}

export function getToken() {
  return localStorage.getItem('taskflow_token') || '';
}

async function request(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json.data;
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  sampleUser: () => request('/auth/sample', { method: 'POST' }),
  signup: (email, password, name) => request('/auth/signup', { method: 'POST', body: { email, password, name } }),
  me: () => request('/auth/me'),
  workspaces: () => request('/workspaces'),
  projects: (workspaceId) => request(`/workspaces/${workspaceId}/projects`),
  createProject: (workspaceId, payload) => request(`/workspaces/${workspaceId}/projects`, { method: 'POST', body: payload }),
  deleteProject: (projectId) => request(`/projects/${projectId}`, { method: 'DELETE' }),
  board: (projectId) => request(`/projects/${projectId}/board`),
  createTask: (columnId, payload) => request(`/columns/${columnId}/tasks`, { method: 'POST', body: payload }),
  moveTask: (taskId, payload) => request(`/tasks/${taskId}/move`, { method: 'PATCH', body: payload }),
  updateTask: (taskId, payload) => request(`/tasks/${taskId}`, { method: 'PATCH', body: payload }),
  deleteTask: (taskId) => request(`/tasks/${taskId}`, { method: 'DELETE' }),

  // Seeding
  seed: (workspaceId, type = 1) => request(`/workspaces/${workspaceId}/projects/seed`, { method: 'POST', body: { type } }),
};
