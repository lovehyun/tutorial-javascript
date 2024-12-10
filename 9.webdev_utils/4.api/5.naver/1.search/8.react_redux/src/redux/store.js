import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice'; // 기존 reducer 가져오기

const store = configureStore({
    reducer: {
        search: searchReducer, // 검색 관련 상태 관리
    },
});

export default store;
