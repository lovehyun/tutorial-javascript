import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPost, fetchPostComments } from '../api/jsonplaceholder.js';
import { useState } from 'react';

// 이제 sessionStorage 완전 제거합니다.
// Detail은 fetchPost(postId)로, Comments는 fetchPostComments(postId)로 각각 쿼리합니다.

export default function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [showComments, setShowComments] = useState(true);

    // 1) 게시글 로드
    const {
        data: post,
        isLoading: postLoading,
        isError: postError,
        error: postErrObj,
    } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPost(postId),
        enabled: !!postId,
    });

    // 2) 댓글 로드 (showComments일 때만 요청하도록 최적화)
    const {
        data: comments = [],
        isLoading: cLoading,
        isError: cIsError,
        error: cErrObj,
    } = useQuery({
        queryKey: ['post', postId, 'comments'],
        queryFn: () => fetchPostComments(postId),
        enabled: !!postId && showComments, // ✅ 접혀있으면 요청 안 함
    });

    if (postLoading) return <p className="text-muted">로딩 중...</p>;

    if (postError) {
        return (
            <div className="alert alert-danger" role="alert">
                Post 로드 실패: {postErrObj?.message}
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

            {showComments && (
                <>
                    {cLoading && <p className="text-muted">댓글 로딩 중...</p>}

                    {cIsError && (
                        <div className="alert alert-danger" role="alert">
                            댓글 로드 실패: {cErrObj?.message}
                        </div>
                    )}

                    {!cLoading && !cIsError && (
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
