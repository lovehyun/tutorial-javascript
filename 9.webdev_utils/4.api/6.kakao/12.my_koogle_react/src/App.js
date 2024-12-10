import React, { useState } from 'react';
import './App.css';

const App = () => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('');
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchResults = async (query, type, page) => {
        try {
            const response = await fetch(`/api/search2?query=${encodeURIComponent(query)}&type=${type}&page=${page}`);
            if (!response.ok) throw new Error('Failed to fetch results');

            const data = await response.json();
            setResults(data.documents || []);
            setTotalPages(Math.ceil(data.meta.pageable_count / 10));
            setCurrentPage(page);
        } catch (error) {
            console.error(error.message);
            alert('검색에 실패했습니다.');
        }
    };

    const handleSearch = (type) => {
        if (!query) {
            alert('검색어를 입력하세요.');
            return;
        }
        setType(type);
        setCurrentPage(1);
        fetchResults(query, type, 1);
    };

    return (
        <div className="App">
            <h1>Kooooogle</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(type);
                }}
            >
                <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <button type="button" onClick={() => handleSearch('web')}>
                    웹검색
                </button>
                <button type="button" onClick={() => handleSearch('image')}>
                    이미지검색
                </button>
                <button type="button" onClick={() => handleSearch('vclip')}>
                    비디오검색
                </button>
            </form>
            <Results type={type} results={results} />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchResults(query, type, page)}
            />
        </div>
    );
};

const Results = ({ type, results }) => {
    if (!results || results.length === 0) {
        return <div id="results">No results found.</div>;
    }

    return (
        <div id="results">
            {results.map((item, index) => (
                <div className="result" key={index}>
                    {type === 'web' && (
                        <>
                            <h3>{item.title}</h3>
                            <p>{item.contents}</p>
                            <a href={item.url} target="_blank" rel="noreferrer">
                                {item.url}
                            </a>
                        </>
                    )}
                    {type === 'image' && (
                        <>
                            <img src={item.thumbnail_url} alt="Thumbnail" />
                            <p>{item.display_sitename}</p>
                            <a href={item.doc_url} target="_blank" rel="noreferrer">
                                {item.doc_url}
                            </a>
                            <p>
                                Width: {item.width}, Height: {item.height}
                            </p>
                            <p>Datetime: {item.datetime}</p>
                        </>
                    )}
                    {type === 'vclip' && (
                        <>
                            <h3>{item.title}</h3>
                            <p>Author: {item.author}</p>
                            <a href={item.url} target="_blank" rel="noreferrer">
                                {item.url}
                            </a>
                            <p>Play Time: {item.play_time} seconds</p>
                            <img src={item.thumbnail} alt="Thumbnail" />
                            <p>Datetime: {item.datetime}</p>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination">
            <button
                id="prevButton"
                style={{ display: currentPage > 1 ? 'inline' : 'none' }}
                onClick={() => onPageChange(currentPage - 1)}
            >
                PREV
            </button>
            <span id="currentPageInfo" className="current-page">
                현재 페이지: {currentPage}
            </span>
            <button
                id="nextButton"
                style={{ display: currentPage < totalPages ? 'inline' : 'none' }}
                onClick={() => onPageChange(currentPage + 1)}
            >
                NEXT
            </button>
        </div>
    );
};

export default App;
