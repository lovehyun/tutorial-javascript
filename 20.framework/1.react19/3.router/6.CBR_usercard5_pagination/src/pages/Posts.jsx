import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPostsPage } from '../api/jsonplaceholder.js';
import PostCard from '../components/PostCard.jsx';
import { keepPreviousData } from '@tanstack/react-query';

export default function Posts() {
    const [q, setQ] = useState('');

    // ✅ 페이지네이션 상태
    const PAGE_SIZE = 12; // 카드뷰: 12개(3열이면 딱 보기 좋음)
    const [page, setPage] = useState(1);

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching, // 백그라운드 재요청 중 표시용
    } = useQuery({
        queryKey: ['posts', page, PAGE_SIZE],
        queryFn: () => fetchPostsPage(page, PAGE_SIZE),
        placeholderData: keepPreviousData, // ✅ 페이지 이동 시 깜빡임 줄임
    });

    const posts = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    // ✅ 검색은 "현재 페이지 내"에서만 필터링(간단 버전)
    // 전체 검색(모든 페이지 대상)까지 하려면 다른 전략이 필요합니다.
    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        if (!keyword) return posts;
        return posts.filter((p) => p.title.toLowerCase().includes(keyword) || p.body.toLowerCase().includes(keyword));
    }, [posts, q]);

    function goFirst() {
        setPage(1);
    }
    function goPrev() {
        setPage((p) => Math.max(1, p - 1));
    }
    function goNext() {
        setPage((p) => Math.min(totalPages, p + 1));
    }
    function goLast() {
        setPage(totalPages);
    }

    // ✅ 페이지 번호 5개 정도만 보여주기
    const pageNumbers = useMemo(() => {
        const windowSize = 5;
        const half = Math.floor(windowSize / 2);

        let start = Math.max(1, page - half);
        let end = Math.min(totalPages, start + windowSize - 1);
        start = Math.max(1, end - windowSize + 1);

        const arr = [];
        for (let i = start; i <= end; i++) arr.push(i);
        return arr;
    }, [page, totalPages]);

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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">Posts</h1>
                {/* 백그라운드 fetching 표시 */}
                {isFetching && <span className="text-muted small">업데이트 중...</span>}
            </div>

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="(현재 페이지 내) 제목 또는 본문 검색"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            <div className="text-muted mb-3">
                페이지 {page} / {totalPages} · 총 {total}개
            </div>

            {/* 카드 그리드 */}
            <div className="row g-3">
                {filtered.map((p) => (
                    <div key={p.id} className="col-12 col-md-6 col-lg-4">
                        <PostCard post={p} />
                    </div>
                ))}
            </div>

            {filtered.length === 0 && <p className="text-muted mt-3">표시할 게시글이 없습니다.</p>}

            {/* ✅ 페이지네이션 (Bootstrap) */}
            <nav className="mt-4" aria-label="Posts pagination">
                <ul className="pagination justify-content-center flex-wrap">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goFirst}>
                            &laquo;
                        </button>
                    </li>

                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goPrev}>
                            &lsaquo;
                        </button>
                    </li>

                    {pageNumbers.map((n) => (
                        <li key={n} className={`page-item ${n === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(n)}>
                                {n}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goNext}>
                            &rsaquo;
                        </button>
                    </li>

                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goLast}>
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
