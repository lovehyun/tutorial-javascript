const { User } = require('../models');

async function register(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }
    try {
        await User.create({ username, email, password });
        res.json({ message: '회원가입 성공!' });
    } catch (error) {
        res.status(400).json({ error: '이미 존재하는 사용자입니다.' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
        return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸습니다.' });
    }
    req.session.user = { id: user.id, username: user.username, email: user.email };
    res.json({ message: '로그인 성공!', user_id: user.id });
}

function logout(req, res) {
    req.session.destroy(() => {
        res.json({ message: '로그아웃 성공!' });
    });
}

function me(req, res) {
    res.json(req.session.user || null);
}

module.exports = {
    register,
    login,
    logout,
    me,
};
