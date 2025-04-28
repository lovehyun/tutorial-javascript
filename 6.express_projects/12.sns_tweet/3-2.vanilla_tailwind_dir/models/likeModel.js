const { db } = require('./db');

function likeTweet(userId, tweetId, callback) {
    const query = 'INSERT INTO like (user_id, tweet_id) VALUES (?, ?)';
    db.run(query, [userId, tweetId], callback);
}

function unlikeTweet(userId, tweetId, callback) {
    const query = 'DELETE FROM like WHERE user_id = ? AND tweet_id = ?';
    db.run(query, [userId, tweetId], callback);
}

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
