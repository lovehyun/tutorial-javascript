// cmd: curl "localhost:3000/login" -X POST -H "Content-Type: application/json" -d "{\"username\":\"user1\", \"password\":\"password1\"}"

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 정적 파일 제공
// app.use(express.static(path.join(__dirname, 'public')));

// 간단한 메모리 기반 사용자 데이터
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

// 로그인 라우트
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 간단한 메모리 기반 로그인 체크
    // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        res.json({ message: '로그인 성공!' });
    } else {
        res.status(401).json({ message: '로그인 실패' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
