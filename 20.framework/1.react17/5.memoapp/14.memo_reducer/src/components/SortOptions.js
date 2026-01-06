import React from 'react';
import { useMemoContext } from '../context/MemoProvider';
import styles from '../styles/SortOptions.module.css';

const SortOptions = () => {
    const { state, dispatch } = useMemoContext();

    return (
        <div className={styles['sort-options']}>
            <select
                value={state.sortOrder}
                onChange={(e) => dispatch({ type: 'SET_SORT_ORDER', payload: e.target.value })}
                className={styles['select']}
            >
                <option value="newest">최신순</option>
                <option value="oldest">오래된 순</option>
                <option value="alphabetical">알파벳순</option>
                <option value="manual">수동</option>
            </select>
        </div>
    );
};

export default SortOptions;
