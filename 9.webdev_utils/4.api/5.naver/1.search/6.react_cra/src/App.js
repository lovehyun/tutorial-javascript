import React, { useState } from 'react';

function App() {
    const [query, setQuery] = useState(''); // 검색어 상태
    const [results, setResults] = useState([]); // 검색 결과 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // 검색 처리
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return; // 검색어가 없을 때 처리
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const response = await fetch(`/search/blog?query=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.items) {
                setResults(data.items); // 검색 결과 저장
            } else {
                setResults([]);
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
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Enter search term"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ padding: '10px', width: '300px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '10px' }}>
                    Search
                </button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul style={{ listStyle: 'none', padding: '0' }}>
                {results.map((item, index) => (
                    <li
                        key={index}
                        style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}
                    >
                        <h2>
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                {item.title}
                            </a>
                        </h2>
                        <p>{item.description}</p>
                        <small>Post Date: {item.postdate}</small>
                    </li>
                ))}
            </ul>

            {results.length === 0 && !loading && !error && <p>No results found.</p>}
        </div>
    );
}

export default App;
