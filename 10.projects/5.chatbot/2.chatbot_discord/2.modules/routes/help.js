const express = require('express');
const { sendMessageToThread } = require('../discord/discord_messages');

const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, message } = req.body;
    const adminId = process.env.DISCORD_USER_ID;

    if (!adminId || !message) {
        return res.status(400).json({ success: false, error: 'Missing userId or message' });
    }

    try {
        const userMention = `<@${adminId}>`;
        const fullMessage = `${userMention} 웹사용자 ${userId}: ${message}`;
        await sendMessageToThread(userId, fullMessage, process.env.DISCORD_CHANNEL_ID);

        res.json({ success: true, message: 'Help request sent to Discord' });
    } catch (error) {
        console.error('Error sending help request:', error.message);
        res.status(500).json({ success: false, error: 'Failed to send help request' });
    }
});

module.exports = router;
