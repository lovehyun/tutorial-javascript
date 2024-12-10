import React, { useState } from 'react';
import './SearchForm.css';

const SearchForm = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (type) => {
        if (!query) {
            alert('검색어를 입력하세요.');
            return;
        }
        onSearch(query, type);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
            }}
            className="search-form"
        >
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />
            <button type="button" onClick={() => handleSearch('web')} className="search-button">
                웹검색
            </button>
            <button type="button" onClick={() => handleSearch('image')} className="search-button">
                이미지검색
            </button>
            <button type="button" onClick={() => handleSearch('vclip')} className="search-button">
                비디오검색
            </button>
        </form>
    );
};

export default SearchForm;
