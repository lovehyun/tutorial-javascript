// src/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// 모든 비디오 가져오기
router.get('/', videoController.getAllVideos);

// 특정 비디오 상세 정보 가져오기
router.get('/:id', videoController.getVideoById);

// 비디오 스트리밍
router.get('/stream/:id', videoController.streamVideo);

// 새 비디오 업로드
router.post('/', uploadMiddleware.single('videoFile'), videoController.uploadVideo);

// 비디오에 댓글 추가
router.post('/:id/comments', videoController.addComment);

// 비디오의 댓글 가져오기
router.get('/:id/comments', videoController.getVideoComments);

module.exports = router;
