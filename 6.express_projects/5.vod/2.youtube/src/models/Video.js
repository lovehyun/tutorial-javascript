// src/models/Video.js
// 이 예제에서는 간단히 모델 구조만 정의합니다.
// 실제 프로젝트에서는 MongoDB나 MySQL 등의 데이터베이스 연결 로직이 추가될 것입니다.

class Video {
    constructor(id, title, description, fileName, userId) {
        this.id = id;
        this.title = title;
        this.description = description || '';
        this.fileName = fileName;
        this.uploadDate = new Date().toISOString();
        this.views = 0;
        this.likes = 0;
        this.dislikes = 0;
        this.userId = userId;
    }
}

module.exports = Video;
