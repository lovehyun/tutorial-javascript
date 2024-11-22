const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');

router.get('/snippet', authenticate, async (req, res) => {
    const user = await User.findById(req.userId);
    
    // API 키를 URL 파라미터 형태로 생성
    const apiKeysParams = user.apiKeys
        .map((key, index) => `apiKey${index + 1}=${key}`)
        .join('&');

    const snippet = `
        <link rel="stylesheet" href="http://${req.headers.host}/client/chatbot.css">
        <script>
            (function() {
                const bot = document.createElement('script');
                bot.type = 'text/javascript';
                bot.async = true;
                bot.icon = 2;
                bot.src = 'http://${req.headers.host}/client/chatbot.js?apiKey=${apiKeysParams}';
                document.head.appendChild(bot);
            })();
        </script>
  `;
    res.send({ snippet });
});

module.exports = router;
