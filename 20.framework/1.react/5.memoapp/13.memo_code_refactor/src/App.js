import React, { useState, useEffect } from 'react';
import MemoList from './components/Memo/MemoList';
import MemoForm from './components/Memo/MemoForm';
import MemoSearch from './components/Memo/MemoSearch';
import SortOptions from './components/SortOptions';
import MemoDetail from './components/Memo/MemoDetail';
import useIndexedDB from './hooks/useIndexedDB';

import './styles/common.css';

const App = () => {
    const { deleteAttachmentsByMemoId } = useIndexedDB();

    // 상태 관리
    const [memos, setMemos] = useState(() => {
        const savedMemos = localStorage.getItem('memos');
        return savedMemos ? JSON.parse(savedMemos) : [];
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState(() => {
        return localStorage.getItem('sortOrder') || 'manual';
    });

    const [selectedMemo, setSelectedMemo] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // 정렬된 메모 목록
    const sortedMemos = [...memos].sort((a, b) => {
        if (sortOrder === 'newest') return b.id - a.id;
        if (sortOrder === 'oldest') return a.id - b.id;
        if (sortOrder === 'alphabetical') return a.text.localeCompare(b.text);
        return 0;
    });

    // 검색어로 필터링된 메모 목록
    const filteredMemos = sortedMemos.filter((memo) =>
        memo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 메모 순서 변경
    const reorderMemos = (startIndex, endIndex) => {
        setSortOrder('manual');
        const updatedMemos = Array.from(memos);
        const [removed] = updatedMemos.splice(startIndex, 1);
        updatedMemos.splice(endIndex, 0, removed);
        setMemos(updatedMemos);
    };

    // 새로운 메모 추가
    const addMemo = (text) => {
        const newMemo = { id: Date.now(), text, completed: false };
        setMemos([...memos, newMemo]);
    };

    // 메모 삭제
    const deleteMemo = async (id) => {
        await deleteAttachmentsByMemoId(id);
        setMemos(memos.filter((memo) => memo.id !== id));
    };

    // 메모 수정
    const editMemo = (id, newText, newDetail, newAttachments) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id
                    ? {
                          ...memo,
                          text: newText ?? memo.text,
                          detail: newDetail ?? memo.detail,
                          attachments: newAttachments ?? memo.attachments,
                      }
                    : memo
            )
        );
    };

    // 완료 상태 토글
    const toggleComplete = (id) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, completed: !memo.completed } : memo
            )
        );
    };

    // 상세 보기 열기
    const openMemoDetail = (id) => {
        const memo = memos.find((m) => m.id === id);
        setSelectedMemo(memo);
        setIsDetailOpen(true);
    };

    // 상세 보기 닫기
    const closeMemoDetail = () => {
        setSelectedMemo(null);
        setIsDetailOpen(false);
    };

    // 상세 보기 저장
    const saveMemoDetail = (id, newText, newDetail, newAttachments) => {
        editMemo(id, newText, newDetail, newAttachments);
        closeMemoDetail();
    };

    // 메모 상태를 로컬 스토리지에 저장
    useEffect(() => {
        localStorage.setItem('memos', JSON.stringify(memos));
    }, [memos]);

    // 정렬 상태를 로컬 스토리지에 저장
    useEffect(() => {
        localStorage.setItem('sortOrder', sortOrder);
    }, [sortOrder]);

    // 컴포넌트 렌더링
    return (
        <div className="app">
            <h1>Memo App</h1>
            <div className="search-and-sort-container">
                <MemoSearch onSearch={setSearchQuery} />
                <SortOptions sortOrder={sortOrder} onSortChange={setSortOrder} />
            </div>
            <MemoForm onAddMemo={addMemo} />
            <MemoList
                memos={filteredMemos}
                onDeleteMemo={deleteMemo}
                onEditMemo={editMemo}
                onToggleComplete={toggleComplete}
                onReorderMemos={reorderMemos}
                onOpenDetail={openMemoDetail}
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
