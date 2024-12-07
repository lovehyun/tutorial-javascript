import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addMemo,
    deleteMemo,
    editMemo,
    toggleComplete,
    setSortOrder,
    setSearchQuery,
    setSelectedMemo,
    closeDetail,
} from './store/memoSlice';
import MemoList from './components/Memo/MemoList';
import MemoForm from './components/Memo/MemoForm';
import MemoSearch from './components/Memo/MemoSearch';
import SortOptions from './components/SortOptions';
import MemoDetail from './components/Memo/MemoDetail';

import './styles/common.css';

const App = () => {
    const dispatch = useDispatch();
    const { memos, sortOrder, searchQuery, selectedMemo, isDetailOpen } = useSelector(
        (state) => state.memo
    );

    const sortedMemos = [...memos].sort((a, b) => {
        if (sortOrder === 'newest') return b.id - a.id;
        if (sortOrder === 'oldest') return a.id - b.id;
        if (sortOrder === 'alphabetical') return a.text.localeCompare(b.text);
        return 0;
    });

    const filteredMemos = sortedMemos.filter((memo) =>
        memo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="app">
            <h1>Memo App</h1>
            <div className="search-and-sort-container">
                <MemoSearch
                    onSearch={(query) => dispatch(setSearchQuery(query))}
                />
                <SortOptions
                    sortOrder={sortOrder}
                    onSortChange={(order) => dispatch(setSortOrder(order))}
                />
            </div>
            <MemoForm onAddMemo={(text) => dispatch(addMemo({ id: Date.now(), text, completed: false }))} />
            <MemoList
                memos={filteredMemos}
                onDeleteMemo={(id) => dispatch(deleteMemo(id))}
                onEditMemo={(id, data) => dispatch(editMemo({ id, data }))}
                onToggleComplete={(id) => dispatch(toggleComplete(id))}
                onOpenDetail={(id) => dispatch(setSelectedMemo(memos.find((m) => m.id === id)))}
            />
            {isDetailOpen && selectedMemo && (
                <MemoDetail
                    memo={selectedMemo}
                    onSave={(id, newText, newDetail, newAttachments) =>
                        dispatch(editMemo({ id, data: { text: newText, detail: newDetail, attachments: newAttachments } }))
                    }
                    onClose={() => dispatch(closeDetail())}
                />
            )}
        </div>
    );
};

export default App;
