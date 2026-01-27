import React from 'react';
import { useSelector } from 'react-redux';

function SearchResults() {
    const { query, results, loading, error } = useSelector((state) => state.search);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (results.length === 0 && query) return <p>No results found for "{query}".</p>;

    return (
        <ul>
            {results.map((item, index) => (
                <li key={index}>
                    <h2>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title}
                        </a>
                    </h2>
                    <p>{item.description}</p>
                </li>
            ))}
        </ul>
    );
}

export default SearchResults;
