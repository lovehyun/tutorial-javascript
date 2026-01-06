import { useEffect, useState } from 'react';
import UserCard from './components/UserCard.jsx';

export default function App() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            });
    }, []);

    // (선택) 삭제 기능
    function removeUser(id) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
    }

    if (loading) return <p>로딩 중...</p>;

    return (
        <div style={{ padding: 16, maxWidth: 520 }}>
            <h1>사용자 목록</h1>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {users.map((u) => (
                    <UserCard key={u.id} user={u} onRemove={removeUser} />
                ))}
            </ul>
        </div>
    );
}
