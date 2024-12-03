// src/hooks/useMemoState.js
import { useMemoList } from './useMemoList';
import { useDarkMode } from './useDarkMode';

const useMemoState = () => {
    const {
        memos,
        sortedMemos,
        sortOrder,
        isDetailOpen,
        selectedMemo,
        addMemo,
        deleteMemo,
        toggleComplete,
        reorderMemos,
        editMemo,
        setSortOrder,
        openMemoDetail,
        closeMemoDetail,
        saveMemoDetail,
    } = useMemoList();

    const {
        isDarkMode,
        toggleDarkMode,
    } = useDarkMode();

    return {
        memos,
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
        reorderMemos,
        editMemo,
        openMemoDetail,
        closeMemoDetail,
        saveMemoDetail,
    };
};

export default useMemoState;
