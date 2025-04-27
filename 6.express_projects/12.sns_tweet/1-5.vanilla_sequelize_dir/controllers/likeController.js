const { Like, Tweet } = require('../models');

async function likeTweet(req, res) {
    const tweetId = req.params.tweet_id;
    const userId = req.session.user.id;

    await Like.create({ user_id: userId, tweet_id: tweetId });
    await Tweet.increment('likes_count', { where: { id: tweetId } });

    res.json({ message: '좋아요 완료!' });
}

async function unlikeTweet(req, res) {
    const tweetId = req.params.tweet_id;
    const userId = req.session.user.id;

    await Like.destroy({ where: { user_id: userId, tweet_id: tweetId } });
    await Tweet.decrement('likes_count', { where: { id: tweetId } });

    res.json({ message: '좋아요 취소 완료!' });
}

module.exports = {
    likeTweet,
    unlikeTweet,
};
