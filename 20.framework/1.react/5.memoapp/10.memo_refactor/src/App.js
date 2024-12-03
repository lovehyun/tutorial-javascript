import React from 'react';
import MemoHeader from './components/MemoHeader';
import MemoForm from './components/MemoForm';
import MemoList from './components/MemoList';
import MemoDetail from './components/MemoDetail';
import useMemoState from './hooks/useMemoState';
import './styles.css';

const App = () => {
    const {
        sortedMemos,
        isDarkMode,
        sortOrder,
        isDetailOpen,
        selectedMemo,
        toggleDarkMode,
        setSortOrder,
        addMemo,
        deleteMemo,
        toggleComplete,
        editMemo,
        reorderMemos,
        openMemoDetail,
        closeMemoDetail,
        saveMemoDetail,
    } = useMemoState();

    // 렌더링 시 상태를 확인하기 위한 디버깅 로그 추가
    console.log('App.js 상태 확인:');
    console.log('isDetailOpen:', isDetailOpen);
    console.log('selectedMemo:', selectedMemo);

    return (
        <div className="app">
            <MemoHeader
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />
            <MemoForm onAddMemo={addMemo} />
            <MemoList
                memos={sortedMemos}
                onDeleteMemo={deleteMemo}
                onToggleComplete={toggleComplete}
                onReorderMemos={reorderMemos}
                onOpenDetail={openMemoDetail}
                onEditMemo={editMemo}
            />
            {isDetailOpen && selectedMemo && (
                <>
                {/* 렌더링 조건 확인을 위한 로그 추가 */}
                {console.log('렌더링 조건 확인:', { isDetailOpen, selectedMemo })}
        
                <MemoDetail
                    memo={selectedMemo}
                    onSave={saveMemoDetail}
                    onClose={closeMemoDetail}
                    onEditMemo={editMemo}
                />
                </>
            )}
        </div>
    );
};

export default App;
