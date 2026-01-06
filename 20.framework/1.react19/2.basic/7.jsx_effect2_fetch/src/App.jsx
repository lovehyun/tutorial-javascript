import { useEffect, useState } from 'react';

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
    }, []); // 한 번만 실행

    if (loading) return <p>로딩 중...</p>;

//     return (
//         <ul>
//             {users.map((u) => (
//                 <li key={u.id}>{u.name}</li>
//             ))}
//         </ul>
//     );
    return (
        <div style={{ padding: 16 }}>
        <h1>사용자 목록</h1>

        <ul style={{ listStyle: "none", padding: 0 }}>
            {users.map((u) => (
                <li
                    key={u.id}
                    style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    }}
                >
                    <h3>{u.name}</h3>

                    <p>📧 이메일: {u.email}</p>
                    <p>📞 전화번호: {u.phone}</p>
                    <p>🏢 회사: {u.company.name}</p>
                    <p>
                    📍 주소: {u.address.city}, {u.address.street}
                    </p>
                </li>
            ))}
        </ul>
        </div>
    );
    }
