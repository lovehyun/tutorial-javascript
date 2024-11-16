import React, { useState, useEffect } from 'react';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import './styles.css';

const App = () => {
    // 초기 메모 상태를 로컬 저장소에서 불러오거나 빈 배열로 설정
    const [memos, setMemos] = useState(() => {
        const savedMemos = localStorage.getItem('memos'); // 로컬 저장소에서 데이터 가져오기
        return savedMemos ? JSON.parse(savedMemos) : []; // 데이터가 있으면 파싱, 없으면 빈 배열
    });

    const [sortOrder, setSortOrder] = useState('oldest'); // 기본 정렬 기준

    // 메모 상태가 변경될 때 로컬 저장소에 저장
    useEffect(() => {
        localStorage.setItem('memos', JSON.stringify(memos)); // 메모 상태를 JSON 문자열로 저장
    }, [memos]); // memos가 변경될 때마다 실행

    const addMemo = (text) => {
        const newMemo = { id: Date.now(), text, completed: false };
        setMemos([...memos, newMemo]);
    };

    const deleteMemo = (id) => {
        setMemos(memos.filter((memo) => memo.id !== id));
    };

    const toggleComplete = (id) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, completed: !memo.completed } : memo
            )
        );
    };

    const editMemo = (id, newText) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, text: newText } : memo
            )
        );
    };

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

    return (
        <div className="app">
            <h1>Memo App</h1>
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
                memos={sortedMemos}
                onDeleteMemo={deleteMemo}
                onToggleComplete={toggleComplete}
                onEditMemo={editMemo}
            />
        </div>
    );
};

export default App;
