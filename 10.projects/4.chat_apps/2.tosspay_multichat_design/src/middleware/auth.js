/**
 * 인증 미들웨어: 로그인 여부 확인, req.user 붙이기
 */
const users = require('../database/users');

/** HTML 페이지용: 비로그인 시 /login으로 리다이렉트 */
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

/** API용: 비로그인 시 401 JSON */
function requireAuthApi(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(401).json({ error: '로그인이 필요합니다.' });
}

/** 세션에 userId가 있으면 req.user에 회원 정보 담기 */
function attachUser(req, res, next) {
    if (req.session && req.session.userId) {
        req.user = users.findById(req.session.userId);
    }
    next();
}

module.exports = { requireAuth, requireAuthApi, attachUser };
