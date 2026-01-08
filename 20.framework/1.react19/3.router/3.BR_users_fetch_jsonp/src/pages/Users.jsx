import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../api/usersApi.js';

// AbortController는 "브라우저 기본 내장(Web API)"입니다
//  - React 기능이 아니라 브라우저가 제공하는 표준 API라서
//  - import 없이 그냥 쓸 수 있습니다.
//  - (예: fetch, localStorage, URL, AbortController 다 같은 부류)
// 목적: "페이지 이동/언마운트 시, 진행 중인 fetch를 취소"
// React에서 흔한 문제:
//  - Users 페이지에서 fetch 하는 중에 다른 페이지로 이동하면
//  - fetch가 끝난 뒤 setState()가 실행되면서
//  - "언마운트된 컴포넌트에 setState" 경고/낭비가 생길 수 있습니다.
// 그래서,
//  - 컴포넌트가 바뀌거나 언마운트될 때 cleanup에서 abort()
//  - fetch가 즉시 취소됨
//  - 취소된 fetch는 AbortError로 끝나는데, 우리는 그건 "정상 취소"라 에러로 처리하지 않습니다.

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

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

    if (loading) return <p>로딩 중...</p>;

    if (errorMsg) {
        return (
            <div>
                <h1>Users</h1>
                <p style={{ color: 'crimson' }}>에러: {errorMsg}</p>
                <button onClick={() => window.location.reload()}>새로고침</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Users</h1>
            <p>목록: 이름만 표시</p>

            <ul>
                {users.map((u) => (
                    <li key={u.id}>
                        <Link to={`/users/${u.id}`}>{u.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
