import { useState, useEffect  } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { fetchUserById } from '../api/fakeUsersApi.js';

export default function UserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserById(userId).then((data) => {
            setUser(data);
            setLoading(false);
        });
    }, [userId]);

    if (loading) return <p>로딩 중...</p>;

    if (!user) {
        return (
            <div>
                <h1>User Detail</h1>
                <p>사용자를 찾을 수 없습니다. (userId: {userId})</p>
                <Link to="/users">← Users 목록으로</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>User Detail</h1>

            <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, maxWidth: 420 }}>
                <div>
                    <b>ID</b>: {user.id}
                </div>
                <div>
                    <b>Name</b>: {user.name}
                </div>
                <div>
                    <b>Email</b>: {user.email}
                </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(-1)}>뒤로</button>
                <Link to="/users">목록으로</Link>
            </div>
        </div>
    );
}
