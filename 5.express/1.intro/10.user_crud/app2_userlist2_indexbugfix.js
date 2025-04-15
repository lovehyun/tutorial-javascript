const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json())

// 사용자 목록을 저장할 메모리 내 변수
const users = [];
let nextUserId = 1;

// 정적 파일 및 동적 이미지 요청 처리
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/image', express.static(path.join(__dirname, 'static/image')));

// 기본 로거
app.use((req, _, next) => {
    console.log(`LOG: ${req.method} ${req.url} `);
    next();
});

// 기본 경로
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'about.html'));
});

// 사용자 정보 요청 처리
app.get('/users', (req, res) => {
    // res.send 시의 기본값은 'text/html; charset=utf-8'
    // res.json 시의 기본값은 'application/json'
    // 변경 시 res.type('text/plain');
    
    res.json(users);
    // res.send(JSON.stringify(users));
});

// 사용자 등록
app.post('/users', (req, res) => {
    try {
        const { name } = req.body;

        const newUser = {
            id: nextUserId++,  // 고유 ID 부여 후 증가
            name: name
        };

        console.log('신규 유저 추가: ', newUser);
        users.push(newUser);

        res.status(201).send('등록 성공');
    } catch (error) {
        console.error('POST 요청 처리 중 오류 발생: ', error);
        res.status(500).send('서버 내부 오류');
    }
});

// 사용자 정보 수정
app.put('/users/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = users.find(u => u.id === id);
        if (!user) {
            return res.status(404).send('사용자를 찾을 수 없습니다.');
        }

        user.name = req.body.name;
        
        // res.json(users);
        res.status(200).send('수정 성공');
    } catch (error) {
        console.error('PUT 요청 처리 중 오류 발생: ', error);
        res.status(500).send('서버 내부 오류');
    }
});

// 사용자 삭제
app.delete('/users/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const index = users.findIndex(u => u.id === id);
        if (index === -1) {
            return res.status(404).send('사용자를 찾을 수 없습니다.');
        }

        users.splice(index, 1); // 배열에서 해당 사용자 제거
        
        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('DELETE 요청 처리 중 오류 발생: ', error);
        res.status(500).send('서버 내부 오류');
    }
});

// 404 처리
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 ${PORT}포트에서 대기 중입니다.`);
});
