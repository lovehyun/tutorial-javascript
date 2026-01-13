import React from 'react';
import { Link, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { setToken } from '../api.js';

export function Navbar() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const view = searchParams.get('view') || 'board';
  const isProject = !!projectId;

  function logout() {
    setToken('');
    navigate('/login');
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-extrabold text-gray-800 tracking-tight hover:opacity-80 transition-opacity">
            TaskFlow
          </Link>
          
          <div className="hidden md:flex gap-1 bg-gray-50 p-1 rounded-xl">
             <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isProject ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
             >
                Dashboard
             </Link>
             {isProject && (
                 <>
                    <div className="w-px bg-gray-200 my-2 mx-1"></div>
                    <Link 
                        to={`/projects/${projectId}?view=board`}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'board' ? 'bg-white text-pastel-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Kanban
                    </Link>
                    <Link 
                        to={`/projects/${projectId}?view=gantt`}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'gantt' ? 'bg-white text-pastel-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Gantt
                    </Link>
                 </>
             )}
          </div>
        </div>

        <button 
            onClick={logout}
            className="text-gray-400 hover:text-red-500 font-medium text-sm transition-colors"
        >
            Logout
        </button>
      </div>
    </nav>
  );
}
