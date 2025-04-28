const { tweetModel, likeModel } = require('../models');

// 트윗 목록 조회 (페이징, 로그인 여부에 따라 좋아요 표시)
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

        // 로그인한 경우: 해당 사용자가 좋아요한 트윗 표시
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
        // 비로그인 사용자: liked_by_current_user = false
        } else {
            res.json(tweets.map(tweet => ({ ...tweet, liked_by_current_user: false })));
        }
    });
}

// 트윗 작성
function createTweet(req, res) {
    const { content } = req.body;

    // 내용 입력 여부 확인
    if (!content) {
        return res.status(400).json({ error: '내용을 입력하세요.' });
    }

    // 트윗 생성
    tweetModel.createTweet(content, req.session.user.id, (err) => {
        if (err) {
            return res.status(500).json({ error: '트윗 작성 실패' });
        }
        res.json({ message: '트윗 작성 완료!' });
    });
}

// 트윗 삭제
function deleteTweet(req, res) {
    const tweetId = req.params.tweet_id;

    // 트윗 존재 여부 확인
    tweetModel.getTweetById(tweetId, (err, tweet) => {
        if (err || !tweet) {
            return res.status(404).json({ error: '트윗이 존재하지 않습니다.' });
        }

        // 자신의 트윗만 삭제 가능
        if (tweet.user_id !== req.session.user.id) {
            return res.status(403).json({ error: '삭제 권한이 없습니다.' });
        }

        // 트윗에 달린 좋아요 먼저 삭제 후 트윗 삭제
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

// 트윗 좋아요
function likeTweet(req, res) {
    const tweetId = req.params.tweet_id;

    // 좋아요 추가 + 좋아요 수 증가
    likeModel.likeTweet(req.session.user.id, tweetId, () => {});
    tweetModel.incrementLikes(tweetId, () => {});
    res.json({ message: '좋아요 완료!' });
}

// 트윗 좋아요 취소
function unlikeTweet(req, res) {
    const tweetId = req.params.tweet_id;

    // 좋아요 삭제 + 좋아요 수 감소
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
