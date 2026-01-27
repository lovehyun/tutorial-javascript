import React, { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar.jsx';
import SearchResults from './components/SearchResult.jsx';
import { fetchNaverBlogSearch } from './api/naverBlogApi.js';

function App() {
    const [query, setQuery] = useState(''); // 검색어 상태
    const [results, setResults] = useState([]); // 검색 결과 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // 검색 처리 함수 - "함수의 주소(참조)"를 고정해서 불필요한 리렌더링을 줄이려고
    // React에서 함수는 렌더링마다 새로 만들어집니다.
    // const handleSearch = (q) => { ... }
    // 이건 렌더링할 때마다 새 함수 객체가 됩니다.
    // 그럼 자식 컴포넌트(SearchBar)에 props로 내려갈 때:
    // 이전 렌더의 onSearch와 이번 렌더의 onSearch가
    // 서로 다른 함수라서 props가 바뀐 것으로 취급됩니다.
    const handleSearch = useCallback(async (nextQuery) => {
        const q = nextQuery.trim();
        if (!q) return;

        setQuery(q);
        setLoading(true);
        setError('');
        setResults([]);

        try {
            const data = await fetchNaverBlogSearch({ query: q, page: 1, display: 10 });
            setResults(Array.isArray(data.items) ? data.items : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch search results.');
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Blog Search</h1>
            <SearchBar onSearch={handleSearch} />
            <SearchResults query={query} results={results} loading={loading} error={error} />
        </div>
    );
}

export default App;
