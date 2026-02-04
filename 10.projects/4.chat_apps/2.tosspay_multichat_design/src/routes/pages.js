/**
 * 페이지 라우트: / → 로그인 여부에 따라 /login 또는 /app
 * - /app: 채팅·크레딧 메인 (로그인 필요)
 * - /config: Toss 클라이언트 키 (결제창용)
 */
const express = require('express');
const path = require('path');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

const publicDir = path.join(__dirname, '../../public');

/** 루트: 로그인 시 /app, 아니면 /login */
router.get('/', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/app');
    }
    res.redirect('/login');
});

/** 채팅·크레딧 앱 페이지 (로그인 필요) */
router.get('/app', requireAuth, (req, res) => {
    res.sendFile(path.join(publicDir, 'app.html'));
});

module.exports = router;
