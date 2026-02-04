/**
 * JSON API: Toss 결제창용 클라이언트 키 등 (인증 불필요)
 */
const express = require('express');
const router = express.Router();
const config = require('../config');

/** Toss 결제창 초기화용 클라이언트 키 */
router.get('/config', (req, res) => {
    res.json({ clientKey: config.toss.clientKey });
});

module.exports = router;
