// src/pages/RouteError.jsx
import { Link, NavLink, Outlet, useRouteError } from 'react-router-dom';

export default function RouteError() {
    const err = useRouteError();

    // Response throw(404 등)인 경우
    const status = err?.status;
    const statusText = err?.statusText;
    const message =
        (typeof err?.data === 'string' && err.data) ||
        err?.message ||
        '알 수 없는 오류가 발생했습니다.';

    return (
        <div className="container py-4">
            {/* RootLayout과 동일하게 메뉴 유지 */}
            <nav className="d-flex gap-3 mb-4">
                <NavLink to="/" end>
                    Home
                </NavLink>
                <NavLink to="/users">Users</NavLink>
                <NavLink to="/posts">Posts</NavLink>
                <NavLink to="/about">About</NavLink>
            </nav>

            <div>
                <h1>Error</h1>
                <p style={{ color: '#666' }}>
                    {status ? `HTTP ${status}${statusText ? ` ${statusText}` : ''}` : ''}
                </p>
                <p style={{ color: 'crimson' }}>{message}</p>

                <div style={{ marginTop: 12 }}>
                    <Link to="/">Home으로</Link>
                </div>
            </div>

            {/* (선택) 필요 시 자식 Outlet을 여기서 보여주는 패턴도 가능하지만
               지금은 에러 화면만 명확히 보여주기 위해 Outlet은 사용하지 않습니다. */}
        </div>
    );
}
