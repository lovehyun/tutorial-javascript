import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editMemo, closeDetail } from '../../store/memoSlice';
import styles from '../../styles/MemoDetail.module.css';

const MemoDetail = ({ memo }) => {
    const [text, setText] = useState(memo.text);
    const [detail, setDetail] = useState(memo.detail || '');
    const dispatch = useDispatch();

    const handleSave = () => {
        dispatch(editMemo({ id: memo.id, data: { text, detail } }));
        dispatch(closeDetail());
    };

    return (
        <div className={styles['memo-detail-overlay']}>
            <div className={styles['memo-detail']}>
                <h2>메모 상세보기</h2>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={styles['title-input']}
                />
                <textarea
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    className={styles['detail-textarea']}
                />
                <div className={styles['buttons']}>
                    <button onClick={handleSave} className={styles['save-button']}>
                        저장
                    </button>
                    <button onClick={() => dispatch(closeDetail())} className={styles['close-button']}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemoDetail;
