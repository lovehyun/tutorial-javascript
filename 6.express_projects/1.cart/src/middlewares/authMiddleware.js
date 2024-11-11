// src/middlewares/authMiddleware.js

function checkLogin(req, res, next) {
    const user = req.session.user;

    if (user) {
        // 로그인된 경우 다음 미들웨어로 이동
        next();
    } else {
        // 로그인되지 않은 경우
        res.status(401).json({ message: '로그인이 필요합니다.', redirectUrl: '/' });
    }
}

export { checkLogin };
