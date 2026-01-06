import React, { useState, useEffect } from 'react';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import MemoSearch from './components/MemoSearchAdv';
import SortOptions from './components/SortOptions';
import './styles.css';

const App = () => {
    // const [memos, setMemos] = useState([]);
    const [memos, setMemos] = useState(() => {
        const savedMemos = localStorage.getItem('memos'); // 로컬 저장소에서 데이터 가져오기
        return savedMemos ? JSON.parse(savedMemos) : []; // 데이터가 있으면 파싱, 없으면 빈 배열
        // return savedMemos ? JSON.parse(savedMemos) : 
        //     [
        //         { id: 1, text: 'React 공부하기', completed: false },
        //         { id: 2, text: 'Redux 이해하기', completed: false },
        //         { id: 3, text: 'JavaScript 배우기', completed: false },
        //     ];
    });
    const [searchQuery, setSearchQuery] = useState(''); // 검색 상태 추가
    // const [sortOrder, setSortOrder] = useState('oldest'); // 기본값을 'oldest'로 설정
    // 로컬 저장소에서 정렬 상태 로드
    const [sortOrder, setSortOrder] = useState(() => {
        return localStorage.getItem('sortOrder') || 'oldest'; // 기본값 'oldest'
    });

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
        const newMemo = { id: Date.now(), text, completed: false }; // 'completed' 상태 추가
        setMemos([...memos, newMemo]);
    };

    // 특정 메모를 삭제하는 함수
    const deleteMemo = (id) => {
        setMemos(memos.filter((memo) => memo.id !== id));
    };

    // 메모 상태가 변경될 때 로컬 저장소에 저장
    useEffect(() => {
        localStorage.setItem('memos', JSON.stringify(memos)); // 메모 상태를 JSON 문자열로 저장
    }, [memos]); // memos가 변경될 때마다 실행
    
    // 정렬 상태가 변경될 때 로컬 저장소에 저장
    useEffect(() => {
        localStorage.setItem('sortOrder', sortOrder); // 정렬 상태 저장
    }, [sortOrder]);
    
    // 특정 메모의 내용을 수정하는 함수
    const editMemo = (id, newText) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, text: newText } : memo
            )
        );
    };

    // 특정 메모의 완료 상태를 토글하는 함수
    const toggleComplete = (id) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, completed: !memo.completed } : memo
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
                memos={filteredMemos} // 필터링된 메모만 전달
                onDeleteMemo={deleteMemo}
                onEditMemo={editMemo}
                onToggleComplete={toggleComplete} // 완료 상태 변경 함수 전달
            />
        </div>
    );
};

export default App;
