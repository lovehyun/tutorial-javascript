const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// 사용자 회원가입
router.post('/register', authController.register);

// 사용자 로그인
router.post('/login', authController.login);

// 사용자 로그아웃
router.post('/logout', authController.logout);

// 현재 로그인한 사용자 정보 조회
router.get('/me', authController.me);

module.exports = router;
