const express = require('express');
const router = express.Router();
const { getAllMessages, getMessagesByUserId } = require('../data/messages');

// 관리자 메시지 조회
router.get('/messages', (req, res) => {
    const userId = req.query.userId;

    if (userId) {
        res.json(getMessagesByUserId(userId));
    } else {
        res.json(getAllMessages());
    }
});

module.exports = router;
