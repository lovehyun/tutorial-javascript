import React from 'react';

// 메모 목록을 렌더링하는 컴포넌트
const MemoList = ({ memos, onDeleteMemo, onToggleComplete, onEditMemo }) => {
    return (
        <div className="memo-list">
            {memos.map((memo) => (
                <div
                    key={memo.id}
                    className={`memo-item ${memo.completed ? 'completed' : ''}`} // 완료 상태에 따라 클래스 적용
                >
                    {/* 완료 상태를 토글하는 체크박스 */}
                    <input
                        type="checkbox"
                        checked={memo.completed}
                        onChange={() => onToggleComplete(memo.id)}
                        className="checkbox" // 스타일 클래스 추가
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
            ))}
        </div>
    );
};

export default MemoList;
