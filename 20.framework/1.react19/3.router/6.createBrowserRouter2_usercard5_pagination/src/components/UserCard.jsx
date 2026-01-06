import { Link } from 'react-router-dom';

export default function UserCard({ user, onRemove }) {
    return (
        <div className="card h-100">
            <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">
                    <Link to={`/users/${user.id}`} className="text-decoration-none">
                        {user.name}
                    </Link>
                </h5>

                <p className="card-text text-muted mb-1">{user.email}</p>

                <p className="card-text mb-3">🏢 {user.company?.name}</p>

                {/* 카드 하단에 버튼 고정 */}
                <div className="mt-auto d-flex justify-content-between">
                    <Link to={`/users/${user.id}`} className="btn btn-sm btn-outline-primary">
                        상세보기
                    </Link>

                    {onRemove && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(user.id)}>
                            삭제
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
