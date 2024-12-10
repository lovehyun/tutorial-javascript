import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
    name: 'search', // slice 이름
    initialState: {
        query: '',
        results: [],
        loading: false,
        error: null,
    },
    reducers: {
        setQuery(state, action) {
            state.query = action.payload;
        },
        setResults(state, action) {
            state.results = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

// 자동 생성된 액션들을 내보냄
export const { setQuery, setResults, setLoading, setError } = searchSlice.actions;

// 리듀서를 기본으로 내보냄
export default searchSlice.reducer;
