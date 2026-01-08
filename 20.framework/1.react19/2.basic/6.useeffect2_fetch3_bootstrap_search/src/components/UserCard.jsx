export default function UserCard({ user, onRemove }) {
    return (
        <div className="card mb-3">
            <div className="card-body">
                {/* 제목 + 삭제 버튼 */}
                <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title mb-1">{user.name}</h5>

                    {onRemove && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(user.id)}>
                            삭제
                        </button>
                    )}
                </div>

                <p className="card-text mb-1">
                    📧 이메일:{' '}
                    <a href={`mailto:${user.email}`} className="text-decoration-none">
                        {user.email}
                    </a>
                </p>

                <p className="card-text mb-1">📞 전화번호: {user.phone}</p>
                <p className="card-text mb-1">🏢 회사: {user.company?.name}</p>
                <p className="card-text mb-0">
                    📍 주소: {user.address?.city}, {user.address?.street}
                </p>
            </div>

            {/* 추가1. 카드에 Footer 추가 */}
            <div className="card-footer text-muted">
                User ID: {user.id}
            </div>

        </div>
    );
}
