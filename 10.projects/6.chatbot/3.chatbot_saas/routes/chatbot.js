const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/authenticate'); // API 키 인증 미들웨어
const Log = require('../models/log'); // 로그 모델 가져오기

// 챗봇 메시지 처리 라우트
router.post('/chatbot-message', authenticateApiKey, async (req, res) => {
    const { message } = req.body; // 요청 본문에서 메시지 추출
    const userId = req.userId; // 인증된 사용자 ID 가져오기 (미들웨어에서 설정됨)

    // 여기에서 챗봇 응답을 생성합니다.
    const reply = `Echo: ${message}`; // 단순 에코 응답 (테스트용)

    // 로그를 저장합니다.
    const log = new Log({ userId, message, reply }); // 로그 모델에 사용자 ID, 요청 메시지, 응답 저장
    await log.save(); // MongoDB에 로그 저장

    res.send({ reply }); // 생성된 응답을 클라이언트에 반환
});

module.exports = router; // 라우터 내보내기
