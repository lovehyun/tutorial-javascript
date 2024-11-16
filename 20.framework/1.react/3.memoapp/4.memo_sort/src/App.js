import React, { useState } from 'react';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import './styles.css';

const App = () => {
    const [memos, setMemos] = useState([]);
    const [sortOrder, setSortOrder] = useState('oldest'); // 기본값을 'oldest'로 설정

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

    // 메모 정렬 로직
    const sortedMemos = [...memos].sort((a, b) => {
        if (sortOrder === 'newest') {
            return b.id - a.id; // 작성 시간순 (최신 먼저)
        } else if (sortOrder === 'oldest') {
            return a.id - b.id; // 작성 시간순 (오래된 먼저)
        } else if (sortOrder === 'alphabetical') {
            return a.text.localeCompare(b.text); // 알파벳순
        }
        return 0;
    });

    return (
        <div className="app">
            <h1>Memo App</h1>
            {/* 정렬 선택 드롭다운 */}
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="sort-dropdown"
            >
                <option value="newest">최신순</option>
                <option value="oldest">오래된 순</option>
                <option value="alphabetical">알파벳순</option>
            </select>
            <MemoForm onAddMemo={addMemo} />
            <MemoList
                memos={sortedMemos} // 정렬된 메모 전달
                onDeleteMemo={deleteMemo}
                onToggleComplete={toggleComplete}
                onEditMemo={editMemo}
            />
        </div>
    );
};

export default App;
