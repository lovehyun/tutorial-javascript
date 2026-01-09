import { useAuth } from '../auth/AuthProvider.jsx';

export default function ProfilePage() {
    const { user } = useAuth();

    // ProtectedRoute가 이미 미로그인 접근을 막으므로,
    // 여기서는 "프로필 표시"만 책임집니다.
    const userId = user?.id ?? '(unknown)';

    const cardStyle = {
        padding: 12,
        borderRadius: 10,
        border: '1px solid #ddd',
        display: 'grid',
        gap: 10,
    };

    const rowStyle = {
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 10,
        alignItems: 'center',
    };

    const labelStyle = { fontSize: 13, opacity: 0.6 };
    const valueStyle = { fontSize: 14 };

    return (
        <div style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
            <h1 style={{ marginTop: 0, marginBottom: 12 }}>프로필</h1>

            <div style={cardStyle}>
                <div style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>
                    ✅ 이 페이지는 <b>ProtectedRoute</b>로 보호되어 있으며,
                    <br />
                    <b>로그인한 사용자만</b> 접근할 수 있습니다.
                </div>

                <div style={{ height: 1, background: '#eee' }} />

                <div style={rowStyle}>
                    <div style={labelStyle}>사용자 ID</div>
                    <div style={valueStyle}>
                        <b>{userId}</b>
                    </div>
                </div>

                {/* 지금은 fakeLoginApi라서 id만 있어도 충분하지만,
            나중에 user에 email/role 등이 붙으면 여기에 행만 추가하면 됩니다. */}
                <div style={rowStyle}>
                    <div style={labelStyle}>권한</div>
                    <div style={valueStyle}>로그인 사용자</div>
                </div>

                <div style={rowStyle}>
                    <div style={labelStyle}>세션 상태</div>
                    <div style={valueStyle}>활성(Authenticated)</div>
                </div>
            </div>
        </div>
    );
}
