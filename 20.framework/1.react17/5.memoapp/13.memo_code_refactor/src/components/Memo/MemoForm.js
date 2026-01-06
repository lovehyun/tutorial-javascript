import React, { useState } from 'react';
import styles from '../../styles/MemoForm.module.css';

const MemoForm = ({ onAddMemo }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onAddMemo(input);
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
