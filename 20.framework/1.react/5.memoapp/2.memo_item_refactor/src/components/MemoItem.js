import React from 'react';

const MemoItem = ({ memo, onEditMemo, onDeleteMemo }) => {
    return (
        <div className="memo-item">
            <input
                type="text"
                value={memo.text}
                onChange={(e) => onEditMemo(memo.id, e.target.value)}
            />
            <button onClick={() => onDeleteMemo(memo.id)}>삭제</button>
        </div>
    );
};

export default MemoItem;
