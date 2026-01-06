import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, getPost, updatePost } from '../api/boardApi.js';

export default function PostForm({ mode }) {
    const isEdit = mode === 'edit';
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
        enabled: isEdit && !!id,
    });

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (isEdit && post) {
            setTitle(post.title ?? '');
            setAuthor(post.author ?? '');
            setContent(post.content ?? '');
        }
    }, [isEdit, post]);

    const pageTitle = useMemo(() => (isEdit ? '글 수정' : '글쓰기'), [isEdit]);

    function validate() {
        if (!title.trim()) return '제목을 입력해 주세요.';
        if (!author.trim()) return '작성자를 입력해 주세요.';
        if (!content.trim()) return '본문을 입력해 주세요.';
        if (title.trim().length > 80) return '제목은 80자 이내로 입력해 주세요.';
        if (author.trim().length > 20) return '작성자는 20자 이내로 입력해 주세요.';
        return '';
    }

    const createMut = useMutation({
        mutationFn: () => createPost({ title, author, content }),
        onSuccess: (created) => {
            qc.invalidateQueries({ queryKey: ['posts'] });
            qc.setQueryData(['post', created.id], created);
            navigate(`/posts/${created.id}`);
        },
    });

    const updateMut = useMutation({
        mutationFn: () => updatePost(id, { title, author, content }),
        onSuccess: (updated) => {
            qc.invalidateQueries({ queryKey: ['posts'] });
            qc.setQueryData(['post', id], updated);
            navigate(`/posts/${id}`);
        },
    });

    const pending = createMut.isPending || updateMut.isPending;

    function onSubmit(e) {
        e.preventDefault();
        const msg = validate();
        if (msg) return alert(msg);
        if (isEdit) updateMut.mutate();
        else createMut.mutate();
    }

    if (isEdit && isLoading) return <p className="text-slate-500">로딩 중...</p>;

    if (isEdit && isError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                게시글 로드 실패: {error?.message}
                <div className="mt-3">
                    <Link className="text-blue-700 hover:underline" to="/posts">
                        ← 목록으로
                    </Link>
                </div>
            </div>
        );
    }

    const input =
        'w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 ' +
        'ring-1 ring-slate-200 placeholder:text-slate-400 ' +
        'focus:outline-none focus:ring-2 focus:ring-blue-200';
    const label = 'text-sm font-semibold text-slate-800';
    const help = 'text-xs text-slate-500';

    const primaryBtn =
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold ' +
        'bg-blue-600 text-white shadow-sm shadow-blue-200 ' +
        'hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60';
    const ghostBtn =
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold ' +
        'bg-white text-slate-700 ring-1 ring-slate-200 ' +
        'hover:bg-slate-50 active:scale-[0.98] disabled:opacity-60';

    return (
        <div className="max-w-3xl">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">{pageTitle}</h1>
                    <p className="text-sm text-slate-500">제목·작성자·본문을 입력하고 저장하세요.</p>
                </div>

                <Link className="text-sm font-semibold text-blue-700 hover:underline" to="/posts">
                    목록
                </Link>
            </div>

            {/* 폼 카드 (Tailwind스럽게: ring+shadow+라운딩) */}
            <form onSubmit={onSubmit} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div className="p-5 space-y-5">
                    {/* 제목 */}
                    <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between">
                            <label className={label}>제목</label>
                            <span className={help}>{title.trim().length}/80</span>
                        </div>
                        <input
                            className={input}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요 (최대 80자)"
                        />
                    </div>

                    {/* 작성자 */}
                    <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between">
                            <label className={label}>작성자</label>
                            <span className={help}>{author.trim().length}/20</span>
                        </div>
                        <input
                            className={input}
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="작성자 이름 (최대 20자)"
                        />
                    </div>

                    {/* 본문 */}
                    <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between">
                            <label className={label}>본문</label>
                            <span className={help}>줄바꿈/붙여넣기 가능</span>
                        </div>
                        <textarea
                            className={input}
                            rows={12}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                        />
                    </div>

                    {/* 저장 실패 메시지 */}
                    {(createMut.isError || updateMut.isError) && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                            저장 실패: {createMut.error?.message || updateMut.error?.message || 'Unknown error'}
                        </div>
                    )}
                </div>

                {/* 하단 액션바 */}
                <div className="flex items-center justify-between gap-2 px-5 py-4 bg-slate-50 ring-1 ring-inset ring-slate-200">
                    <div className="text-xs text-slate-500">* 예제는 LocalStorage 기반으로 저장됩니다.</div>

                    <div className="flex items-center gap-2">
                        <button type="submit" className={primaryBtn} disabled={pending}>
                            {pending ? '저장 중...' : '저장'}
                        </button>
                        <button type="button" className={ghostBtn} onClick={() => navigate(-1)} disabled={pending}>
                            취소
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
