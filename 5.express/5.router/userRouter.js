// userRouter.js
const express = require('express');
const router = express.Router();

// 사용자 프로필 조회
router.get('/profile', (req, res) => {
    res.send('User Profile');
});

// 사용자 설정
router.get('/settings', (req, res) => {
    res.send('User Settings');
});

module.exports = router;
