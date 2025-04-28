const { db } = require('./db');

// 트윗 작성
function createTweet(content, userId, callback) {
    const query = 'INSERT INTO tweet (content, user_id) VALUES (?, ?)';
    db.run(query, [content, userId], callback);
}

// 모든 트윗 조회 (최신순) + 작성자 이름 포함
function getAllTweets(limit, offset, callback) {
    let query = `
        SELECT tweet.*, user.username
        FROM tweet
        JOIN user ON tweet.user_id = user.id
        ORDER BY tweet.id DESC
    `;
    const params = [];

    // limit이 있을 때만 페이징 적용
    if (limit !== null) {
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
    }
    db.all(query, params, callback);
}

// 특정 트윗 조회 (트윗 ID로)
function getTweetById(id, callback) {
    const query = 'SELECT * FROM tweet WHERE id = ?';
    db.get(query, [id], callback);
}

// 트윗 삭제 (트윗 ID로)
function deleteTweet(id, callback) {
    const query = 'DELETE FROM tweet WHERE id = ?';
    db.run(query, [id], callback);
}

// 트윗 좋아요 수 증가
function incrementLikes(tweetId, callback) {
    const query = 'UPDATE tweet SET likes_count = likes_count + 1 WHERE id = ?';
    db.run(query, [tweetId], callback);
}

// 트윗 좋아요 수 감소
function decrementLikes(tweetId, callback) {
    const query = 'UPDATE tweet SET likes_count = likes_count - 1 WHERE id = ?';
    db.run(query, [tweetId], callback);
}

module.exports = { 
    createTweet, 
    getAllTweets, 
    getTweetById, 
    deleteTweet, 
    incrementLikes, 
    decrementLikes 
};
