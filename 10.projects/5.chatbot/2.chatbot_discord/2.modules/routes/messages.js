const express = require('express');
const { sendMessageToThread } = require('../discord/discord_messages');
const { addMessage, getAllMessages, getMessagesByUserId } = require('../data/messages');

const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, name, email, message, fromAdmin } = req.body;

    if (!message) {
        return res.status(400).send({ status: 'Invalid message' });
    }

    const newMessage = {
        userId,
        name,
        email,
        text: message,
        timestamp: new Date(),
        fromAdmin: fromAdmin || false,
    };

    addMessage(newMessage);

    try {
        // 사용자 정보 포함하여 메시지 생성
        const userInfo = name ? `${userId}, ${name} (${email})` : `${userId}`;
        const formattedMessage = `[${userInfo}]: ${message}`;

        if (!fromAdmin) {
            await sendMessageToThread(userId, formattedMessage, process.env.DISCORD_CHANNEL_ID);
        }

        res.status(201).send({ status: 'Message received' });
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

router.get('/', (req, res) => {
    const { userId } = req.query;

    if (userId) {
        res.json(getMessagesByUserId(userId));
    } else {
        res.json(getAllMessages());
    }
});

module.exports = router;
