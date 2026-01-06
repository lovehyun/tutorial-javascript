import React, { useState, useRef, useEffect } from 'react';
import useIndexedDB from '../../hooks/useIndexedDB';
import styles from '../../styles/MemoDetail.module.css';

const MemoDetail = ({ memo, onSave, onClose }) => {
    const [text, setText] = useState(memo.text);
    const [detail, setDetail] = useState(memo.detail);
    const [attachments, setAttachments] = useState(memo.attachments || []);
    const fileInputRef = useRef(null);
    const { getAllAttachments, addAttachment, deleteAttachment } = useIndexedDB();

    useEffect(() => {
        const loadAttachments = async () => {
            const files = await getAllAttachments();
            const filteredFiles = files.filter((file) => file.memoId === memo.id);
            setAttachments(filteredFiles);
        };

        loadAttachments();
    }, [memo.id, getAllAttachments]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const newAttachment = {
                    name: file.name,
                    data: reader.result,
                    type: file.type,
                    memoId: memo.id,
                };
                await addAttachment(newAttachment);
                const updatedAttachments = await getAllAttachments();
                setAttachments(updatedAttachments.filter((a) => a.memoId === memo.id));
            };
            reader.readAsDataURL(file);
        });
        fileInputRef.current.value = '';
    };

    const handleDeleteAttachment = async (id) => {
        await deleteAttachment(id);
        const updatedAttachments = await getAllAttachments();
        setAttachments(updatedAttachments.filter((a) => a.memoId === memo.id));
    };

    const handleSave = () => {
        onSave(memo.id, text, detail, attachments);
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
                    className={styles['detail-input']}
                />
                <div className={styles['attachment-section']}>
                    <h3>첨부 파일</h3>
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className={styles['file-input']}
                    />
                    <ul>
                        {attachments.map((file) => (
                            <li key={file.id}>
                                {file.name}
                                <button
                                    onClick={() => handleDeleteAttachment(file.id)}
                                    className={styles['delete-button']}
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={handleSave} className={styles['save-button']}>
                    저장
                </button>
                <button onClick={onClose} className={styles['close-button']}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default MemoDetail;
