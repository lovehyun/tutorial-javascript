// BR 5단계
// - posts 100개를 "한 번만" 로딩
// - 화면에는 20개씩만 보여주고(클라이언트 slice)
// - 총 5페이지(Prev/Next + 1~5 버튼)로 이동

import { useEffect, useMemo, useState } from 'react';
import { fetchPosts } from '../api/usersApi.js';

const PAGE_SIZE = 20;

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1); // 1~5
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setErrorMsg('');

        fetchPosts({ signal: controller.signal })
            .then((data) => {
                setPosts(data); // 100개
                setLoading(false);
            })
            .catch((err) => {
                // fetch 취소는 에러로 취급하지 않음
                if (err.name === 'AbortError') return;

                setErrorMsg(err.message || 'Posts를 불러오지 못했습니다.');
                setLoading(false);
            });

        // 다른 페이지로 이동/언마운트 시 fetch 취소
        return () => controller.abort();
    }, []);

    // useMemo 없이 계산하면 랜더마다 실행됨
    // const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
    // const start = (page - 1) * PAGE_SIZE;
    // const visible = posts.slice(start, start + PAGE_SIZE);
    
    // 총 페이지 수 = 100/20 = 5
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
    }, [posts.length]);

    // posts가 로딩된 뒤, page가 범위를 벗어나는 경우 보정
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    // 현재 페이지에 보여줄 20개
    const visible = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return posts.slice(start, start + PAGE_SIZE);
    }, [posts, page]);

    if (loading) return <p>로딩 중...</p>;

    if (errorMsg) {
        return (
            <div>
                <h1>Posts</h1>
                <p style={{ color: 'crimson' }}>{errorMsg}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Posts</h1>

            <p style={{ color: '#666' }}>
                전체 {posts.length}개 / 페이지 {page} / {totalPages}
            </p>

            {/* li 기본 bullet 유지 */}
            <ul>
                {visible.map((p) => (
                    <li key={p.id}>{p.title}</li>
                ))}
            </ul>

            {/* 페이지네이션(클라이언트 사이드) */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
                <button onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={page === 1}>
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => {
                    const n = i + 1;
                    const isActive = n === page;

                    return (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            aria-current={isActive ? 'page' : undefined}
                            style={{
                                fontWeight: isActive ? '700' : '400',
                            }}
                        >
                            {n}
                        </button>
                    );
                })}

                <button
                    onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
