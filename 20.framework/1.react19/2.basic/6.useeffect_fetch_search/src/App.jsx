import { useEffect, useState } from 'react';

export default function App() {
    const [keyword, setKeyword] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!keyword) {
            setUsers([]);
            return;
        }

        console.log('즉시 검색 실행:', keyword);

        fetch('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
            .then((data) => {
                const filtered = data.filter((u) =>
                    u.name.toLowerCase().includes(keyword.toLowerCase())
                );
                setUsers(filtered);
            });

    }, [keyword]); // keyword 바뀔 때마다 즉시 실행

    return (
        <div style={{ padding: 16 }}>
            <h2>사용자 검색</h2>

            <input
                placeholder="이름 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ padding: 8, width: '30%' }}
            />

            <ul>
                {users.map((u) => (
                    <li key={u.id}>{u.name}</li>
                ))}
            </ul>
        </div>
    );
}
