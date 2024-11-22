const jwt = require('jsonwebtoken');
const User = require('../models/user');

// JWT 인증 미들웨어
const authenticate = (req, res, next) => {
    const token = req.header('x-auth'); // 요청 헤더에서 'x-auth' 토큰 가져오기
    if (!token) {
        // 토큰이 없는 경우 401 상태 코드 반환
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // JWT 토큰을 검증하고 디코딩
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id; // 디코딩된 사용자 ID를 요청 객체에 추가
        next(); // 다음 미들웨어로 이동
    } catch (ex) {
        // 토큰이 유효하지 않은 경우
        res.status(401).send('Invalid token.');
    }
};

// API 키 인증 미들웨어
const authenticateApiKey = async (req, res, next) => {
    const authHeader = req.header('Authorization'); // 요청 헤더에서 'Authorization' 키 가져오기
    if (!authHeader) {
        // Authorization 헤더가 없는 경우 401 상태 코드 반환
        return res.status(401).send('Access denied. No API key provided.');
    }

    // 'Bearer ' 접두사를 제거하여 API 키 추출
    const apiKey = authHeader.replace('Bearer ', '');
    const user = await User.findOne({ apiKey }); // 데이터베이스에서 API 키를 가진 사용자 검색
    if (!user) {
        // 해당 API 키가 없으면 401 상태 코드 반환
        return res.status(401).send('Invalid API key.');
    }

    req.userId = user._id; // 검색된 사용자 ID를 요청 객체에 추가
    next(); // 다음 미들웨어로 이동
};

// 두 가지 인증 미들웨어를 모듈로 내보내기
module.exports = { authenticate, authenticateApiKey };
