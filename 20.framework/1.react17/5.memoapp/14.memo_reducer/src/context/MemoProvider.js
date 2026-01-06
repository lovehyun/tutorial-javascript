import React, { createContext, useReducer, useContext } from 'react';

// 초기 상태
const initialState = {
    memos: JSON.parse(localStorage.getItem('memos')) || [],
    sortOrder: localStorage.getItem('sortOrder') || 'manual',
    searchQuery: '',
    selectedMemo: null,
    isDetailOpen: false,
};

// 리듀서 함수
const memoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_MEMO':
            return {
                ...state,
                memos: [...state.memos, action.payload],
            };
        case 'DELETE_MEMO':
            return {
                ...state,
                memos: state.memos.filter((memo) => memo.id !== action.payload),
            };
        case 'EDIT_MEMO':
            return {
                ...state,
                memos: state.memos.map((memo) =>
                    memo.id === action.payload.id
                        ? { ...memo, ...action.payload.data }
                        : memo
                ),
            };
        case 'TOGGLE_COMPLETE':
            return {
                ...state,
                memos: state.memos.map((memo) =>
                    memo.id === action.payload
                        ? { ...memo, completed: !memo.completed }
                        : memo
                ),
            };
        case 'SET_SORT_ORDER':
            return {
                ...state,
                sortOrder: action.payload,
            };
        case 'SET_SEARCH_QUERY':
            return {
                ...state,
                searchQuery: action.payload,
            };
        case 'SET_SELECTED_MEMO':
            return {
                ...state,
                selectedMemo: action.payload,
                isDetailOpen: !!action.payload,
            };
        case 'CLOSE_DETAIL':
            return {
                ...state,
                selectedMemo: null,
                isDetailOpen: false,
            };
        default:
            return state;
    }
};

// Context 생성
const MemoContext = createContext();

// Provider 컴포넌트
export const MemoProvider = ({ children }) => {
    const [state, dispatch] = useReducer(memoReducer, initialState);

    // 로컬 스토리지 업데이트
    React.useEffect(() => {
        localStorage.setItem('memos', JSON.stringify(state.memos));
        localStorage.setItem('sortOrder', state.sortOrder);
    }, [state.memos, state.sortOrder]);

    return (
        <MemoContext.Provider value={{ state, dispatch }}>
            {children}
        </MemoContext.Provider>
    );
};

// Context Consumer Hook
export const useMemoContext = () => {
    const context = useContext(MemoContext);
    if (!context) {
        throw new Error('useMemoContext must be used within a MemoProvider');
    }
    return context;
};
