import React from 'react';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
    const { userId } = useParams(); // URL에서 userId를 추출
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // /api/users/:userId 엔드포인트에서 데이터를 가져옴
        fetch(`/api/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('User not found');
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => setError(error.message));
    }, [userId]);

    // useEffect(() => {
    //     const fetchUserDetail = async () => {
    //         try {
    //             const response = await fetch(`/api/users/${userId}`); // 비동기 요청
    //             if (!response.ok) {
    //                 throw new Error('User not found');
    //             }
    //             const data = await response.json(); // JSON 파싱
    //             setUser(data); // 상태 업데이트
    //         } catch (err) {
    //             setError(err.message); // 에러 처리
    //         }
    //     };
    // 
    //     fetchUserDetail(); // 비동기 함수 호출
    // }, [userId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>Loading...</p>;
    }
    
    return (
        <div>
            <h2>User Detail</h2>
            <p>Viewing details for user ID: {userId}</p>

            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Age:</strong> {user.age}</p>
        </div>
    );
};

export default UserDetail;
