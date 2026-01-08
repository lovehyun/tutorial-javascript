// src/pages/PostDetail.jsx
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

export default function PostDetail() {
    const navigate = useNavigate();

    // ✅ router loader가 반환한 데이터
    const { post, comments } = useLoaderData();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                <div>
                    <h1 style={{ marginBottom: 6 }}>Post #{post.id}</h1>
                    <h3 style={{ marginTop: 0 }}>{post.title}</h3>
                    <p style={{ color: '#666' }}>userId: {post.userId}</p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate(-1)}>뒤로</button>
                    <Link to="/posts">목록</Link>
                </div>
            </div>

            <hr />

            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{post.body}</p>

            <hr />

            <h2 style={{ marginBottom: 8 }}>Comments ({comments.length})</h2>

            {comments.length === 0 ? (
                <p style={{ color: '#666' }}>댓글이 없습니다.</p>
            ) : (
                <ul>
                    {comments.map((c) => (
                        <li key={c.id} style={{ marginBottom: 12 }}>
                            <div style={{ fontWeight: 700 }}>{c.name}</div>
                            <div style={{ color: '#666' }}>{c.email}</div>
                            <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{c.body}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
