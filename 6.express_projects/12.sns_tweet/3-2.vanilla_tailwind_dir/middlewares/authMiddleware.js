// 로그인 여부를 확인하는 미들웨어
function loginRequired(req, res, next) {
    // 세션에 사용자 정보가 없으면 401 Unauthorized 응답
    if (!req.session.user) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    // 로그인되어 있으면 다음 미들웨어 또는 컨트롤러로 진행
    next();
}

module.exports = { 
    loginRequired 
};
