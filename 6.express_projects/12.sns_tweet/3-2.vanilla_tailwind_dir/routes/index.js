const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const tweetRoutes = require('./tweetRoutes');
const profileRoutes = require('./profileRoutes');

// 여기서 모든 라우터를 등록
router.use(authRoutes);
router.use(tweetRoutes);
router.use(profileRoutes);

module.exports = router;
