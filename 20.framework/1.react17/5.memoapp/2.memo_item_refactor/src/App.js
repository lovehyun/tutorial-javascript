import React, { useState } from 'react';
import MemoList from './components/MemoList'; // 메모 목록을 표시하는 컴포넌트
import MemoForm from './components/MemoForm'; // 새로운 메모를 추가하는 폼 컴포넌트
import './styles.css'; // 스타일 파일

// 메모 앱의 메인 컴포넌트
const App = () => {
    // 메모 데이터를 관리하는 상태
    const [memos, setMemos] = useState([]);

    // 새로운 메모를 추가하는 함수
    const addMemo = (text) => {
        const newMemo = { id: Date.now(), text }; // 고유 ID와 텍스트로 새 메모 생성
        setMemos([...memos, newMemo]); // 기존 메모 배열에 새 메모 추가
    };

    // 특정 메모를 삭제하는 함수
    const deleteMemo = (id) => {
        setMemos(memos.filter((memo) => memo.id !== id)); // ID가 일치하지 않는 메모들만 유지
    };

    // 특정 메모의 내용을 수정하는 함수
    const editMemo = (id, newText) => {
        setMemos(
            memos.map((memo) => 
                memo.id === id ? { ...memo, text: newText } : memo // ID가 일치하면 텍스트 수정
            )
        );
    };

    // 컴포넌트 렌더링
    return (
        <div className="app">
            <h1>Memo App</h1> {/* 제목 */}
            <MemoForm onAddMemo={addMemo} /> {/* 메모 추가 폼 */}
            <MemoList 
                memos={memos} 
                onDeleteMemo={deleteMemo} 
                onEditMemo={editMemo} 
            /> {/* 메모 목록 */}
        </div>
    );
};

export default App; // 컴포넌트 내보내기
