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

    // Legacy for loop style
    // const editMemo = (id, newText) => {
    //     // 상태 불변성을 유지하기 위해 배열 복사
    //     const updatedMemos = [...memos]; // 앝은 복사 (원본을 참조함)
    //    
    //     // for 루프로 ID가 일치하는 메모를 찾아 수정
    //     for (let i = 0; i < updatedMemos.length; i++) {
    //         if (updatedMemos[i].id === id) {
    //             updatedMemos[i] = { ...updatedMemos[i], text: newText }; // 새 객체로 업데이트
    //             break; // 찾았으므로 루프 종료
    //         }
    //     }
    // 
    //     // 상태 업데이트
    //     setMemos(updatedMemos); // React가 상태변경을 감지
    // };

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
