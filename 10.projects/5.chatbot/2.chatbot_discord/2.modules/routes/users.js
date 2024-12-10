const express = require('express');
const { getChannelUsers } = require('../discord/discord_users'); // 사용자 로직 가져오기
const router = express.Router();

// Discord 채널에서 사용자 목록 가져오기
router.get('/', async (req, res) => {
    const channelId = process.env.DISCORD_CHANNEL_ID; // 환경 변수에서 채널 ID 가져오기
    try {
        const users = await getChannelUsers(channelId); // 사용자 목록 가져오기
        res.json(users); // 사용자 목록 반환
    } catch (error) {
        console.error('Error fetching channel users:', error.message);
        res.status(500).json({ error: 'Failed to fetch channel users' });
    }
});

module.exports = router;
