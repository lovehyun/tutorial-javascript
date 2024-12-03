import React from 'react';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
    const { userId } = useParams(); // URL에서 userId를 추출
    return (
        <div>
            <h2>User Detail</h2>
            <p>Viewing details for user ID: {userId}</p>
        </div>
    );
};

export default UserDetail;
