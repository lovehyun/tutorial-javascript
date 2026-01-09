import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { fetchUserById } from '../api/usersApi.js';

export default function UserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // (옵셔널)
        const controller = new AbortController();

        setLoading(true);
        setErrorMsg('');
        setUser(null);

        // fetch(url, { signal }) 
        // fetch는 이 스위치를 감시하다가 스위치가 켜지면(fetch가 중단되면) 
        // 즉시 요청을 중단하고 Promise를 AbortError로 reject 처리함.
        fetchUserById(userId, { signal: controller.signal })
            .then((data) => {
                // jsonplaceholder는 없는 id면 {}를 줄 때가 있어 방어
                if (!data || !data.id) {
                    setErrorMsg('사용자를 찾을 수 없습니다.');
                    setLoading(false);
                    return;
                }

                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setErrorMsg(err.message || '상세 정보를 불러오지 못했습니다.');
                setLoading(false);
            });

        // (옵셔널)
        return () => controller.abort();
    }, [userId]);

    if (loading) return <p>로딩 중...</p>;

    if (errorMsg) {
        return (
            <div>
                <h1>User Detail</h1>
                <p style={{ color: 'crimson' }}>에러: {errorMsg}</p>

                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate(-1)}>뒤로</button>
                    <Link to="/users">목록</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>User Detail</h1>

            <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, maxWidth: 520 }}>
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
                <Link to="/users">목록</Link>
            </div>
        </div>
    );
}
