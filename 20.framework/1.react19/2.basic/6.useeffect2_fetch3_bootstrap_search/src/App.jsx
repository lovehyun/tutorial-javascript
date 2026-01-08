import { useEffect, useState } from 'react';
import UserCard from './components/UserCard.jsx';

export default function App() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

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

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // function filterUsers() {
    //     return users.filter(u =>
    //         u.name.toLowerCase().includes(keyword.toLowerCase())
    //     );
    // }

    if (loading) return <p>로딩 중...</p>;

    return (
        <div className="container py-4">
            <h1 className="mb-4">사용자 목록</h1>

            {/* 한줄이면 끝나지만, 실무적인 예시로 컴포넌트로 분리 */}
            {/* <input
                placeholder="이름 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="form-control mb-4"
                style={{ maxWidth: 300 }}
            /> */}

            <SearchInput value={keyword} onChange={setKeyword} />

            <div className="row">
                {filteredUsers.map(u => (
                    <div className="col-md-6 col-lg-4" key={u.id}>
                        <UserCard user={u} onRemove={removeUser} />
                    </div>
                ))}
            </div>

        </div>
    );
}
