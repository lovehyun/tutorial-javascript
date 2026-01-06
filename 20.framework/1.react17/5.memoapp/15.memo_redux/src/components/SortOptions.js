import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSortOrder } from '../store/memoSlice';
import styles from '../styles/SortOptions.module.css';

const SortOptions = () => {
    const sortOrder = useSelector((state) => state.memo.sortOrder);
    const dispatch = useDispatch();

    return (
        <div className={styles['sort-options']}>
            <select
                value={sortOrder}
                onChange={(e) => dispatch(setSortOrder(e.target.value))}
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
