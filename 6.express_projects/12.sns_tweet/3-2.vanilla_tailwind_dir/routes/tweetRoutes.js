const express = require('express');
const router = express.Router();

const tweetController = require('../controllers/tweetController');
const { loginRequired } = require('../middlewares');

// 모든 트윗 목록 조회 (로그인 불필요)
router.get('/tweets', tweetController.getTweets);

// 트윗 작성 (로그인 필요)
router.post('/tweet', loginRequired, tweetController.createTweet);

// 트윗 삭제 (로그인 필요)
router.delete('/tweet/:tweet_id', loginRequired, tweetController.deleteTweet);

// 트윗 좋아요 (로그인 필요)
router.post('/like/:tweet_id', loginRequired, tweetController.likeTweet);

// 트윗 좋아요 취소 (로그인 필요)
router.post('/unlike/:tweet_id', loginRequired, tweetController.unlikeTweet);

module.exports = router;
