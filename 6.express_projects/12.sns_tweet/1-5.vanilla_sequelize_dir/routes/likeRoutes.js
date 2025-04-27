const express = require('express');
const router = express.Router();
const like = require('../controllers/likeController');
const { loginRequired } = require('../controllers/middleware');

router.post('/like/:tweet_id', loginRequired, like.likeTweet);
router.post('/unlike/:tweet_id', loginRequired, like.unlikeTweet);

module.exports = router;
