import React, { useState } from 'react';

const MemoSearch = ({ onSearch }) => {
    // const [query, setQuery] = useState(''); // 검색어 상태 관리

    // const handleSearch = (e) => {
    //     const value = e.target.value;
    //     setQuery(value);
    //     onSearch(value); // 부모 컴포넌트로 검색어 전달
    // };

    const handleSearch = (e) => {
        onSearch(e.target.value); // 입력 값이 변경될 때 바로 부모로 전달
    };

    return (
        <div className="form-search">
            <input
                type="text"
                // value={query}
                onChange={handleSearch}
                placeholder="검색어를 입력하세요"
                className="search-input"
            />
        </div>
    );
};

export default MemoSearch;
