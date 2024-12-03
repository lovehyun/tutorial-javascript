// src/hooks/useMemoList.js
import { useState, useMemo, useEffect } from 'react';
import { deleteAttachmentsByMemoId } from '../utils/indexedDB';

export const useMemoList = () => {
    const [memos, setMemos] = useState(() => {
        const savedMemos = localStorage.getItem('memos');
        return savedMemos ? JSON.parse(savedMemos) : [];
    });

    const [sortOrder, setSortOrder] = useState('oldest');
    const [dragged, setDragged] = useState(null);

    const [selectedMemo, setSelectedMemo] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('memos', JSON.stringify(memos));
    }, [memos]);

    useEffect(() => {
        if (dragged !== null) {
            setSortOrder('manual');
            setMemos(dragged);
            setDragged(null);
        }
    }, [dragged]);

    useEffect(() => {
        console.log('isDetailOpen 상태:', isDetailOpen);
        console.log('selectedMemo 상태:', selectedMemo);
    }, [isDetailOpen, selectedMemo]);

    const addMemo = (text) => {
        setMemos([...memos, { id: Date.now(), text, completed: false }]);
    };

    const deleteMemo = async (id) => {
        await deleteAttachmentsByMemoId(id);
        setMemos(memos.filter((memo) => memo.id !== id));
    };

    const toggleComplete = (id) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id ? { ...memo, completed: !memo.completed } : memo
            )
        );
    };

    const editMemo = (id, newText, newDetail, newAttachments) => {
        setMemos(
            memos.map((memo) =>
                memo.id === id
                    ? { ...memo, text: newText, detail: newDetail, attachments: newAttachments }
                    : memo
            )
        );
    };

    const reorderMemos = (startIndex, endIndex) => {
        setSortOrder('manual');
        setMemos((prevMemos) => {
            const updatedMemos = Array.from(prevMemos);
            const [removed] = updatedMemos.splice(startIndex, 1);
            updatedMemos.splice(endIndex, 0, removed);
            return updatedMemos;
        });
    };

    const openMemoDetail = (id) => {
        const memo = memos.find((m) => m.id === id);
        if (memo) {
            setSelectedMemo(memo); // 선택된 메모 설정
            setIsDetailOpen(true); // 상세보기 창 열기
            console.log('상세보기 열림:', memo); // 디버깅
        } else {
            console.error('메모를 찾을 수 없습니다:', id);
        }
    };

    const closeMemoDetail = () => {
        setSelectedMemo(null);
        setIsDetailOpen(false);
    };

    const saveMemoDetail = (id, newText, newDetail, newAttachments) => {
        editMemo(id, newText, newDetail, newAttachments); // 상태 업데이트
        closeMemoDetail(); // 상세보기 창 닫기
    };
    

    const sortedMemos = useMemo(() => {
        if (sortOrder === 'manual') return memos;
        if (sortOrder === 'newest') return [...memos].sort((a, b) => b.id - a.id);
        if (sortOrder === 'oldest') return [...memos].sort((a, b) => a.id - b.id);
        if (sortOrder === 'alphabetical') return [...memos].sort((a, b) => a.text.localeCompare(b.text));
        return memos;
    }, [memos, sortOrder]);

    return {
        memos,
        selectedMemo,
        isDetailOpen,
        sortedMemos,
        sortOrder,
        addMemo,
        deleteMemo,
        toggleComplete,
        reorderMemos,
        editMemo,
        setSortOrder,
        openMemoDetail,
        closeMemoDetail,
        saveMemoDetail,
    };
};
