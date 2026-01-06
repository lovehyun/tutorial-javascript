import React, { useState, useEffect } from 'react';
import { useMemoContext } from '../../context/MemoProvider';
import styles from '../../styles/MemoSearch.module.css';

const MemoSearch = () => {
    const [query, setQuery] = useState('');
    const { dispatch } = useMemoContext();

    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
        }, 500);

        return () => clearTimeout(handler);
    }, [query, dispatch]);

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
