import { useEffect, useMemo, useState } from 'react';
import UserCard from '../components/UserCard.jsx';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState('');

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                sessionStorage.setItem('users_cache', JSON.stringify(data));
                setLoading(false);
            });
    }, []);

    function removeUser(id) {
        setUsers((prev) => {
            const next = prev.filter((u) => u.id !== id);
            sessionStorage.setItem('users_cache', JSON.stringify(next));
            return next;
        });
    }

    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        if (!keyword) return users;
        return users.filter((u) => u.name.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword));
    }, [users, q]);

    if (loading) return <p>로딩 중...</p>;

    return (
        <div>
            <h1 className="mb-3">Users</h1>

            {/* 검색 */}
            <div className="mb-4">
                <input
                    className="form-control"
                    placeholder="이름 또는 이메일 검색"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            {/* Grid 카드뷰 */}
            <div className="row g-3">
                {filtered.map((u) => (
                    <div
                        key={u.id}
                        className="
                            col-12
                            col-md-6
                            col-lg-4
                            "
                    >
                        <UserCard user={u} onRemove={removeUser} />
                    </div>
                ))}
            </div>

            {filtered.length === 0 && <p className="text-muted mt-3">표시할 사용자가 없습니다.</p>}
        </div>
    );
}
