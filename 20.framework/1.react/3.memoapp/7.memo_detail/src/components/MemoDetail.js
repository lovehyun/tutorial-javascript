import React, { useState } from 'react';

const MemoDetail = ({ memo, onSave, onClose }) => {
    const [text, setTitle] = useState(memo.text);
    const [detail, setDetail] = useState(memo.detail);

    const handleSave = () => {
        onSave(memo.id, text, detail);
    };

    return (
        <div className="memo-detail-overlay">
            <div className="memo-detail">
                <h2>메모 상세보기</h2>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="memo-title-input"
                />
                <textarea
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="상세 내용을 입력하세요"
                    className="memo-textarea"
                />
                <div className="memo-detail-buttons">
                    <button onClick={handleSave}>저장</button>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default MemoDetail;
