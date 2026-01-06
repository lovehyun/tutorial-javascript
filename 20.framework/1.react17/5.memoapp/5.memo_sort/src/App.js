import React, { useState } from 'react';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import MemoSearch from './components/MemoSearchAdv';
import SortOptions from './components/SortOptions';
import './styles.css';

const App = () => {
    // const [memos, setMemos] = useState([]);
    const [memos, setMemos] = useState([
        { id: 1, text: 'React 공부하기', completed: false },
        { id: 2, text: 'Redux 이해하기', completed: false },
        { id: 3, text: 'JavaScript 배우기', completed: false },
    ]);
    const [searchQuery, setSearchQuery] = useState(''); // 검색 상태 추가
    const [sortOrder, setSortOrder] = useState('oldest'); // 기본값을 'oldest'로 설정

    // 정렬된 메모
    const sortedMemos = [...memos].sort((a, b) => {
        if (sortOrder === 'newest') {
            return b.id - a.id;
        } else if (sortOrder === 'oldest') {
            return a.id - b.id;
        } else if (sortOrder === 'alphabetical') {
            return a.text.localeCompare(b.text);
        }
        return 0;
    });
    
    // 검색어에 따라 메모 필터링
    const filteredMemos = sortedMemos.filter((memo) =>
        memo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // 새로운 메모를 추가하는 함수
    const addMemo = (text) => {
        const newMemo = { id: Date.now(), text, completed: false };
        setMemos([...memos, newMemo]);
    };

    // 특정 메모를 삭제하는 함수
    const deleteMemo = (id) => {
        setMemos(memos.filter((memo) => memo.id !== id));
    };

    // 특정 메모의 완료 상태를 토글하는 함수
    const toggleComplete = (id) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, completed: !memo.completed } : memo
            )
        );
    };

    // 특정 메모의 내용을 수정하는 함수
    const editMemo = (id, newText) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, text: newText } : memo
            )
        );
    };

    return (
        <div className="app">
            <h1>Memo App</h1>
            {/* 검색창과 정렬 옵션을 담는 컨테이너 */}
            <div className="search-and-sort-container">
                <MemoSearch onSearch={setSearchQuery} />
                <SortOptions sortOrder={sortOrder} onSortChange={setSortOrder} />
            </div>
            <MemoForm onAddMemo={addMemo} />
            <MemoList
                // memos={sortedMemos} // 정렬된 메모 전달
                memos={filteredMemos} // 정렬 필터된 메모 전달
                onDeleteMemo={deleteMemo}
                onEditMemo={editMemo}
                onToggleComplete={toggleComplete}
            />
        </div>
    );
};

export default App;
