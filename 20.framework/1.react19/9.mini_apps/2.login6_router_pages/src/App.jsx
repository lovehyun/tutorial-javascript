import { NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const linkStyle = ({ isActive }) => ({
    padding: '8px 10px',
    borderRadius: 10,
    textDecoration: 'none',
    color: 'inherit',
    background: isActive ? 'rgba(0,0,0,0.08)' : 'transparent',
});

export default function App() {
    return (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 16 }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <h2 style={{ margin: 0 }}>LoginApp</h2>
                
                <nav style={{ display: 'flex', gap: 8 }}>
                    <NavLink to="/" style={linkStyle}>
                        Home
                    </NavLink>
                    <NavLink to="/login" style={linkStyle}>
                        Login
                    </NavLink>
                    <NavLink to="/profile" style={linkStyle}>
                        Profile
                    </NavLink>
                </nav>
            </header>

            <main style={{ marginTop: 16 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>
        </div>
    );
}
