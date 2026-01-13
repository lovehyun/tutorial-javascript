import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from './api.js';
import { Navbar } from './components/Navbar';

export function Protected() {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
    </div>
  );
}
