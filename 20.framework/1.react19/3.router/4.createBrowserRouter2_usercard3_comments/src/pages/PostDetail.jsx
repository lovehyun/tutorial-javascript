import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();

    // 게시글 캐시에서 찾기(기존 방식 유지)
    const post = useMemo(() => {
        const raw = sessionStorage.getItem('posts_cache');
        if (!raw) return null;
        const list = JSON.parse(raw);
        return list.find((p) => String(p.id) === String(postId)) || null;
    }, [postId]);

    // 댓글 상태
    const [comments, setComments] = useState([]);
    const [cLoading, setCLoading] = useState(true);
    const [cError, setCError] = useState('');
    const [showComments, setShowComments] = useState(true);

    // 댓글 로드(useEffect)
    useEffect(() => {
        // postId가 바뀌면 댓글도 다시 로드
        setCLoading(true);
        setCError('');
        setComments([]);

        const controller = new AbortController();
        
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setComments(data);
                setCLoading(false);
            })
            .catch((err) => {
                // ✅ 라우트 이동/재요청으로 취소된 경우는 무시
                if (err?.name === 'AbortError') return;

                setCError(err.message || '댓글 로드 실패');
                setCLoading(false);
            });

        // ✅ postId 바뀌거나 컴포넌트 언마운트되면 이전 요청 취소
        return () => controller.abort();
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
            {/* 상단 헤더 */}
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

            {/* 본문 */}
            <div className="card mb-3">
                <div className="card-body">
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {post.body}
                    </p>
                </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">댓글</h4>

                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowComments((v) => !v)}>
                    {showComments ? '댓글 접기' : '댓글 펼치기'}
                </button>
            </div>

            {/* 조건부 렌더링: 접힘/펼침 */}
            {showComments && (
                <>
                    {/* 로딩/에러 상태 */}
                    {cLoading && <p className="text-muted">댓글 로딩 중...</p>}
                    {cError && (
                        <div className="alert alert-danger" role="alert">
                            댓글을 불러오지 못했습니다: {cError}
                        </div>
                    )}

                    {/* 댓글 리스트 */}
                    {!cLoading && !cError && (
                        <>
                            <p className="text-muted">총 {comments.length}개</p>

                            <div className="list-group">
                                {comments.map((c) => (
                                    <div key={c.id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <div className="fw-semibold">{c.name}</div>
                                                <div className="text-muted small">{c.email}</div>
                                            </div>
                                            <span className="badge text-bg-light">#{c.id}</span>
                                        </div>

                                        <hr className="my-2" />

                                        <div style={{ whiteSpace: 'pre-wrap' }}>{c.body}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            <div className="mt-3">
                <Link to="/posts">← Posts로</Link>
            </div>
        </div>
    );
}
