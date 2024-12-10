import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResult';

function App() {
    const [query, setQuery] = useState(''); // 검색어 상태
    const [results, setResults] = useState([]); // 검색 결과 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // 검색 처리 함수
    const handleSearch = async (query) => {
        setQuery(query); // 검색어 저장
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const response = await fetch(`/search/blog?query=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.items) {
                setResults(data.items); // 검색 결과 저장
            } else {
                setResults([]); // 검색 결과가 없으면 목록 초기화
            }
        } catch (err) {
            setError('Failed to fetch search results. Please try again.');
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
