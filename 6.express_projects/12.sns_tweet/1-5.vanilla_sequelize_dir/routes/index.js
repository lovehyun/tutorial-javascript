const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const tweetRoutes = require('./tweetRoutes');
const likeRoutes = require('./likeRoutes');
const profileRoutes = require('./profileRoutes');

router.use(authRoutes);
router.use(tweetRoutes);
router.use(likeRoutes);
router.use(profileRoutes);

module.exports = router;
