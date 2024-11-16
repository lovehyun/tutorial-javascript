import React, { useState } from 'react';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import './styles.css';

const App = () => {
    const [memos, setMemos] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // 검색 키워드 상태 추가

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

    // 검색어에 따라 메모 필터링
    const filteredMemos = memos.filter((memo) =>
        memo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="app">
            <h1>Memo App</h1>
            <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
                className="search-bar"
            />
            <MemoForm onAddMemo={addMemo} />
            <MemoList
                memos={filteredMemos} // 필터링된 메모만 전달
                onDeleteMemo={deleteMemo}
                onToggleComplete={toggleComplete}
                onEditMemo={editMemo}
            />
        </div>
    );
};

export default App;
