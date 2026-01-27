import { useState } from 'react';

export default function App() {
    const [query, setQuery] = useState(''); // 검색어 상태
    const [results, setResults] = useState([]); // 검색 결과 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResults([]);

        // 사용자가 form을 submit 했을 때 트리거 되는 핸들러 형태라 useEffect없이 호출 가능
        // 최초 로딩시나 또는 query 에 따라서 자동으로 호출을 원하면 useEffect 사용 필요
        try {
            const res = await fetch(
                `/search/blog?query=${encodeURIComponent(query)}`
            );
            const data = await res.json();

            setResults(data.items || []);
        } catch (err) {
            console.error(err);
            setError('검색 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">Naver Blog Search</h1>

            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="d-flex mb-4 gap-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="검색어 입력"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    Search
                </button>
            </form>

            {/* 상태 메시지 */}
            {loading && <div className="alert alert-info">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* 결과 리스트 */}
            <ul className="list-group">
                {results.map((item, index) => (
                    <li key={index} className="list-group-item">
                        <h5 className="mb-1">
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                                dangerouslySetInnerHTML={{ __html: item.title }}
                            />
                        </h5>
                        <p
                            className="mb-1"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                        <small className="text-muted">
                            Post Date: {item.postdate}
                        </small>
                    </li>
                ))}
            </ul>

            {/* 결과 없음 */}
            {!loading && results.length === 0 && query && (
                <div className="text-muted mt-3 text-center">
                    검색 결과가 없습니다.
                </div>
            )}
        </div>
    );
}
