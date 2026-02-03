const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// API 키 생성 함수
const generateApiKey = () => {
    return require('crypto').randomBytes(16).toString('hex'); // 16바이트 랜덤 값을 생성해 문자열로 변환
};

// 사용자 등록 라우트
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 이메일 중복 확인
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // 이미 존재하는 이메일인 경우 409 응답
            return res.status(409).send({ error: 'Email is already in use.' });
        }

        // 비밀번호 해싱 (bcrypt를 사용해 보안을 강화)
        const hashedPassword = await bcrypt.hash(password, 8);

        // 새 사용자 생성 및 저장
        const user = new User({ email, password: hashedPassword });
        await user.save();

        // 성공적으로 사용자 등록 응답
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        // 사용자 등록 실패 시 400 상태 코드 반환
        res.status(400).send(error);
    }
});

// 사용자 로그인 라우트
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 이메일로 사용자 조회
    const user = await User.findOne({ email });
    if (!user) {
        // 사용자가 없는 경우 404 응답
        return res.status(404).json({ error: 'User not found' });
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        // 비밀번호가 일치하지 않을 경우 400 응답
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ token }); // 토큰을 클라이언트에 반환
});

// 현재 사용자 정보 조회 라우트
router.get('/me', authenticate, async (req, res) => {
    try {
        // 현재 로그인한 사용자의 정보 가져오기
        const user = await User.findById(req.userId).select('-password -apiKey'); // 비밀번호 및 API 키 제외
        if (!user) {
            // 사용자가 없는 경우 404 응답
            return res.status(404).send('User not found');
        }
        res.send(user); // 사용자 정보를 응답
    } catch (error) {
        // 서버 오류 발생 시 500 응답
        res.status(500).send(error);
    }
});

// API 키 조회 라우트
router.get('/apikey', authenticate, async (req, res) => {
    // 현재 로그인한 사용자의 API 키 가져오기
    const user = await User.findById(req.userId);
    if (!user) {
        // 사용자가 없는 경우 404 응답
        return res.status(404).send('User not found');
    }
    res.send({ apiKey: user.apiKey }); // API 키 응답
});

// 새로운 API 키 생성 라우트
router.post('/apikey', authenticate, async (req, res) => {
    // 새로운 API 키 생성
    const newApiKey = generateApiKey();

    // 현재 로그인한 사용자에 대해 API 키 업데이트
    await User.findByIdAndUpdate(req.userId, { apiKey: newApiKey });

    // 생성된 API 키 응답
    res.send({ apiKey: newApiKey });
});

// 라우터 모듈 내보내기
module.exports = router;
