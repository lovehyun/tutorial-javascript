import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import ProtectedRoute from './auth/ProtectedRoute.jsx';
import { useAuth } from './auth/AuthProvider.jsx';

export default function App() {
    const navigate = useNavigate();
    const { isAuthed, user, logout } = useAuth();

    /**
     * 로그아웃 버튼 클릭 시:
     * 1) 전역 상태에서 user 제거
     * 2) 홈 또는 로그인으로 이동
     */
    const handleLogout = () => {
        logout();
        navigate('/'); // 원하시면 '/login'으로 바꿔도 됩니다.
    };

    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderBottom: '1px solid #eee',
    };

    const linkStyle = {
        textDecoration: 'none',
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid #ddd',
    };

    return (
        <div>
            {/* ✅ Navbar */}
            <nav style={navStyle}>
                <Link to="/" style={linkStyle}>
                    Home
                </Link>

                {/* Profile은 링크 자체는 보여줄지/숨길지 선택 가능
                    - 요구사항은 "접근 시 보호"이므로 링크는 있어도 됩니다.
                    - 원하시면 isAuthed일 때만 노출하도록 바꿔도 됩니다. */}
                <Link to="/profile" style={linkStyle}>
                    Profile
                </Link>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                    {/* ✅ 로그인 상태에 따라 Login ↔ Logout 토글 */}
                    {!isAuthed ? (
                        <Link to="/login" style={linkStyle}>
                            Login
                        </Link>
                    ) : (
                        <>
                            {/* 로그인 사용자 표시(선택) */}
                            <span style={{ opacity: 0.7, fontSize: 14 }}>
                                {user?.id ? `안녕하세요, ${user.id}` : '로그인됨'}
                            </span>

                            <button
                                type="button"
                                onClick={handleLogout}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                    background: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* ✅ 라우팅 */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* ✅ /profile 보호: 미로그인 접근 시 안내 페이지를 렌더 */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}
