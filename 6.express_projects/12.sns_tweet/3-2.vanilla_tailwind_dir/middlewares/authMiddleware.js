function loginRequired(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }
    next();
}

module.exports = { 
    loginRequired 
};
