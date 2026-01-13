import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api.js';
import { useModal } from '../components/Modal';

export function DashboardPage() {
  const navigate = useNavigate();
  const { confirm } = useModal();
  
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedWs, setSelectedWs] = useState('');
  
  const [newProjectName, setNewProjectName] = useState('');
  const [msg, setMsg] = useState('');
  const [ready, setReady] = useState(false);

  async function bootstrap() {
    setMsg('');
    try {
      const me = await api.me();
      setUser(me);

      const ws = await api.workspaces();
      setWorkspaces(ws.items);
      const firstWs = ws.items[0]?.id || '';
      setSelectedWs(firstWs);

      if (firstWs) {
        const ps = await api.projects(firstWs);
        setProjects(ps.items);
      }
    } catch (e) {
      setMsg(e.message);
      // If API fails with 401, Protected route handles redirect, 
      // but we can also force logout here
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (!selectedWs) return;
    api.projects(selectedWs)
      .then((d) => setProjects(d.items))
      .catch(() => setProjects([]));
  }, [selectedWs]);

  async function createProject() {
    const name = newProjectName.trim();
    if (!name) return;
    
    try {
      await api.createProject(selectedWs, { name, description: '' });
      setNewProjectName('');
      const ps = await api.projects(selectedWs);
      setProjects(ps.items);
    } catch (e) {
      setMsg(e.message);
    }
  }



  if (!ready) {
      return <div className="h-screen flex items-center justify-center text-gray-400">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">TaskFlow</h2>
          <div className="text-gray-500 mt-1">Hello, <span className="font-bold text-pastel-blue-500">{user?.name}</span></div>
        </div>
      </div>

      {msg && <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl">{msg}</div>}

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Workspace</h3>
          <div className="relative">
            <select 
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-pastel-blue-200 text-gray-700 font-medium cursor-pointer" 
                value={selectedWs} 
                onChange={(e) => setSelectedWs(e.target.value)}
            >
              {workspaces.map(w => <option key={w.id} value={w.id}>{w.name} ({w.role})</option>)}
            </select>
            <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">▼</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Projects</h3>
          <div className="flex gap-3 mb-6">
            <input 
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-pastel-blue-200 transition-all" 
                placeholder="New project name" 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)} 
            />
            <button className="px-6 py-3 bg-pastel-blue-500 text-white font-bold rounded-xl shadow-md hover:bg-blue-600 hover:shadow-lg transition-all" onClick={createProject}>Add</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div 
                className="group bg-gray-50 p-5 rounded-xl border border-transparent hover:border-pastel-blue-200 hover:bg-white hover:shadow-md transition-all cursor-pointer" 
                key={p.id} 
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-700 group-hover:text-pastel-blue-500 transition-colors">{p.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{p.description || 'No description'}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                      <span className="text-gray-300 group-hover:text-pastel-blue-500 text-xl font-bold">→</span>
                      <button 
                          className="opacity-0 group-hover:opacity-100 text-xs text-red-300 hover:text-red-500 font-medium transition-all p-1"
                          onClick={async (e) => {
                              e.stopPropagation();
                              const ok = await confirm('Delete Project', `Are you sure you want to delete "${p.name}"? This action cannot be undone.`);
                              if (!ok) return;
                              
                              try {
                                  await api.deleteProject(p.id);
                                  // Refresh
                                  const ps = await api.projects(selectedWs);
                                  setProjects(ps.items);
                              } catch (e) {
                                  setMsg(e.message);
                              }
                          }}
                      >
                          Delete
                      </button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
                <div className="col-span-2 py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="text-gray-400 mb-4">No projects yet.</div>
                </div>
            )}
            
            <div className="col-span-1 sm:col-span-2 mt-4 flex justify-center gap-4">
                 <button 
                    className="text-sm text-gray-400 hover:text-pastel-blue-500 font-medium underline transition-all flex items-center gap-1"
                    onClick={async () => {
                        if (!selectedWs) return;
                        const ok = await confirm('Sample Data #1', 'Add "Sample Project #1" (English, 3 columns)?');
                        if (!ok) return;

                        try {
                            await api.seed(selectedWs, 1);
                            const ps = await api.projects(selectedWs);
                            setProjects(ps.items);
                        } catch (e) {
                            setMsg(e.message);
                        }
                    }}
                >
                    🌱 Add Sample Project #1 (English)
                </button>

                 <button 
                    className="text-sm text-gray-400 hover:text-pastel-purple-500 font-medium underline transition-all flex items-center gap-1"
                    onClick={async () => {
                        if (!selectedWs) return;
                        const ok = await confirm('Sample Data #2', 'Add "Sample Project #2" (Korean, 4 columns)?');
                        if (!ok) return;

                        try {
                            await api.seed(selectedWs, 2);
                            const ps = await api.projects(selectedWs);
                            setProjects(ps.items);
                        } catch (e) {
                            setMsg(e.message);
                        }
                    }}
                >
                    🚀 Add Sample Project #2 (Korean)
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
