import React, { useState, useRef } from 'react';

const MemoDetail = ({ memo, onSave, onClose }) => {
    const [text, setTitle] = useState(memo.text);
    const [detail, setDetail] = useState(memo.detail);
    const [attachments, setAttachments] = useState(memo.attachments || []);
    const fileInputRef = useRef(null); // 파일 입력 필드에 접근하기 위한 Ref 생성

    const handleSave = () => {
        onSave(memo.id, text, detail, attachments);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files); // 업로드된 파일 배열
        const newAttachments = files.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file), // 로컬 URL 생성
            type: file.type,
        }));
        setAttachments([...attachments, ...newAttachments]); // 기존 첨부 파일과 병합
        fileInputRef.current.value = ''; // 파일 입력 필드 초기화
    };

    const handleDeleteAttachment = (indexToDelete) => {
        setAttachments(attachments.filter((_, index) => index !== indexToDelete));
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
                <div className="attachment-section">
                    <h3>첨부 파일</h3>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        ref={fileInputRef} // 파일 입력 필드에 Ref 연결
                    />
                    <ul className="attachment-list">
                        {attachments.map((file, index) => (
                            <li key={index}>
                                {file.type.startsWith('image/') ? (
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="attachment-thumbnail"
                                    />
                                ) : (
                                    <a href={file.url} download={file.name}>
                                        {file.name}
                                    </a>
                                )}
                                <button
                                    className="delete-attachment"
                                    onClick={() => handleDeleteAttachment(index)}
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="memo-detail-buttons">
                    <button onClick={handleSave}>저장</button>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default MemoDetail;
