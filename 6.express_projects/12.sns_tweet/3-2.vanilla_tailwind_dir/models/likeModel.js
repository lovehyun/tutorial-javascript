const { db } = require('./db');

// 트윗에 좋아요 추가
function likeTweet(userId, tweetId, callback) {
    const query = 'INSERT INTO like (user_id, tweet_id) VALUES (?, ?)';
    db.run(query, [userId, tweetId], callback);
}

// 트윗에 좋아요 취소
function unlikeTweet(userId, tweetId, callback) {
    const query = 'DELETE FROM like WHERE user_id = ? AND tweet_id = ?';
    db.run(query, [userId, tweetId], callback);
}

// 특정 사용자가 특정 트윗들에 좋아요한 트윗 ID 조회
function getLikedTweetIds(userId, tweetIds, callback) {
    if (tweetIds.length === 0) return callback(null, []);
    const placeholders = tweetIds.map(() => '?').join(',');
    const query = `
        SELECT tweet_id FROM like 
        WHERE user_id = ? 
        AND tweet_id IN (${placeholders})
    `;
    db.all(query, [userId, ...tweetIds], callback);
}

// 특정 트윗에 대한 모든 좋아요 삭제 (트윗 삭제 시 호출)
function deleteLikesByTweetId(tweetId, callback) {
    const query = 'DELETE FROM like WHERE tweet_id = ?';
    db.run(query, [tweetId], callback);
}

module.exports = { 
    likeTweet, 
    unlikeTweet, 
    getLikedTweetIds, 
    deleteLikesByTweetId 
};
