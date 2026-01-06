import { Link, NavLink, Outlet } from 'react-router-dom';

export default function RootLayout() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        MyBoard
                    </Link>

                    <div className="navbar-nav">
                        <NavLink className="nav-link" to="/posts">
                            Posts
                        </NavLink>
                        <NavLink className="nav-link" to="/posts/new">
                            Write
                        </NavLink>
                    </div>
                </div>
            </nav>

            <main className="container py-4">
                <Outlet />
            </main>
        </div>
    );
}
