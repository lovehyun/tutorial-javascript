import { Link, Outlet } from 'react-router-dom';

export default function RootLayout() {
    return (
        <div style={{ padding: 16 }}>
            <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <Link to="/">Home</Link>
                <Link to="/users">Users</Link>
            </nav>

            <Outlet />
        </div>
    );
}
