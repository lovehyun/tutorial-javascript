import React, { useState } from 'react';

function SearchBar({ onSearch }) {
    const [inputValue, setInputValue] = useState(''); // 입력 상태 관리

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSearch(inputValue); // 부모로 검색어 전달
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Enter search term"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ padding: '10px', width: '300px', marginRight: '10px' }}
            />
            <button type="submit" style={{ padding: '10px' }}>
                Search
            </button>
        </form>
    );
}

export default SearchBar;
