import React, { useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import SearchResults from './components/SearchResult.jsx';
import { fetchNaverBlogSearch } from './api/naverBlogApi.js';

function App() {
    const [query, setQuery] = useState(''); // 검색어 상태
    const [results, setResults] = useState([]); // 검색 결과 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // 검색 처리 함수
    const handleSearch = async (nextQuery) => { // 이때 query는 아직 상태에 반영이 안된 query 라서 nextQuery 라고 보통 정함
                                                // SearchBar에서 막 입력해서 전달된 값
                                                // 아직 state에 반영되지 않음
                                                // 다음(next)에 반영될 값

        setQuery(nextQuery); // 검색어 저장: nextQuery → query(state)
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            // const response = await fetch(`/search/blog?query=${encodeURIComponent(query)}`);
            // const data = await response.json();

            const data = await fetchNaverBlogSearch({ query: query, page: 1, display: 10 });
            if (data.items) {
                setResults(data.items); // 검색 결과 저장
            } else {
                setResults([]); // 검색 결과가 없으면 목록 초기화
            }
        } catch (err) {
            setError('Failed to fetch search results. Please try again. Error: ', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Blog Search</h1>
            <SearchBar onSearch={handleSearch} />
            <SearchResults query={query} results={results} loading={loading} error={error} />
        </div>
    );
}

export default App;
