import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(inputValue);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="input-group">
                <input
                    className="form-control"
                    type="text"
                    placeholder="검색어 입력"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={loading}
                />
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    );
}
