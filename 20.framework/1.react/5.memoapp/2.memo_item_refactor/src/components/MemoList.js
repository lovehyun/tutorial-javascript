import React from 'react';

// 메모 목록을 표시하는 컴포넌트
import MemoItem from './MemoItem';

const MemoList = ({ memos, onDeleteMemo, onEditMemo }) => {
    return (
        <div className="memo-list">
            {memos.map((memo) => (
                <MemoItem
                    key={memo.id}
                    memo={memo}
                    onDeleteMemo={onDeleteMemo}
                    onEditMemo={onEditMemo}
                />
            ))}
        </div>
    );
};

export default MemoList; // 컴포넌트 내보내기
