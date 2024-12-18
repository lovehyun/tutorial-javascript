import React from 'react';

const SearchBar = ({ query, onInputChange, onSearch }) => (
    <div style={{ marginBottom: '20px' }}>
        <input
            type="text"
            value={query}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Search YouTube videos..."
            style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
        <button onClick={onSearch} style={{ padding: '10px', marginLeft: '10px', fontSize: '16px' }}>
            Search
        </button>
    </div>
);

export default SearchBar;
