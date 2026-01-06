import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, getPost, updatePost } from '../api/boardApi.js';

export default function PostForm({ mode }) {
    const isEdit = mode === 'edit';
    const { id } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const { data: post, isLoading } = useQuery({
        queryKey: ['post', id],
        queryFn: () => getPost(id),
        enabled: isEdit && !!id,
    });

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

    // 수정 모드면 기존 값 채우기
    useEffect(() => {
        if (isEdit && post) {
            setTitle(post.title);
            setAuthor(post.author);
            setContent(post.content);
        }
    }, [isEdit, post]);

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

    function validate() {
        if (!title.trim()) return '제목을 입력해 주세요.';
        if (!author.trim()) return '작성자를 입력해 주세요.';
        if (!content.trim()) return '본문을 입력해 주세요.';
        if (title.trim().length > 80) return '제목은 80자 이내로 입력해 주세요.';
        return '';
    }

    function onSubmit(e) {
        e.preventDefault();
        const msg = validate();
        if (msg) return alert(msg);

        if (isEdit) updateMut.mutate();
        else createMut.mutate();
    }

    if (isEdit && isLoading) return <p className="text-muted">로딩 중...</p>;

    const pending = createMut.isPending || updateMut.isPending;

    return (
        <div style={{ maxWidth: 860 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">{isEdit ? '글 수정' : '글쓰기'}</h1>
                <Link className="btn btn-outline-secondary" to="/posts">
                    목록
                </Link>
            </div>

            <form onSubmit={onSubmit} className="card">
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">제목</label>
                        <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">작성자</label>
                        <input className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">본문</label>
                        <textarea
                            className="form-control"
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn btn-primary" type="submit" disabled={pending}>
                            {pending ? '저장 중...' : '저장'}
                        </button>
                        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate(-1)}>
                            취소
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
