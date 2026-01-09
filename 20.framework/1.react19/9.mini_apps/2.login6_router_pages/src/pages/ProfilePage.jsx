export default function ProfilePage() {
    return (
        <div style={{ padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginTop: 0 }}>Profile</h3>
            <p style={{ opacity: 0.8, marginBottom: 0 }}>
                다음 단계에서 전역 Auth + ProtectedRoute를 붙이면 로그인한 사용자만 이 페이지에 접근하도록 막을 수
                있습니다.
            </p>
        </div>
    );
}
