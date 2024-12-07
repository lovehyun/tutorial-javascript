import React from 'react';
import MemoItem from './MemoItem';

const MemoList = ({ memos, onDeleteMemo, onEditMemo, onToggleComplete }) => {
    return (
        <div className="memo-list">
            {memos.map((memo) => (
                <MemoItem
                    key={memo.id}
                    memo={memo}
                    onDeleteMemo={onDeleteMemo}
                    onEditMemo={onEditMemo}
                    onToggleComplete={onToggleComplete}
                />
            ))}
        </div>
    );
};

export default MemoList;
