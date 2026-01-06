import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    memos: JSON.parse(localStorage.getItem('memos')) || [],
    sortOrder: localStorage.getItem('sortOrder') || 'manual',
    searchQuery: '',
    selectedMemo: null,
    isDetailOpen: false,
};

const memoSlice = createSlice({
    name: 'memo',
    initialState,
    reducers: {
        addMemo: (state, action) => {
            state.memos.push(action.payload);
        },
        deleteMemo: (state, action) => {
            state.memos = state.memos.filter((memo) => memo.id !== action.payload);
        },
        editMemo: (state, action) => {
            const { id, data } = action.payload;
            state.memos = state.memos.map((memo) =>
                memo.id === id ? { ...memo, ...data } : memo
            );
        },
        toggleComplete: (state, action) => {
            state.memos = state.memos.map((memo) =>
                memo.id === action.payload
                    ? { ...memo, completed: !memo.completed }
                    : memo
            );
        },
        setSortOrder: (state, action) => {
            state.sortOrder = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setSelectedMemo: (state, action) => {
            state.selectedMemo = action.payload;
            state.isDetailOpen = !!action.payload;
        },
        closeDetail: (state) => {
            state.selectedMemo = null;
            state.isDetailOpen = false;
        },
    },
});

export const {
    addMemo,
    deleteMemo,
    editMemo,
    toggleComplete,
    setSortOrder,
    setSearchQuery,
    setSelectedMemo,
    closeDetail,
} = memoSlice.actions;

export default memoSlice.reducer;
