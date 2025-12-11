// curl -X POST -H "Content-Type: application/json" -d "{\"id\": \"1\", \"name\": \"John Doe\", \"age\": 25}" http://127.0.0.1:3000/users
// curl -X POST -d name=John http://127.0.0.1:3000/users

// curl -X GET http://127.0.0.1:3000/users
// curl -X GET http://127.0.0.1:3000/users/1

// curl -X PUT -H "Content-Type: application/json" -d "{\"name\": \"John Smith\", \"age\": 30}" http://127.0.0.1:3000/users/1

// curl -X DELETE http://127.0.0.1:3000/users/1

const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;


// 미들웨어를 사용하여 req의 body를 파싱하여 req.body를 생성 (POST/PUT에 유용함)
// app.use(bodyParser.json());
// express 4.16이후 부터는 기본 미들웨어로 대부분의 body-parser의 기능을 다 제공함 (.json(), .urlencoded())
// app.use(express.urlencoded({ extended: true}));
app.use(express.json())

const users = {};
let nextId = 1;

// 정적 파일 및 동적 이미지 요청 처리
// app.use(express.static('public'));
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
    // res.send 는 데이터 컨텐츠에 따라 알아서 타입 설정해 줌.
    //  - 문자열 (string) : text/html; charset=utf-8 (기본값)
    //  - 객체 / 배열     : application/json; charset=utf-8
    //  - Buffer         : application/octet-stream
    //  - 숫자 (상태코드로 인식됨) : text/plain

    // 변경 시 res.type('text/plain'); 으로 수동 설정

    // res.json 시의 기본값은 'application/json'
    
    res.json(users);
    // res.send(JSON.stringify(users)); // res.json(users) 와 같음
});

// 사용자 개별 정보 조회
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users[id];

    if (user) {
        res.json(user);
    } else {
        res.status(404).send('사용자 없음');
    }
});

// 사용자 등록
app.post('/users', (req, res) => {
    try {
        const { name, age, fullName } = req.body;

        const id = nextId++;
        // const id = Date.now(); // id를 시간으로 할수도 아니면 name 으로 할수도..
        // const id = name;
        
        users[id] = { id, name, age, fullName };
        res.status(201).send('등록 성공');
    } catch (error) {
        console.error('POST 요청 처리 중 오류 발생: ', error);
        res.status(500).send('서버 내부 오류'); // Content-Type: text/html; charset=utf-8
    }
});

// 사용자 정보 수정
app.put('/users/:id', (req, res) => {
    try {
        const id = req.params.id;
        const { name, age, fullName } = req.body;

        if (!users[id]) return res.status(404).send('사용자 없음');

        users[id] = { id, name, age, fullName };
        
        // res.json(users);
        res.status(200).send('수정 성공');
    } catch (error) {
        console.error('PUT 요청 처리 중 오류 발생: ', error);
        res.status(500).send('서버 내부 오류'); // Content-Type: text/html; charset=utf-8
    }
});

// 사용자 삭제
app.delete('/users/:id', (req, res) => {
    try {
        const id = req.params.id;
        
        delete users[id];
        
        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('DELETE 요청 처리 중 오류 발생: ', error);
        res.status(500).send('서버 내부 오류'); // Content-Type: text/html; charset=utf-8
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
