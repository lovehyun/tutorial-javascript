const { userModel } = require('../models');

// 사용자 회원가입
function register(req, res) {
    const { username, email, password } = req.body;

    // 모든 필수 입력값 체크
    if (!username || !email || !password) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }

    // 사용자 생성
    userModel.createUser(username, email, password, (err) => {
        if (err) {
            return res.status(400).json({ error: '이미 존재하는 사용자입니다.' });
        }
        res.json({ message: '회원가입 성공!' });
    });
}

// 사용자 로그인
function login(req, res) {
    const { email, password } = req.body;

    // 이메일로 사용자 조회
    userModel.findUserByEmail(email, (err, user) => {
        // 에러, 사용자 없음, 비밀번호 불일치 시
        if (err || !user || user.password !== password) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 틀렸습니다.' });
        }

        // 세션에 사용자 정보 저장
        req.session.user = { id: user.id, username: user.username, email: user.email };
        res.json({ message: '로그인 성공!', user_id: user.id });
    });
}

// 사용자 로그아웃
function logout(req, res) {
    req.session.destroy(() => {
        res.json({ message: '로그아웃 성공!' });
    });
}

// 현재 로그인된 사용자 정보 조회
function me(req, res) {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.json(null);
    }
}

module.exports = { 
    register, 
    login, 
    logout, 
    me 
};
