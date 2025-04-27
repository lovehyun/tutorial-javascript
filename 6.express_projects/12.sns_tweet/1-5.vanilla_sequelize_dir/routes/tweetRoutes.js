const express = require('express');
const router = express.Router();
const tweet = require('../controllers/tweetController');
const { loginRequired } = require('../controllers/middleware');

router.get('/tweets', tweet.getTweets);
router.post('/tweet', loginRequired, tweet.postTweet);
router.delete('/tweet/:tweet_id', loginRequired, tweet.deleteTweet);

module.exports = router;
