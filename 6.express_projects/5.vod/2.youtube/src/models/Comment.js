// src/models/Comment.js
// 이 예제에서는 간단히 모델 구조만 정의합니다.
// 실제 프로젝트에서는 MongoDB나 MySQL 등의 데이터베이스 연결 로직이 추가될 것입니다.

class Comment {
    constructor(id, videoId, text, userId) {
        this.id = id;
        this.videoId = videoId;
        this.text = text;
        this.userId = userId;
        this.createdAt = new Date().toISOString();
    }
}

module.exports = Comment;
