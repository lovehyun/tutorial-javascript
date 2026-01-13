import { useState } from 'react';
import { api, setToken } from '../api.js';
import { Field } from './Field';
import { useModal } from './Modal';

export function AuthCard({ onAuthed }) {
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { alert } = useModal();

  async function createSampleUser() {
    setLoading(true);
    try {
        const creds = await api.sampleUser();
        setEmail(creds.email);
        setPassword(creds.password);
        setName(creds.name);
        setMode('login');
        
        await alert('Sample User Created', (
            <div className="space-y-2">
                <p>A sample user has been created for you.</p>
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                    <div><strong>Email:</strong> {creds.email}</div>
                    <div><strong>Password:</strong> {creds.password}</div>
                </div>
                <p className="text-sm text-gray-500">Credentials have been auto-filled.</p>
            </div>
        ));
    } catch (e) {
        setMsg(`❌ ${e.message}`);
    } finally {
        setLoading(false);
    }
  }

  async function submit() {
    setMsg('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await api.signup(email, password, name);
        setMsg('✅ Account created! Please login.');
        setMode('login');
      } else {
        const data = await api.login(email, password);
        setToken(data.accessToken);
        onAuthed();
      }
    } catch (e) {
      setMsg(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl transition-all hover:shadow-2xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">TaskFlow</h2>
      <p className="text-gray-500 mb-6 text-sm">
        {mode === 'login' ? 'Manage your projects with elegance.' : 'Join to start organizing your work.'}
      </p>

      <div className="flex gap-2 mb-6 bg-gray-50 p-1 rounded-xl">
        <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-white text-pastel-blue-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} 
            onClick={() => setMode('login')}
        >
            Login
        </button>
        <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'signup' ? 'bg-white text-pastel-blue-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} 
            onClick={() => setMode('signup')}
        >
            Sign Up
        </button>
      </div>

      <div className="space-y-4">
        {mode === 'signup' && <Field label="Name" value={name} onChange={setName} />}
        <Field label="Email" value={email} onChange={setEmail} />
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        <button 
            className="w-full py-3 bg-pastel-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all" 
            onClick={submit} 
            disabled={loading}
        >
          {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
        </button>
        {msg && <div className="text-center text-sm text-pastel-red-500" role="alert">{msg}</div>}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <button 
            className="text-pastel-blue-500 hover:text-pastel-blue-600 text-sm font-bold transition-colors flex items-center justify-center gap-2 mx-auto" 
            onClick={createSampleUser}
        >
            🌱 Start with Sample User
        </button>
      </div>
    </div>
  );
}
