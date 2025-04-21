// src/controllers/videoController.js
const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');
const Comment = require('../models/Comment');

// 간단한 데이터 저장소 (실제 프로젝트에서는 데이터베이스 사용)
let videos = [];
let comments = [];
let videoIdCounter = 1;
let commentIdCounter = 1;

// 모든 비디오 가져오기
exports.getAllVideos = (req, res) => {
    res.json(videos);
};

// 특정 비디오 상세 정보 가져오기
exports.getVideoById = (req, res) => {
    const videoId = parseInt(req.params.id);
    const video = videos.find((v) => v.id === videoId);

    if (!video) {
        return res.status(404).json({ message: '비디오를 찾을 수 없습니다.' });
    }

    res.json(video);
};

// 비디오 스트리밍
exports.streamVideo = (req, res) => {
    const videoId = parseInt(req.params.id);
    const video = videos.find((v) => v.id === videoId);

    if (!video) {
        return res.status(404).json({ message: '비디오를 찾을 수 없습니다.' });
    }

    const videoPath = path.join(__dirname, '../../public/uploads/videos/', video.fileName);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
};

// 새 비디오 업로드
exports.uploadVideo = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '비디오 파일이 필요합니다.' });
    }

    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: '제목이 필요합니다.' });
    }

    const newVideo = {
        id: videoIdCounter++,
        title,
        description: description || '',
        fileName: req.file.filename,
        uploadDate: new Date().toISOString(),
        views: 0,
        likes: 0,
        dislikes: 0,
        userId: 1, // 실제 인증 구현 시 사용자 ID 활용
    };

    videos.push(newVideo);
    res.status(201).json(newVideo);
};

// 비디오에 댓글 추가
exports.addComment = (req, res) => {
    const videoId = parseInt(req.params.id);
    const { text, userId } = req.body;

    if (!text) {
        return res.status(400).json({ message: '댓글 내용이 필요합니다.' });
    }

    const video = videos.find((v) => v.id === videoId);

    if (!video) {
        return res.status(404).json({ message: '비디오를 찾을 수 없습니다.' });
    }

    const newComment = {
        id: commentIdCounter++,
        videoId,
        text,
        userId: userId || 1, // 실제 인증 구현 시 사용자 ID 활용
        createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    res.status(201).json(newComment);
};

// 비디오의 댓글 가져오기
exports.getVideoComments = (req, res) => {
    const videoId = parseInt(req.params.id);
    const videoComments = comments.filter((c) => c.videoId === videoId);

    res.json(videoComments);
};
