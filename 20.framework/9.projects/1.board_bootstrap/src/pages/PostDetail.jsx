import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePost, getPost } from '../api/boardApi.js';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const {
        data: post,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['post', id],
        queryFn: () => getPost(id),
        enabled: !!id,
    });

    const delMut = useMutation({
        mutationFn: () => deletePost(id),
        onSuccess: () => {
            // 목록 캐시 무효화(페이지/검색 조건별로 키가 여러 개라 prefix로 정리)
            qc.invalidateQueries({ queryKey: ['posts'] });
            qc.removeQueries({ queryKey: ['post', id] });
            navigate('/posts');
        },
    });

    if (isLoading) return <p className="text-muted">로딩 중...</p>;
    if (isError) {
        return (
            <div className="alert alert-danger" role="alert">
                상세 로드 실패: {error?.message}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 860 }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h1 className="mb-1">{post.title}</h1>
                    <div className="text-muted small">
                        작성자: {post.author} · 작성: {new Date(post.createdAt).toLocaleString()}
                        {post.updatedAt ? ` · 수정: ${new Date(post.updatedAt).toLocaleString()}` : ''}
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                        뒤로
                    </button>
                    <Link className="btn btn-outline-primary" to={`/posts/${post.id}/edit`}>
                        수정
                    </Link>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                            if (confirm('정말 삭제하시겠습니까?')) delMut.mutate();
                        }}
                        disabled={delMut.isPending}
                    >
                        {delMut.isPending ? '삭제 중...' : '삭제'}
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
                </div>
            </div>

            <div className="mt-3">
                <Link to="/posts">← 목록으로</Link>
            </div>
        </div>
    );
}
