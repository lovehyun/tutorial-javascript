import { Link, Outlet } from 'react-router-dom';

export default function RootLayout() {
    return (
        <div className="container py-4">
            <nav className="d-flex gap-3 mb-4">
                <Link to="/users">Users</Link>
            </nav>
            <Outlet />
        </div>
    );
}
