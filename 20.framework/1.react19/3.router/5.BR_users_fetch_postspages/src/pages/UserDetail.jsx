import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchUserById, deleteUserById } from '../api/usersApi.js';

export default function UserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setErrorMsg('');
        setUser(null);

        fetchUserById(userId, { signal: controller.signal })
            .then((data) => {
                // (참고) 보통 404면 usersApi에서 throw로 빠져 여기까지 안 옴
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

        return () => controller.abort();
    }, [userId]);

    async function deleteHere() {
        if (deleting) return;

        setDeleting(true);

        try {
            await deleteUserById(userId);

            // 삭제 성공 처리: 목록으로 이동 (실데이터 반영은 안 되지만 흐름 학습)
            // 돌아가면 목록이 다시 fetch 되면서 삭제된게 모두 초기화 됨 (그냥 jsonplaceholder 의 특징)
            navigate('/users');
        } catch (err) {
            alert(err.message || '삭제에 실패했습니다.');
        } finally {
            setDeleting(false);
        }
    }

    if (loading) return <p>로딩 중...</p>;

    if (errorMsg) {
        return (
            <div>
                <h1>User Detail</h1>
                <p style={{ color: 'crimson' }}>에러: {errorMsg}</p>
                <Link to="/users">목록</Link>
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

                <button onClick={deleteHere} disabled={deleting}>
                    {deleting ? '삭제 중…' : '삭제'}
                </button>
            </div>
        </div>
    );
}
