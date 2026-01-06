import { initDB } from '../utils/indexedDB';

const useIndexedDB = () => {
    // 모든 첨부파일 가져오기
    const getAllAttachments = async () => {
        const db = await initDB();
        const transaction = db.transaction('attachments', 'readonly');
        const store = transaction.objectStore('attachments');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    };

    // 첨부파일 추가
    const addAttachment = async (attachment) => {
        const db = await initDB();
        const transaction = db.transaction('attachments', 'readwrite');
        const store = transaction.objectStore('attachments');
        return new Promise((resolve, reject) => {
            const request = store.add(attachment);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    };

    // 특정 ID로 첨부파일 삭제
    const deleteAttachment = async (id) => {
        const db = await initDB();
        const transaction = db.transaction('attachments', 'readwrite');
        const store = transaction.objectStore('attachments');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    };

    // 특정 메모 ID에 해당하는 첨부파일 모두 삭제
    const deleteAttachmentsByMemoId = async (memoId) => {
        const db = await initDB();
        const transaction = db.transaction('attachments', 'readwrite');
        const store = transaction.objectStore('attachments');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const attachments = request.result.filter((a) => a.memoId === memoId);
                attachments.forEach((a) => store.delete(a.id));

                transaction.oncomplete = () => resolve();
                transaction.onerror = (e) => reject(e.target.error);
            };
            request.onerror = (e) => reject(e.target.error);
        });
    };

    return { getAllAttachments, addAttachment, deleteAttachment, deleteAttachmentsByMemoId };
};

export default useIndexedDB;
