const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/authenticate');
const Log = require('../models/log');

// Route to handle chatbot messages
router.post('/chatbot-message', authenticateApiKey, async (req, res) => {
    const { message } = req.body;
    const userId = req.userId;

    // 여기에서 챗봇 응답을 생성합니다.
    const reply = `Echo: ${message}`;

    // 로그를 저장합니다.
    const log = new Log({ userId, message, reply });
    await log.save();

    res.send({ reply });
});

module.exports = router;
