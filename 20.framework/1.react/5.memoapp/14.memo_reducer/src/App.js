import React from 'react';
import MemoList from './components/Memo/MemoList';
import MemoForm from './components/Memo/MemoForm';
import MemoSearch from './components/Memo/MemoSearch';
import SortOptions from './components/SortOptions';
import MemoDetail from './components/Memo/MemoDetail';
import { MemoProvider, useMemoContext } from './context/MemoProvider';

import './styles/common.css';

const AppContent = () => {
    const { state, dispatch } = useMemoContext();

    // 정렬된 메모 리스트
    const sortedMemos = [...state.memos].sort((a, b) => {
        if (state.sortOrder === 'newest') return b.id - a.id;
        if (state.sortOrder === 'oldest') return a.id - b.id;
        if (state.sortOrder === 'alphabetical') return a.text.localeCompare(b.text);
        return 0;
    });

    // 검색어에 따른 필터링
    const filteredMemos = sortedMemos.filter((memo) =>
        memo.text.toLowerCase().includes(state.searchQuery.toLowerCase())
    );

    // 메모 추가
    const addMemo = (text) => {
        const newMemo = { id: Date.now(), text, completed: false };
        dispatch({ type: 'ADD_MEMO', payload: newMemo });
    };

    // 메모 삭제
    const deleteMemo = (id) => {
        dispatch({ type: 'DELETE_MEMO', payload: id });
    };

    // 메모 수정
    const editMemo = (id, data) => {
        dispatch({ type: 'EDIT_MEMO', payload: { id, data } });
    };

    // 완료 상태 토글
    const toggleComplete = (id) => {
        dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
    };

    // 상세보기 열기
    const openMemoDetail = (id) => {
        const memo = state.memos.find((m) => m.id === id);
        dispatch({ type: 'SET_SELECTED_MEMO', payload: memo });
    };

    // 상세보기 닫기
    const closeMemoDetail = () => {
        dispatch({ type: 'CLOSE_DETAIL' });
    };

    return (
        <div className="app">
            <h1>Memo App</h1>
            <div className="search-and-sort-container">
                <MemoSearch
                    onSearch={(query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query })}
                />
                <SortOptions
                    sortOrder={state.sortOrder}
                    onSortChange={(order) => dispatch({ type: 'SET_SORT_ORDER', payload: order })}
                />
            </div>
            <MemoForm onAddMemo={addMemo} />
            <MemoList
                memos={filteredMemos}
                onDeleteMemo={deleteMemo}
                onEditMemo={editMemo}
                onToggleComplete={toggleComplete}
                onOpenDetail={openMemoDetail}
            />
            {state.isDetailOpen && state.selectedMemo && (
                <MemoDetail
                    memo={state.selectedMemo}
                    onSave={(id, newText, newDetail, newAttachments) =>
                        editMemo(id, { text: newText, detail: newDetail, attachments: newAttachments })
                    }
                    onClose={closeMemoDetail}
                />
            )}
        </div>
    );
};

const App = () => (
    <MemoProvider>
        <AppContent />
    </MemoProvider>
);

export default App;
