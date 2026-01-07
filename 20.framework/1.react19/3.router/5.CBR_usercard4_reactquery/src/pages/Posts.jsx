import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/jsonplaceholder.js';
import PostCard from '../components/PostCard.jsx';

export default function Posts() {
    const [q, setQ] = useState('');

    const {
        data: posts = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        if (!keyword) return posts;
        return posts.filter((p) => p.title.toLowerCase().includes(keyword) || p.body.toLowerCase().includes(keyword));
    }, [posts, q]);

    if (isLoading) return <p className="text-muted">로딩 중...</p>;

    if (isError) {
        return (
            <div className="alert alert-danger" role="alert">
                Posts 로드 실패: {error?.message}
            </div>
        );
    }

    return (
        <div>
            <h1 className="mb-3">Posts</h1>

            <div className="mb-4">
                <input
                    className="form-control"
                    placeholder="제목 또는 본문 검색"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            <div className="row g-3">
                {filtered.map((p) => (
                    <div key={p.id} className="col-12 col-md-6 col-lg-4">
                        <PostCard post={p} />
                    </div>
                ))}
            </div>

            {filtered.length === 0 && <p className="text-muted mt-3">표시할 게시글이 없습니다.</p>}
        </div>
    );
}
