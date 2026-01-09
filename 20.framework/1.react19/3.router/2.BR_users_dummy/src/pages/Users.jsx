import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { fetchUsers } from '../api/fakeUsersApi.js';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers().then((data) => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>로딩 중...</p>;

    return (
        <div>
            <h1>Users</h1>
            <p>유저 목록 (이름만)</p>

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
