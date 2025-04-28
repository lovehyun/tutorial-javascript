const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const { loginRequired } = require('../middlewares');

// 사용자 프로필 수정 (로그인 필요)
router.post('/profile/update', loginRequired, profileController.updateProfile);

// 사용자 비밀번호 변경 (로그인 필요)
router.post('/profile/password', loginRequired, profileController.changePassword);

module.exports = router;
