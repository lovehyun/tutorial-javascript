import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Users = () => {
    // const users = [
    //     { id: 1, name: 'Alice' },
    //     { id: 2, name: 'Bob' },
    //     { id: 3, name: 'Charlie' },
    // ];

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // /api/users 엔드포인트에서 요약 정보를 가져옴
        fetch('/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await fetch('/api/users'); // 비동기 요청
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch users');
    //             }
    //             const data = await response.json(); // JSON 파싱
    //             setUsers(data); // 상태 업데이트
    //         } catch (err) {
    //             setError(err.message); // 에러 처리
    //         }
    //     };

    //     fetchUsers(); // 비동기 함수 호출
    // }, []);

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Users;
