const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Mock 데이터 (전체 상세 정보)
const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
];

// CORS 설정
// app.use(cors()); // 모든 도메인 다 허용
app.use(cors({
    origin: 'http://localhost:3001', // React 개발 서버 도메인 허용
    // origin: ['http://localhost:3001', 'http://localhost:3000'],
}));

// /api/users - 모든 유저의 요약 정보 (id, name)만 반환
app.get('/api/users', (req, res) => {
    const summary = users.map(user => ({ id: user.id, name: user.name }));
    res.json(summary);
});

// /api/users/:userId - 특정 유저의 상세 정보 반환
app.get('/api/users/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
