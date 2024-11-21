const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');

router.get('/snippet', authenticate, async (req, res) => {
    const user = await User.findById(req.userId);
    const snippet = `
        <link rel="stylesheet" href="http://${req.headers.host}/client/chatbot.css">
        <script>
            (function() {
                const bot = document.createElement('script');
                bot.type = 'text/javascript';
                bot.async = true;
                bot.icon = 2;
                bot.src = 'http://${req.headers.host}/client/chatbot.js?apiKey=${user.apiKey}';
                document.head.appendChild(bot);
            })();
        </script>
  `;
    res.send({ snippet });
});

module.exports = router;
