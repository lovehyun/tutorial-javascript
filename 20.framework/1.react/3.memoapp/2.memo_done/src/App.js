import React, { useState } from 'react';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import './styles.css';

const App = () => {
    const [memos, setMemos] = useState([]);

    // 새로운 메모를 추가하는 함수
    const addMemo = (text) => {
        const newMemo = { id: Date.now(), text, completed: false }; // 'completed' 상태 추가
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
            <MemoForm onAddMemo={addMemo} />
            <MemoList
                memos={memos}
                onDeleteMemo={deleteMemo}
                onToggleComplete={toggleComplete} // 완료 상태 변경 함수 전달
                onEditMemo={editMemo}
            />
        </div>
    );
};

export default App;
