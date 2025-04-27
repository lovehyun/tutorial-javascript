const express = require('express');

const router = express.Router();
const auth = require('../controllers/authController');
const tweet = require('../controllers/tweetController');
const like = require('../controllers/likeController');
const profile = require('../controllers/profileController');
const { loginRequired } = require('../controllers/middleware');

// 인증 관련
router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', loginRequired, auth.logout);
router.get('/me', auth.me);

// 트윗 관련
router.get('/tweets', tweet.getTweets);
router.post('/tweet', loginRequired, tweet.postTweet);
router.delete('/tweet/:tweet_id', loginRequired, tweet.deleteTweet);

// 좋아요 관련
router.post('/like/:tweet_id', loginRequired, like.likeTweet);
router.post('/unlike/:tweet_id', loginRequired, like.unlikeTweet);

// 프로필 관련
router.post('/profile/update', loginRequired, profile.updateProfile);
router.post('/profile/password', loginRequired, profile.changePassword);

module.exports = router;
