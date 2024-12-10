import React, { useState } from 'react';
import { useSearch } from '../context/SearchContext';

function SearchBar() {
    const [inputValue, setInputValue] = useState('');
    const { dispatch } = useSearch();

    const handleSearch = async (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_QUERY', payload: inputValue });
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_RESULTS', payload: [] });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await fetch(`/search/blog?query=${encodeURIComponent(inputValue)}`);
            const data = await response.json();
            dispatch({ type: 'SET_RESULTS', payload: data.items || [] });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch search results.' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Enter search term"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
}

export default SearchBar;
