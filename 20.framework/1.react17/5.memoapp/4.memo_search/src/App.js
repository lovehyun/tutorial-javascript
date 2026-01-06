import React, { useState } from 'react';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import MemoSearch from './components/MemoSearch';
// import MemoSearch from './components/MemoSearchAdv';
import './styles.css';

const App = () => {
    // const [memos, setMemos] = useState([]);
    const [memos, setMemos] = useState([
        { id: 1, text: 'React 공부하기', completed: false },
        { id: 2, text: 'Redux 이해하기', completed: false },
        { id: 3, text: 'JavaScript 배우기', completed: false },
    ]);
    const [searchQuery, setSearchQuery] = useState(''); // 검색 상태 추가

    // 검색어에 따라 메모 필터링
    // App 컴포넌트가 렌더링될 때마다 실행됩니다. 렌더링은 React의 상태(state)나 속성(props)이 변경되면 트리거됩니다.
    const filteredMemos = memos.filter((memo) =>
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
            <MemoSearch onSearch={(query) => setSearchQuery(query)} />
            <MemoForm onAddMemo={addMemo} />
            <MemoList
                memos={filteredMemos} // 필터링된 메모만 전달
                onDeleteMemo={deleteMemo}
                onEditMemo={editMemo}
                onToggleComplete={toggleComplete}
            />
        </div>
    );
};

export default App;
