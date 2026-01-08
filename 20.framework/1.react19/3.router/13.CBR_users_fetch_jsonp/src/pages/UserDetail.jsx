import { Link, useLoaderData, useNavigate } from 'react-router-dom';

export default function UserDetail() {
    const user = useLoaderData(); // loader가 반환한 1명 데이터
    const navigate = useNavigate(); // 로직 기반 페이지 이동

    return (
        <div>
            <h1>User Detail</h1>

            <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, maxWidth: 420 }}>
                <div>
                    <b>ID</b>: {user.id}
                </div>
                <div>
                    <b>Name</b>: {user.name}
                </div>
                <div>
                    <b>Email</b>: {user.email}
                </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(-1)}>뒤로</button>
                <Link to="/users">목록</Link>
            </div>
        </div>
    );
}
