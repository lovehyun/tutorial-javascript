/**
 * 로그인·회원가입·로그아웃 라우트
 */
const express = require('express');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcryptjs');
const users = require('../database/users');

const publicDir = path.join(__dirname, '../../public');

/** 로그인 페이지 (이미 로그인 시 /app으로) */
router.get('/login', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/app');
    }
    res.sendFile(path.join(publicDir, 'login.html'));
});

/** 로그인 처리: 비밀번호 검증 후 세션 저장, /app 리다이렉트 */
router.post('/login', express.urlencoded({ extended: true }), (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.redirect('/login?error=입력값을 확인해주세요.');
    }
    const dbUser = users.findByUsername(username.trim());
    if (!dbUser || !bcrypt.compareSync(password, dbUser.password_hash)) {
        return res.redirect('/login?error=아이디 또는 비밀번호가 맞지 않습니다.');
    }
    req.session.userId = dbUser.id;
    req.session.username = dbUser.username;
    res.redirect('/app');
});

/** 회원가입 페이지 */
router.get('/signup', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/app');
    }
    res.sendFile(path.join(publicDir, 'signup.html'));
});

/** 회원가입 처리: 중복 체크 후 생성, /login으로 */
router.post('/signup', express.urlencoded({ extended: true }), (req, res) => {
    const { username, password } = req.body || {};
    const name = (username || '').trim();
    if (!name || !password || password.length < 4) {
        return res.redirect('/signup?error=아이디와 비밀번호(4자 이상)를 입력해주세요.');
    }
    if (users.findByUsername(name)) {
        return res.redirect('/signup?error=이미 사용 중인 아이디입니다.');
    }
    users.createUser(name, password);
    res.redirect('/login?msg=회원가입되었습니다. 로그인해주세요.');
});

/** 로그아웃: 세션 삭제 후 /login */
router.post('/logout', (req, res) => {
    req.session.destroy(() => {});
    res.redirect('/login');
});

module.exports = router;
