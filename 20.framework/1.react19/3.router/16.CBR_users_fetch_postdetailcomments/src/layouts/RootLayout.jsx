import { NavLink, Outlet, useNavigation } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 400,
});

export default function RootLayout() {
    const navigation = useNavigation(); // (선택) 로딩중 표시를 위한 함수

    // navigation.state:
    // - "idle"     : 평상시
    // - "loading"  : loader 실행 중(페이지 이동 중)
    // - "submitting": action 제출 중(다음 단계에서)
    const isLoading = navigation.state === 'loading';

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
            <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <NavLink to="/" end style={linkStyle}>
                    Home
                </NavLink>
                <NavLink to="/users" style={linkStyle}>
                    Users
                </NavLink>

                <NavLink to="/posts" style={linkStyle}>
                    Posts
                </NavLink>

                <NavLink to="/about" style={linkStyle}>
                    About
                </NavLink>
            </nav>

            <hr style={{ marginBottom: 16 }} />

            {/* (선택) 로딩 중에는 이전 child를 숨기고 로딩만 보여줌 */}
            {isLoading ? (
                <p>로딩 중...</p>
            ) : (
                <Outlet />
            )}

            {/* (선택2) UX개선 - 오버레이해서 로딩바 보여주기 */}
            {/*
            <div style={{ position: 'relative' }}>
                <Outlet />

                {isLoading && (
                    <div
                        style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(255,255,255,0.7)',
                        }}
                    >
                        <p>로딩 중...</p>
                    </div>
                )}
            </div>
            */}
        </div>
    );
}
