import { useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { listPosts } from '../api/boardApi.js';
import PostCard from '../components/PostCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { Link } from 'react-router-dom';

export default function PostList() {
    const [qInput, setQInput] = useState('');
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 9;

    const { data, isLoading, isError, error, isFetching } = useQuery({
        queryKey: ['posts', { page, pageSize, q }],
        queryFn: () => listPosts({ page, pageSize, q }),
        placeholderData: keepPreviousData,
    });

    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const headerText = useMemo(() => {
        if (!q) return `총 ${total}개`;
        return `검색 "${q}" · ${total}개`;
    }, [q, total]);

    function onSearch(e) {
        e.preventDefault();
        setPage(1);
        setQ(qInput.trim());
    }

    if (isLoading) return <p className="text-muted">로딩 중...</p>;
    if (isError) {
        return (
            <div className="alert alert-danger" role="alert">
                목록 로드 실패: {error?.message}
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">Posts</h1>
                <Link className="btn btn-primary" to="/posts/new">
                    글쓰기
                </Link>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="text-muted">{headerText}</div>
                {isFetching && <div className="text-muted small">업데이트 중...</div>}
            </div>

            <form className="row g-2 mb-3" onSubmit={onSearch}>
                <div className="col-12 col-md-9">
                    <input
                        className="form-control"
                        placeholder="제목/작성자/본문 검색"
                        value={qInput}
                        onChange={(e) => setQInput(e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-3 d-grid">
                    <button className="btn btn-outline-secondary" type="submit">
                        검색
                    </button>
                </div>
            </form>

            <div className="row g-3">
                {items.map((post) => (
                    <div key={post.id} className="col-12 col-md-6 col-lg-4">
                        <PostCard post={post} />
                    </div>
                ))}
            </div>

            {items.length === 0 && <p className="text-muted mt-3">게시글이 없습니다.</p>}

            <div className="mt-4">
                <Pagination page={data.page} totalPages={totalPages} onPageChange={setPage} />
            </div>
        </div>
    );
}
