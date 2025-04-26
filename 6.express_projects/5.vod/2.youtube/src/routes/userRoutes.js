// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 간단한 로그인 (실제 인증은 구현하지 않음)
router.post('/login', userController.login);

// 사용자 등록
router.post('/register', userController.register);

// 사용자 정보 가져오기
router.get('/:id', userController.getUserInfo);

module.exports = router;
