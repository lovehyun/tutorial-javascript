const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;


// 미들웨어를 사용하여 req의 body를 파싱하여 req.body를 생성 (POST/PUT에 유용함)
// app.use(bodyParser.json());
// express 4.16이후 부터는 기본 미들웨어로 대부분의 body-parser의 기능을 다 제공함 (.json(), .urlencoded())
app.use(express.json())

const users = {};

// 정적 파일 및 동적 이미지 요청 처리
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/image', express.static(path.join(__dirname, 'image')));

// res.send 시의 기본값은 'text/html; charset=utf-8'
// res.json 시의 기본값은 'application/json'
// 변경 시 res.type('text/plain');

// 기본 경로
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'about.html'));
});

// 사용자 정보 요청 처리
app.get('/user', (req, res) => {
    res.json(users);
});

// 사용자 등록
app.post('/user', (req, res) => {
    try {
        const { name } = req.body;
        const id = Date.now();
        users[id] = name;
        res.status(201).send('등록 성공');
    } catch (error) {
        console.error('POST 요청 처리 중 오류 발생: ', error);
        res.status(500).send('서버 내부 오류');
    }
});

// 사용자 정보 수정
app.put('/user/:id', (req, res) => {
    try {
        const id = req.params.id;
        users[id] = req.body.name;
        // res.json(users);
        res.status(200).send('수정 성공');
    } catch (error) {
        console.error('PUT 요청 처리 중 오류 발생: ', error);
        res.status(500).send('서버 내부 오류');
    }
});

// 사용자 삭제
app.delete('/user/:id', (req, res) => {
    try {
        const id = req.params.id;
        delete users[id];
        res.status(204).send();
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
