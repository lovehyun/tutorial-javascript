import { useNavigate, useParams } from 'react-router-dom';

export default function UserDetail() {
    const { userId } = useParams(); // URL 파라미터 읽기
    const navigate = useNavigate(); // 코드로 이동하기

    return (
        <>
            <h1>User Detail</h1>
            <p>userId: {userId}</p>

            <button onClick={() => navigate('/users')}>목록으로</button>
            <button onClick={() => navigate(-1)} style={{ marginLeft: 8 }}>
                뒤로가기
            </button>
        </>
    );
}
