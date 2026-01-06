import React, { useState, useEffect } from 'react';

const MemoSearch = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query); // 입력이 멈춘 뒤에 debouncedQuery 업데이트
        }, 500); // 500ms 후에 실행

        return () => {
            clearTimeout(handler); // 새로운 입력이 발생하면 이전 타이머를 취소하여 불필요한 작업 방지
        };
    }, [query]); // query가 변경될 때만 실행

    useEffect(() => {
        onSearch(debouncedQuery); // 디바운싱된 검색어를 부모로 전달
    }, [debouncedQuery, onSearch]);

    const handleSearch = (e) => {
        setQuery(e.target.value); // 실시간 입력값 업데이트
    };

    return (
        <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="검색어를 입력하세요"
            className="search-input"
        />
    );
};

export default MemoSearch;
