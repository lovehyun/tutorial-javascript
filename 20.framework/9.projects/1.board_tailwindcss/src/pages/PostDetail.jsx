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
            qc.invalidateQueries({ queryKey: ['posts'] });
            qc.removeQueries({ queryKey: ['post', id] });
            navigate('/posts');
        },
    });

    if (isLoading) return <p className="text-slate-500">로딩 중...</p>;

    if (isError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                상세 로드 실패: {error?.message}
                <div className="mt-3">
                    <Link className="text-blue-700 hover:underline" to="/posts">
                        ← 목록으로
                    </Link>
                </div>
            </div>
        );
    }

    const btnPrimary =
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold ' +
        'bg-blue-600 text-white shadow-sm shadow-blue-200 hover:bg-blue-500 active:scale-[0.98]';
    const btnGhost =
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold ' +
        'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 active:scale-[0.98]';
    const btnDanger =
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold ' +
        'bg-red-600 text-white shadow-sm shadow-red-200 hover:bg-red-500 active:scale-[0.98] disabled:opacity-60';

    return (
        <div className="max-w-3xl space-y-4">
            {/* 상단 */}
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl font-bold tracking-tight break-words">{post.title}</h1>
                    <div className="mt-1 text-sm text-slate-600">
                        작성자 <span className="font-semibold text-slate-800">{post.author}</span> ·{' '}
                        <span className="tabular-nums">{new Date(post.createdAt).toLocaleString()}</span>
                        {post.updatedAt ? (
                            <>
                                {' '}
                                · 수정 <span className="tabular-nums">{new Date(post.updatedAt).toLocaleString()}</span>
                            </>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button className={btnGhost} onClick={() => navigate(-1)}>
                        뒤로
                    </button>
                    <Link className={btnGhost} to={`/posts/${post.id}/edit`}>
                        수정
                    </Link>
                    <button
                        className={btnDanger}
                        onClick={() => {
                            if (confirm('정말 삭제하시겠습니까?')) delMut.mutate();
                        }}
                        disabled={delMut.isPending}
                    >
                        {delMut.isPending ? '삭제 중...' : '삭제'}
                    </button>
                </div>
            </div>

            {/* 본문 카드 */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="p-5">
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-800">{post.content}</div>
                </div>
            </div>

            {/* 하단 */}
            <div className="flex items-center justify-between">
                <Link className="text-sm font-semibold text-blue-700 hover:underline" to="/posts">
                    ← 목록으로
                </Link>
                <Link className={btnPrimary} to="/posts/new">
                    새 글
                </Link>
            </div>
        </div>
    );
}
