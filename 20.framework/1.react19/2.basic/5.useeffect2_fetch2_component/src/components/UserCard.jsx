export default function UserCard({ user, onRemove }) {
    return (
        <li
            style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <h3 style={{ margin: 0 }}>{user.name}</h3>

                {/* (선택) 삭제 버튼: 필요 없으면 App에서 onRemove 안 넘기면 됨 */}
                {onRemove && (
                    <button type="button" onClick={() => onRemove(user.id)}>
                        삭제
                    </button>
                )}
            </div>

            <p style={{ margin: '8px 0 0' }}>
                📧 이메일: <a href={`mailto:${user.email}`}>{user.email}</a>
            </p>
            <p style={{ margin: '6px 0 0' }}>📞 전화번호: {user.phone}</p>
            <p style={{ margin: '6px 0 0' }}>🏢 회사: {user.company?.name}</p>
            <p style={{ margin: '6px 0 0' }}>
                📍 주소: {user.address?.city}, {user.address?.street}
            </p>
        </li>
    );
}
