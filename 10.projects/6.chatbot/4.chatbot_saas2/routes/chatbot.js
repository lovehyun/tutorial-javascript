const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/authenticate');
const Log = require('../models/log');

router.post('/chatbot-message', authenticateApiKey, async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send({ error: 'Message is required.' });
    }

    // Example: Generate bot reply
    const botReply = `Reply to: ${message}`;

    // Save log with apiKey
    await Log.create({
        userId: req.userId,
        apiKey: req.apiKey, // Middleware에서 설정된 API 키
        message,
        reply: botReply
    });

    res.send({ reply: botReply });
});

module.exports = router;
