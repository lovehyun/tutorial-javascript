const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate'); // 사용자 인증 미들웨어
const Log = require('../models/log'); // 로그 모델 가져오기

// 특정 사용자에 대한 로그를 가져오는 라우트
router.get('/logs', authenticate, async (req, res) => {
    const userId = req.userId; // 인증된 사용자 ID 가져오기 (미들웨어에서 설정됨)
    
    // MongoDB에서 해당 사용자의 로그를 가져오고, 최신 로그부터 정렬
    const logs = await Log.find({ userId }).sort({ timestamp: -1 }); 
    
    // 가져온 로그를 클라이언트에 반환
    res.send(logs);
});

module.exports = router; // 라우터 내보내기
