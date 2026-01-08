import { NavLink, Outlet } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 400,
});

export default function RootLayout() {
    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
            <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <NavLink to="/" end style={linkStyle}>
                    Home
                </NavLink>
                <NavLink to="/users" style={linkStyle}>
                    Users
                </NavLink>
                <NavLink to="/about" style={linkStyle}>
                    About
                </NavLink>
            </nav>

            <hr style={{ marginBottom: 16 }} />

            {/* 자식 라우트 렌더링 */}
            <Outlet />
        </div>
    );
}
