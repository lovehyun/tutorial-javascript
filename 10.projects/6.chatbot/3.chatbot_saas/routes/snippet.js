const express = require('express');
const User = require('../models/user'); // 사용자 모델 가져오기
const router = express.Router();
const { authenticate } = require('../middleware/authenticate'); // 사용자 인증 미들웨어

// '/snippet' 엔드포인트: 사용자 맞춤 스니펫 생성
router.get('/snippet', authenticate, async (req, res) => {
    // 인증된 사용자 ID를 사용하여 데이터베이스에서 사용자 정보 가져오기
    const user = await User.findById(req.userId);

    // 클라이언트에서 사용할 HTML 및 JavaScript 스니펫 생성
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

    // 생성된 스니펫을 JSON 형식으로 반환
    res.send({ snippet });
});

module.exports = router; // 라우터 내보내기
