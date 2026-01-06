import React from 'react';

const MemoItem = ({ memo, onDeleteMemo, onEditMemo, onToggleComplete }) => {
    return (
        <div
            className={`memo-item ${memo.completed ? 'completed' : ''}`} // 완료 상태에 따라 클래스 적용
        >
            {/* 완료 상태를 토글하는 체크박스 */}
            <input
                type="checkbox"
                checked={memo.completed}
                onChange={() => onToggleComplete(memo.id)}
                className="checkbox"
            />
            {/* 메모 텍스트 */}
            <input
                type="text"
                value={memo.text}
                onChange={(e) => onEditMemo(memo.id, e.target.value)}
                disabled={memo.completed} // 완료된 메모는 수정 불가
            />
            {/* 삭제 버튼 */}
            <button onClick={() => onDeleteMemo(memo.id)}>삭제</button>
        </div>
    );
};

export default MemoItem;
