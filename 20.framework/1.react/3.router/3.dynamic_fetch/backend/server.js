const express = require('express');
const cors = require('cors');
const morgan = rquire('morgan');
const app = express();
const PORT = 5000;

// Mock 데이터 (전체 상세 정보)
const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
];

app.use(morgan('dev'));

// CORS 설정
// app.use(cors()); // 모든 도메인 다 허용
app.use(cors({
    origin: 'http://localhost:3001', // React 개발 서버 도메인 허용
    methods: ['GET', 'POST'], // GET, POST 메서드만 허용
    // origin: ['http://localhost:3001', 'http://localhost:3000'], // 여러 서버 허용
    // origin: '*', // 모든 도메인 다 허용
}));
// CORS를 통한 설정
//  - Access-Control-Allow-Origin: 허용된 도메인 (http://localhost:3001).
//  - Access-Control-Allow-Methods: 허용된 HTTP 메서드 (기본적으로 GET, POST 등).
//  - Access-Control-Allow-Headers: 허용된 요청 헤더 (클라이언트가 사용하는 커스텀 헤더 포함).
// Preflight 요청 내용:
//   OPTIONS /api/resource HTTP/1.1
//   Origin: http://localhost:3001
//   Access-Control-Request-Method: POST
//   Access-Control-Request-Headers: Authorization
// Preflight 요청에 대한 서버의 응답:
//   HTTP/1.1 204 No Content
//   Access-Control-Allow-Origin: http://localhost:3001
//   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
//   Access-Control-Allow-Headers: Authorization, Content-Type


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
