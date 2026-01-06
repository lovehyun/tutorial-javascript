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
        <div className="container py-4">
            <h1 className="mb-4">사용자 목록</h1>

            {users.map((u) => (
                <UserCard key={u.id} user={u} onRemove={removeUser} />
            ))}

            {/* 추가2. Grid 카즈뷰 2~3열로 */}
            <div className="row">
                {users.map((u) => (
                    <div className="col-md-6 col-lg-4" key={u.id}>
                    <UserCard user={u} onRemove={removeUser} />
                    </div>
                ))}
            </div>
            
        </div>
    );
}
