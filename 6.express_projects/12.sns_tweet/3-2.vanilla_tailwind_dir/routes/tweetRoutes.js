const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');
const { loginRequired } = require('../middlewares/authMiddleware');

router.get('/tweets', tweetController.getTweets);
router.post('/tweet', loginRequired, tweetController.createTweet);
router.delete('/tweet/:tweet_id', loginRequired, tweetController.deleteTweet);
router.post('/like/:tweet_id', loginRequired, tweetController.likeTweet);
router.post('/unlike/:tweet_id', loginRequired, tweetController.unlikeTweet);

module.exports = router;
