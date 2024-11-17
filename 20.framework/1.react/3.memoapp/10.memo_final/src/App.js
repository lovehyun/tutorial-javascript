import React, { useState, useEffect } from 'react';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import MemoDetail from './components/MemoDetail'; // 상세보기 컴포넌트 추가
import { deleteAttachmentsByMemoId } from './utils/indexedDB';
import './styles.css';

const App = () => {
    const [memos, setMemos] = useState(() => {
        const savedMemos = localStorage.getItem('memos');
        return savedMemos ? JSON.parse(savedMemos) : [];
    });

    const [sortOrder, setSortOrder] = useState('oldest');
    const [dragged, setDragged] = useState(null); // 드래그 앤 드롭 발생 여부

    const [selectedMemo, setSelectedMemo] = useState(null); // 선택된 메모
    const [isDetailOpen, setIsDetailOpen] = useState(false); // 상세보기 열림 여부

    const [isDarkMode, setIsDarkMode] = useState(() => {
        // 로컬 스토리지에서 저장된 테마 상태를 가져오기
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        // 다크 모드 상태에 따라 HTML의 클래스 변경
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (dragged !== null) {
            // 드래그가 발생했을 때만 실행
            setSortOrder('manual'); // 수동 정렬 모드로 변경
            setMemos(dragged); // 업데이트된 메모 배열 반영
            setDragged(null); // 드래그 상태 초기화
        }
    }, [dragged]); // dragged가 변경될 때 실행
    
    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };
    
    useEffect(() => {
        localStorage.setItem('memos', JSON.stringify(memos));
    }, [memos]);

    const addMemo = (text) => {
        const newMemo = { id: Date.now(), text, completed: false };
        console.log("추가된 메모:", newMemo); // 디버깅 코드
        setMemos([...memos, newMemo]);
    };

    const deleteMemo = async (id) => {
        console.log("삭제된 메모 ID:", id); // 디버깅 코드
        await deleteAttachmentsByMemoId(id); // 첨부 파일 삭제
        setMemos(memos.filter((memo) => memo.id !== id));
    };

    const toggleComplete = (id) => {
        console.log("완료 상태 토글 ID:", id); // 디버깅 코드
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, completed: !memo.completed } : memo
            )
        );
    };

    const editMemo = (id, newText, newDetail, newAttachments) => {
        console.log("수정된 메모 ID:", id, "새 텍스트:", newText); // 디버깅 코드
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, text: newText, detail: newDetail, attachments: newAttachments } : memo
            )
        );
    };

    const reorderMemos = (startIndex, endIndex) => {
        console.log("드래그 시작 인덱스:", startIndex, "드롭 위치 인덱스:", endIndex); // 디버깅 코드
        // 1. 먼저 수동 정렬 모드로 전환
        setSortOrder('manual');

        // 2. 이후 상태 업데이트
        setMemos((prevMemos) => {
            const updatedMemos = Array.from(prevMemos);
            const [removed] = updatedMemos.splice(startIndex, 1);
            updatedMemos.splice(endIndex, 0, removed);
            return updatedMemos;
        });
    };

    const openMemoDetail = (id) => {
        const memo = memos.find((m) => m.id === id);
        setSelectedMemo(memo);
        setIsDetailOpen(true);
    };

    const closeMemoDetail = () => {
        setSelectedMemo(null);
        setIsDetailOpen(false);
    };

    const saveMemoDetail = (id, newText, newDetail, newAttachments) => {
        editMemo(id, newText, newDetail, newAttachments);
        closeMemoDetail();
    };

    const sortedMemos = (() => {
        if (sortOrder === 'manual') {
            return memos; // 수동 모드는 현재 배열 상태 유지
        } else if (sortOrder === 'newest') {
            return [...memos].sort((a, b) => b.id - a.id);
        } else if (sortOrder === 'oldest') {
            return [...memos].sort((a, b) => a.id - b.id);
        } else if (sortOrder === 'alphabetical') {
            return [...memos].sort((a, b) => a.text.localeCompare(b.text));
        }
        return memos;
    })();

    return (
        <div className="app">
            <header className="header">
                <h1>Memo App</h1>
                <button onClick={toggleDarkMode} className="theme-toggle">
                    {isDarkMode ? '라이트 모드' : '다크 모드'}
                </button>
            </header>
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
            <MemoForm onAddMemo={addMemo} />
            <MemoList
                memos={sortedMemos}
                onDeleteMemo={deleteMemo}
                onToggleComplete={toggleComplete}
                onEditMemo={editMemo}
                onReorderMemos={reorderMemos}
                onOpenDetail={openMemoDetail} // 상세보기 열기 함수 전달
            />
            {isDetailOpen && selectedMemo && (
                <MemoDetail
                    memo={selectedMemo}
                    onSave={saveMemoDetail}
                    onClose={closeMemoDetail}
                />
            )}
        </div>
    );
};

export default App;
