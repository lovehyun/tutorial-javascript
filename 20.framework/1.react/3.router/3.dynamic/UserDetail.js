import React from 'react';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
    const { userId } = useParams(); // URL에서 userId를 추출

    // 유저 데이터 (모킹 데이터)
    // const users = [
    //     { id: 1, name: "Alice", email: "alice@example.com", age: 25 },
    //     { id: 2, name: "Bob", email: "bob@example.com", age: 30 },
    //     { id: 3, name: "Charlie", email: "charlie@example.com", age: 35 },
    // ];

    // 선택된 유저 찾기
    // const user = users.find((u) => u.id === parseInt(userId));

    // 유저가 없을 경우 처리
    // if (!user) {
        // return <p>User not found.</p>;
    // }

    return (
        <div>
            <h2>User Detail</h2>
            <p>Viewing details for user ID: {userId}</p>

            {/* <p><strong>Name:</strong> {user.name}</p> */}
            {/* <p><strong>Email:</strong> {user.email}</p> */}
            {/* <p><strong>Age:</strong> {user.age}</p> */}
        </div>
    );
};

export default UserDetail;
