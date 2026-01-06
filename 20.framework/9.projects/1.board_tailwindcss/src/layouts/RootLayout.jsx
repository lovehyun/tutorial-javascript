import { Link, NavLink, Outlet } from 'react-router-dom';

function NavItem({ to, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                [
                    'px-3 py-2 rounded-md text-sm font-medium',
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100',
                ].join(' ')
            }
        >
            {children}
        </NavLink>
    );
}

export default function RootLayout() {
    return (
        <div className="min-h-screen">
            <header className="bg-white border-b">
                <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                    <Link to="/posts" className="text-lg font-bold">
                        MyBoard
                    </Link>

                    <nav className="flex items-center gap-2">
                        <NavItem to="/posts">목록</NavItem>
                        <NavItem to="/posts/new">글쓰기</NavItem>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-6">
                <Outlet />
            </main>

            <footer className="border-t bg-white">
                <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-500">© MyBoard</div>
            </footer>
        </div>
    );
}
