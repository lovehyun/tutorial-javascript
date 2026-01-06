import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../../store/memoSlice';
import styles from '../../styles/MemoSearch.module.css';

const MemoSearch = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch(setSearchQuery(query));
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
