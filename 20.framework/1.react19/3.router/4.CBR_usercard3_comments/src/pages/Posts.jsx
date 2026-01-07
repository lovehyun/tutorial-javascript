import { useEffect, useMemo, useState } from 'react';
import PostCard from '../components/PostCard.jsx';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState('');

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                sessionStorage.setItem('posts_cache', JSON.stringify(data));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        if (!keyword) return posts;
        return posts.filter((p) => p.title.toLowerCase().includes(keyword) || p.body.toLowerCase().includes(keyword));
    }, [posts, q]);

    if (loading) return <p>로딩 중...</p>;

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
