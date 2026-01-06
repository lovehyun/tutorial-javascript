import React, { useState, useEffect } from 'react';
import styles from '../../styles/MemoSearch.module.css';

const MemoSearch = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    return (
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className={styles['search-input']}
        />
    );
};

export default MemoSearch;
