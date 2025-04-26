// src/controllers/userController.js

// 간단한 데이터 저장소 (실제 프로젝트에서는 데이터베이스 사용)
let users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123', // 실제로는 해시된 비밀번호 사용
        createdAt: new Date().toISOString(),
    },
];
let userIdCounter = 2;

// 로그인 (간단한 구현)
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '사용자 이름과 비밀번호가 필요합니다.' });
    }

    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: '로그인 실패: 유효하지 않은 인증 정보' });
    }

    // 실제 인증 구현 시 JWT 토큰 등 활용
    res.json({
        id: user.id,
        username: user.username,
        email: user.email,
    });
};

// 사용자 등록
exports.register = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: '모든 필드가 필요합니다.' });
    }

    // 중복 확인
    if (users.some((u) => u.username === username)) {
        return res.status(400).json({ message: '이미 존재하는 사용자 이름입니다.' });
    }

    if (users.some((u) => u.email === email)) {
        return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const newUser = {
        id: userIdCounter++,
        username,
        email,
        password, // 실제로는 해시된 비밀번호 사용
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // 민감한 정보 제외하고 응답
    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
    });
};

// 사용자 정보 가져오기
exports.getUserInfo = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 민감한 정보 제외하고 응답
    res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
    });
};
