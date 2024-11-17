import React from 'react';

const MemoHeader = ({ isDarkMode, toggleDarkMode, sortOrder, setSortOrder }) => {
    return (
        <header className="header">
            <h1>Memo App</h1>
            <div className="header-controls">
                {/* 다크 모드 토글 버튼 */}
                <button onClick={toggleDarkMode} className="theme-toggle">
                    {isDarkMode ? '라이트 모드' : '다크 모드'}
                </button>
                {/* 정렬 드롭다운 */}
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-dropdown"
                >
                    <option value="newest">최신순</option>
                    <option value="oldest">오래된 순</option>
                    <option value="alphabetical">알파벳순</option>
                    <option value="manual">수동 정렬</option>
                </select>
            </div>
        </header>
    );
};

export default MemoHeader;
