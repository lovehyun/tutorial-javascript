// IndexedDB 초기화 및 유틸리티 함수

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MemoApp', 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('attachments')) {
                db.createObjectStore('attachments', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

export const addAttachment = async (attachment) => {
    const db = await initDB();
    const transaction = db.transaction('attachments', 'readwrite');
    const store = transaction.objectStore('attachments');
    return new Promise((resolve, reject) => {
        const request = store.add(attachment);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

export const getAttachments = async () => {
    const db = await initDB();
    const transaction = db.transaction('attachments', 'readonly');
    const store = transaction.objectStore('attachments');
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

export const deleteAttachment = async (id) => {
    const db = await initDB();
    const transaction = db.transaction('attachments', 'readwrite');
    const store = transaction.objectStore('attachments');
    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
};

export const deleteAttachmentsByMemoId = async (memoId) => {
    const db = await initDB();
    const transaction = db.transaction('attachments', 'readwrite');
    const store = transaction.objectStore('attachments');

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
            const attachments = request.result;
            const idsToDelete = attachments
                .filter((attachment) => attachment.memoId === memoId)
                .map((attachment) => attachment.id);

            idsToDelete.forEach((id) => {
                store.delete(id);
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = (e) => reject(e.target.error);
        };
        request.onerror = (e) => reject(e.target.error);
    });
};
