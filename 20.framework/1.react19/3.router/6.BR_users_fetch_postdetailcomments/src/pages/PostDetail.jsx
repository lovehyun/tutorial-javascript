// src/pages/PostDetail.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchPostById, fetchCommentsByPostId } from '../api/usersApi.js';

export default function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setErrorMsg('');
        setPost(null);
        setComments([]);

        // 상세 + 댓글을 같이 로딩(둘 다 끝나면 화면 표시)
        Promise.all([
            fetchPostById(postId, { signal: controller.signal }),
            fetchCommentsByPostId(postId, { signal: controller.signal }),
        ])
            .then(([postData, commentsData]) => {
                // JSONPlaceholder 특성상 "없는 id"에 대해 200 + {}가 올 수도 있어 방어
                if (!postData || !postData.id) {
                    setErrorMsg('게시글을 찾을 수 없습니다.');
                    setLoading(false);
                    return;
                }

                setPost(postData);
                setComments(Array.isArray(commentsData) ? commentsData : []);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setErrorMsg(err.message || '상세 정보를 불러오지 못했습니다.');
                setLoading(false);
            });

        return () => controller.abort();
    }, [postId]);

    if (loading) return <p>로딩 중...</p>;

    if (errorMsg) {
        return (
            <div>
                <h1>Post Detail</h1>
                <p style={{ color: 'crimson' }}>{errorMsg}</p>

                <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate(-1)}>뒤로</button>
                    <Link to="/posts">Posts로</Link>
                </div>
            </div>
        );
    }

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
