import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function UserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const user = useMemo(() => {
        const raw = sessionStorage.getItem('users_cache');
        if (!raw) return null;
        const list = JSON.parse(raw);
        return list.find((u) => String(u.id) === String(userId)) || null;
    }, [userId]);

    function removeHere() {
        const raw = sessionStorage.getItem('users_cache');
        const list = raw ? JSON.parse(raw) : [];
        const next = list.filter((u) => String(u.id) !== String(userId));
        sessionStorage.setItem('users_cache', JSON.stringify(next));
        // 삭제 후 목록으로 이동
        navigate('/users');
    }

    if (!user) {
        return (
            <div style={{ maxWidth: 720 }}>
                <h1>User Detail</h1>
                <p className="text-muted">
                    사용자 데이터를 찾을 수 없습니다. 먼저 <Link to="/users">/users</Link>로 가서 로딩해 주세요.
                </p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 720 }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h1 className="mb-1">{user.name}</h1>
                    <div className="text-muted">{user.email}</div>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                        뒤로
                    </button>
                    <button className="btn btn-outline-danger" onClick={removeHere}>
                        삭제
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="mb-2">📞 {user.phone}</div>
                    <div className="mb-2">🌐 {user.website}</div>
                    <div className="mb-2">🏢 {user.company?.name}</div>
                    <div className="mb-2">
                        📍 {user.address?.city}, {user.address?.street}, {user.address?.suite}
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <Link to="/users">← 목록으로</Link>
            </div>
        </div>
    );
}
