import { configureStore } from '@reduxjs/toolkit';
import memoReducer from './memoSlice';

const store = configureStore({
    reducer: {
        memo: memoReducer,
    },
});

export default store;
