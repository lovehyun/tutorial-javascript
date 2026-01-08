import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../api/usersApi.js';

// 목록은 이름만
// 각 항목에 삭제 버튼
// 삭제 중이면 버튼 비활성화 + "삭제 중…" 표시
// 삭제 성공 시 state에서 제거
// 주의: JSONPlaceholder는 실제로 삭제가 DB에 반영되지 않는 "가짜 성공"이라서, UI 상태(state)에서 제거하는 방식으로 학습합니다.

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    // 삭제 중인 id(한 번에 하나만 처리하는 학습용)
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setErrorMsg('');

        fetchUsers({ signal: controller.signal })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                // Abort는 에러로 취급하지 않음
                if (err.name === 'AbortError') return;
                setErrorMsg(err.message || '목록을 불러오지 못했습니다.');
                setLoading(false);
            });

        // 컴포넌트가 바뀌거나 언마운트되면 요청 취소
        return () => controller.abort();
    }, []);

    async function deleteUser(id) {
        // 중복 클릭 방지
        if (deletingId !== null) return;

        setDeletingId(id);

        try {
            // JSONPlaceholder: DELETE는 "성공 응답"만 주고 실제 데이터는 유지됨(학습용)
            const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status} ${res.statusText}`);
            }

            // 성공한 것처럼 UI에서 제거 (학습 포인트)
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            alert(err.message || '삭제에 실패했습니다.');
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) return <p>로딩 중...</p>;

    if (errorMsg) {
        return (
            <div>
                <h1>Users</h1>
                <p style={{ color: 'crimson' }}>에러: {errorMsg}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Users</h1>
            <p>목록: 이름만 표시 + 삭제(WRITE) 추가</p>

            <ul>
                {users.map((u) => {
                    const isDeleting = deletingId === u.id;

                    return (
                        <li key={u.id}>
                            <Link to={`/users/${u.id}`}>{u.name}</Link>

                            <button
                                onClick={() => deleteUser(u.id)}
                                disabled={deletingId !== null} // 학습용: 하나씩만
                                style={{ marginLeft: 8, cursor: deletingId !== null ? 'not-allowed' : 'pointer' }}
                            >
                                {isDeleting ? '삭제 중…' : '삭제'}
                            </button>
                        </li>
                    );
                })}
            </ul>

            {users.length === 0 && <p className="text-muted">표시할 사용자가 없습니다.</p>}
        </div>
    );
}
