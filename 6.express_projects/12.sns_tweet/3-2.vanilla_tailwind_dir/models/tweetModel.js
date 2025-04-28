const { db } = require('./db');

function createTweet(content, userId, callback) {
    const query = 'INSERT INTO tweet (content, user_id) VALUES (?, ?)';
    db.run(query, [content, userId], callback);
}

function getAllTweets(limit, offset, callback) {
    let query = `
        SELECT tweet.*, user.username
        FROM tweet
        JOIN user ON tweet.user_id = user.id
        ORDER BY tweet.id DESC
    `;
    const params = [];

    if (limit !== null) {
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
    }
    db.all(query, params, callback);
}

function getTweetById(id, callback) {
    const query = 'SELECT * FROM tweet WHERE id = ?';
    db.get(query, [id], callback);
}

function deleteTweet(id, callback) {
    const query = 'DELETE FROM tweet WHERE id = ?';
    db.run(query, [id], callback);
}

function incrementLikes(tweetId, callback) {
    const query = 'UPDATE tweet SET likes_count = likes_count + 1 WHERE id = ?';
    db.run(query, [tweetId], callback);
}

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
