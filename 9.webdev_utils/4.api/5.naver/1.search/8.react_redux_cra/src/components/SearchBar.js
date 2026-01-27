import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setQuery, setLoading, setResults, setError } from '../redux/slices/searchSlice';

function SearchBar() {
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();

    const handleSearch = async (e) => {
        e.preventDefault();
        dispatch(setQuery(inputValue));
        dispatch(setLoading(true));
        dispatch(setResults([]));
        dispatch(setError(null));

        try {
            const response = await fetch(`/search/blog?query=${encodeURIComponent(inputValue)}`);
            const data = await response.json();
            dispatch(setResults(data.items || []));
        } catch (err) {
            dispatch(setError('Failed to fetch search results.'));
        } finally {
            dispatch(setLoading(false));
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
