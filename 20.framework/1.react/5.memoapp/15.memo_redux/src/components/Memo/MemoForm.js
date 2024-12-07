import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMemo } from '../../store/memoSlice';
import styles from '../../styles/MemoForm.module.css';

const MemoForm = () => {
    const [input, setInput] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const newMemo = { id: Date.now(), text: input, completed: false };
            dispatch(addMemo(newMemo));
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles['memo-form']}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메모를 입력하세요"
                className={styles['input']}
            />
            <button type="submit" className={styles['add-button']}>
                추가
            </button>
        </form>
    );
};

export default MemoForm;
