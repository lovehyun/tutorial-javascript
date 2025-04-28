const { tweetModel, likeModel } = require('../models');

function getTweets(req, res) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const offset = limit ? (page - 1) * limit : 0;

    tweetModel.getAllTweets(limit, offset, (err, tweets) => {
        if (err) {
            return res.status(500).json({ error: '트윗 조회 실패' });
        }
        if (tweets.length === 0) {
            return res.json([]);
        }

        if (req.session.user) {
            const userId = req.session.user.id;
            const tweetIds = tweets.map(tweet => tweet.id);

            likeModel.getLikedTweetIds(userId, tweetIds, (err, likes) => {
                if (err) {
                    return res.status(500).json({ error: '좋아요 조회 실패' });
                }
                const likedTweetIds = likes.map(like => like.tweet_id);
                const result = tweets.map(tweet => ({
                    ...tweet,
                    liked_by_current_user: likedTweetIds.includes(tweet.id)
                }));
                res.json(result);
            });
        } else {
            res.json(tweets.map(tweet => ({ ...tweet, liked_by_current_user: false })));
        }
    });
}

function createTweet(req, res) {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: '내용을 입력하세요.' });
    }
    tweetModel.createTweet(content, req.session.user.id, (err) => {
        if (err) {
            return res.status(500).json({ error: '트윗 작성 실패' });
        }
        res.json({ message: '트윗 작성 완료!' });
    });
}

function deleteTweet(req, res) {
    const tweetId = req.params.tweet_id;

    tweetModel.getTweetById(tweetId, (err, tweet) => {
        if (err || !tweet) {
            return res.status(404).json({ error: '트윗이 존재하지 않습니다.' });
        }
        if (tweet.user_id !== req.session.user.id) {
            return res.status(403).json({ error: '삭제 권한이 없습니다.' });
        }

        likeModel.deleteLikesByTweetId(tweetId, () => {
            tweetModel.deleteTweet(tweetId, (err) => {
                if (err) {
                    return res.status(500).json({ error: '트윗 삭제 실패' });
                }
                res.json({ message: '트윗 삭제 완료!' });
            });
        });
    });
}

function likeTweet(req, res) {
    const tweetId = req.params.tweet_id;
    likeModel.likeTweet(req.session.user.id, tweetId, () => {});
    tweetModel.incrementLikes(tweetId, () => {});
    res.json({ message: '좋아요 완료!' });
}

function unlikeTweet(req, res) {
    const tweetId = req.params.tweet_id;
    likeModel.unlikeTweet(req.session.user.id, tweetId, () => {});
    tweetModel.decrementLikes(tweetId, () => {});
    res.json({ message: '좋아요 취소 완료!' });
}

module.exports = { 
    getTweets, 
    createTweet, 
    deleteTweet, 
    likeTweet, 
    unlikeTweet 
};
