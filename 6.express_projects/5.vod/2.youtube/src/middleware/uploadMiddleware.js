// src/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// 디스크 저장소 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/videos'));
    },
    filename: function (req, file, cb) {
        // 파일명이 겹치지 않도록 타임스탬프 추가
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// 파일 필터링 (비디오 파일만 허용)
const fileFilter = (req, file, cb) => {
    // 허용되는 비디오 MIME 타입
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('지원되지 않는 파일 형식입니다. MP4, WebM, Ogg 형식만 허용됩니다.'), false);
    }
};

// 파일 크기 제한 (100MB)
const limits = {
    fileSize: 100 * 1024 * 1024,
};

// Multer 설정
const upload = multer({
    storage,
    fileFilter,
    limits,
});

module.exports = upload;
