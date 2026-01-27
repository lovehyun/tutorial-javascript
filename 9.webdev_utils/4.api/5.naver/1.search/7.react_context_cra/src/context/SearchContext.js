import React, { createContext, useReducer, useContext } from 'react';

// 초기 상태 정의
const initialState = {
    query: '',
    results: [],
    loading: false,
    error: null,
};

// 리듀서 함수 정의
function searchReducer(state, action) {
    switch (action.type) {
        case 'SET_QUERY':
            return { ...state, query: action.payload };
        case 'SET_RESULTS':
            return { ...state, results: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

// Context 생성
const SearchContext = createContext();

// Context Provider 컴포넌트
export function SearchProvider({ children }) {
    const [state, dispatch] = useReducer(searchReducer, initialState);

    return (
        <SearchContext.Provider value={{ state, dispatch }}>
            {children}
        </SearchContext.Provider>
    );
}

// Context 소비를 위한 커스텀 훅
export function useSearch() {
    return useContext(SearchContext);
}
