export default function SearchResults({ query, results, loading, error }) {
    if (loading) {
        return <div className="alert alert-info">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mb-0">Error: {error}</div>;
    }

    if (query && results.length === 0) {
        return <div className="text-muted">No results found for "{query}".</div>;
    }

    if (!query) {
        return <div className="text-muted">검색어를 입력하고 Search를 눌러주세요.</div>;
    }

    return (
        <div className="list-group">
            {results.map((item, idx) => (
                <a
                    key={`${item.link}-${idx}`}
                    href={item.link}
                    className="list-group-item list-group-item-action"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                            {/* 네이버는 title/description에 <b> 태그가 섞여올 수 있음 */}
                            {/* XSS(스크립트 주입) 공격
                                <img src=x onerror=alert(1) />
                                <script>alert(1)</script>
                                <a href="javascript:alert(1)">click</a> 
                                "너 이거 진짜 안전한 거 맞아?" 라는 의미로 이름부터 dangerously입니다. React19에서도 여전히 유효함. */}
                            <h2 className="h6 mb-1 fw-bold text-dark" dangerouslySetInnerHTML={{ __html: item.title }} />
                            <p className="mb-1 text-muted" dangerouslySetInnerHTML={{ __html: item.description }} />
                            <small className="text-secondary">Post Date: {item.postdate}</small>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}
