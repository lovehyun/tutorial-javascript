// CBR 5단계(라우터 loader 버전)
// - posts 데이터 로딩은 router.jsx의 loader가 담당합니다.
// - 이 컴포넌트는 "페이지네이션(UI/상태)"에만 집중합니다.

import { useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

const PAGE_SIZE = 20;

export default function Posts() {
    // router loader가 반환한 posts(100개)를 받는다.
    const posts = useLoaderData();

    // 페이지 상태만 컴포넌트가 관리 (클라이언트 사이드 페이지네이션)
    const [page, setPage] = useState(1);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
    }, [posts.length]);

    const visible = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return posts.slice(start, start + PAGE_SIZE);
    }, [posts, page]);

    return (
        <div>
            <h1>Posts</h1>

            <p style={{ color: '#666' }}>
                전체 {posts.length}개 / 페이지 {page} / {totalPages}
            </p>

            {/* li 기본 bullet 유지 */}
            <ul>
                {visible.map((p) => (
                    <li key={p.id}>
                        <Link to={`/posts/${p.id}`}>{p.title}</Link>
                    </li>
                ))}
            </ul>

            {/* 페이지네이션(클라이언트 slice) */}
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
                            style={{ fontWeight: isActive ? '700' : '400' }}
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
