import React, { useState, useEffect } from 'react';
import { addAttachment, getAttachments, deleteAttachment } from '../utils/indexedDB';

const MemoDetail = ({ memo, onSave, onClose }) => {
    const [text, setTitle] = useState(memo.text);
    const [detail, setDetail] = useState(memo.detail);
    const [attachments, setAttachments] = useState(memo.attachments || []);

    useEffect(() => {
        loadAttachments();
    }, []);

    const loadAttachments = async () => {
        const files = await getAttachments();
        setAttachments(files);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files); // 업로드된 파일 배열
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = async () => {
                const attachment = {
                    name: file.name,
                    data: reader.result, // Base64 데이터 저장
                    type: file.type,
                    memoId: memo.id, // 메모 ID 추가
                };
                await addAttachment(attachment); // IndexedDB에 저장
                loadAttachments(); // 업데이트된 목록 로드
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAttachment = async (id) => {
        await deleteAttachment(id);
        loadAttachments(); // 삭제 후 목록 새로고침
    };

    const handleSave = () => {
        onSave(memo.id, text, detail, attachments);
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
                    />
                    <ul className="attachment-list">
                        {attachments.map((file) => (
                            <li key={file.id}>
                                {file.type.startsWith('image/') ? (
                                    <img
                                        src={file.data}
                                        alt={file.name}
                                        className="attachment-thumbnail"
                                    />
                                ) : (
                                    <a href={file.data} download={file.name}>
                                        {file.name}
                                    </a>
                                )}
                                <button
                                    className="delete-attachment"
                                    onClick={() => handleDeleteAttachment(file.id)}
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
