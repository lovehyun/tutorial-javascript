import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const post = useMemo(() => {
        const raw = sessionStorage.getItem('posts_cache');
        if (!raw) return null;
        const list = JSON.parse(raw);
        return list.find((p) => String(p.id) === String(postId)) || null;
    }, [postId]);

    if (!post) {
        return (
            <div style={{ maxWidth: 720 }}>
                <h1>Post Detail</h1>
                <p className="text-muted">
                    게시글 데이터를 찾을 수 없습니다. 먼저 <Link to="/posts">/posts</Link>로 가서 로딩해 주세요.
                </p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 720 }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h1 className="mb-1">{post.title}</h1>
                    <div className="text-muted">
                        Post #{post.id} · User #{post.userId}
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                        뒤로
                    </button>
                    <Link className="btn btn-outline-primary" to="/posts">
                        목록
                    </Link>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {post.body}
                    </p>
                </div>
            </div>

            <div className="mt-3">
                <Link to="/posts">← Posts로</Link>
            </div>
        </div>
    );
}
