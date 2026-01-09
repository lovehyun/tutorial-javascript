import { useAuth } from '../auth/AuthProvider.jsx';

export default function HomePage() {
    const { isAuthed, user } = useAuth();

    const boxStyle = {
        padding: 14,
        borderRadius: 10,
        border: '1px solid #ddd',
        display: 'grid',
        gap: 10,
    };

    return (
        <div style={{ maxWidth: 640, margin: '40px auto', padding: 16 }}>
            <h1 style={{ marginTop: 0, marginBottom: 12 }}>React 로그인 & 권한 제어 예제</h1>

            <div style={boxStyle}>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                    이 프로젝트는 <b>React 기본 기능(Context + Router)</b>만을 사용하여 로그인 상태를 전역으로 관리하고,
                    <br />
                    <b>로그인한 사용자만 접근 가능한 페이지</b>를 구현한 예제입니다.
                </div>

                <div style={{ height: 1, background: '#eee' }} />

                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                    🔒 <b>Profile 페이지</b>는 <b>ProtectedRoute</b>로 보호되어 있으며,
                    <br />
                    로그인하지 않은 상태에서 접근하면
                    <b> “로그인이 필요합니다” 안내 페이지</b>가 표시됩니다.
                </div>

                <div style={{ height: 1, background: '#eee' }} />

                <div style={{ fontSize: 14 }}>
                    현재 상태:&nbsp;
                    {isAuthed ? (
                        <>
                            <b>로그인됨</b> ({user?.id})
                        </>
                    ) : (
                        <b>로그아웃 상태</b>
                    )}
                </div>

                <div style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5 }}>
                    ※ 상단 Navbar를 통해 로그인 / 로그아웃을 전환하고, Profile 페이지 접근 가능 여부를 확인해 보세요.
                </div>
            </div>
        </div>
    );
}
