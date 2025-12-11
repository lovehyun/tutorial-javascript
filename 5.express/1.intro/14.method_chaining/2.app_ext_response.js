// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// JSON 바디 파싱
app.use(express.json());

/****************************************
 * 1) 공통 응답 헬퍼 미들웨어 (체이닝 확장)
 ****************************************/
app.use((req, res, next) => {
    // 성공 응답 (기본 200)
    res.ok = function (data) {
        this.status(200).json({
            success: true,
            data,
        });
        return this; // 체이닝 가능하도록
    };

    // 생성 성공 응답 (201)
    res.created = function (data) {
        this.status(201).json({
            success: true,
            data,
        });
        return this;
    };

    // 클라이언트 오류 (400)
    res.clientError = function (message, code = 400) {
        this.status(code).json({
            success: false,
            error: message,
        });
        return this;
    };

    // 커스텀 에러 (기본 500)
    res.serverError = function (message, code = 500) {
        this.status(code).json({
            success: false,
            error: message,
        });
        return this;
    };

    next();
});

/****************************************
 * 2) 데모용 인메모리 데이터
 ****************************************/
let users = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
];
let nextUserId = 3;

/****************************************
 * 3) 기본 Express 메서드 체이닝 예제
 ****************************************/

// GET /basic/plain
// status → type → set → send 체이닝
app.get('/basic/plain', (req, res) => {
    res
        .status(200)
        .type('text/plain')
        .set('X-Demo', 'PlainText')
        .send('This is a plain text response.\n');
});

// GET /basic/json
// status → json 체이닝
app.get('/basic/json', (req, res) => {
    res
        .status(200)
        .json({ message: 'Hello from /basic/json', time: new Date().toISOString() });
});

// GET /basic/cookie
// status → cookie → json 체이닝
app.get('/basic/cookie', (req, res) => {
    // cookie 사용하려면 express-session 또는 cookie-parser를 쓰는게 일반적이지만
    // 여기선 단순 데모용으로만 사용 (Express의 res.cookie 사용)
    res
        .status(200)
        .cookie('demo', '1234', { httpOnly: true })
        .json({ message: 'Cookie set!' });
});

/****************************************
 * 4) 확장 응답 체이닝 (ok, created, fail, error)
 ****************************************/

// GET /users  → res.ok()
app.get('/users', (req, res) => {
    res.ok(users);
});

// POST /users → res.created()
app.post('/users', (req, res) => {
    const { name, role } = req.body;

    if (!name || !role) {
        return res.clientError('name과 role은 필수입니다.');
    }

    const newUser = { id: nextUserId++, name, role };
    users.push(newUser);

    res.created(newUser);
});

// GET /users/:id → ok 또는 fail
app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    // id 형식이 잘못된 경우, Bad request → 400
    if (Number.isNaN(id)) {
        return res.clientError('id는 숫자여야 합니다.', 400);
    }

    const user = users.find(u => u.id === id);

    // 형식은 맞고 리소스는 없음, Not found → 404
    if (!user) {
        return res.clientError('사용자를 찾을 수 없습니다.', 404);
    }

    res.ok(user);
});

// DELETE /users/:id → 204 또는 404
app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.clientError('id는 숫자여야 합니다.', 400);
    }

    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.clientError('삭제할 사용자를 찾을 수 없습니다.', 404);
    }

    users.splice(index, 1);

    // 204 No Content: 바디 없이 성공만 알릴 때
    return res.status(204).send();
});

// GET /demo/error → res.error()
app.get('/demo/error', (req, res) => {
    // 일부러 에러 상황을 가정
    res.serverError('서버 내부 오류가 발생한 척 합니다.', 500);
});

// GET /demo/unauthorized → res.error(401)
app.get('/demo/unauthorized', (req, res) => {
    res.clientError('인증이 필요합니다.', 401);
});

/****************************************
 * 5) 서버 시작
 ****************************************/
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/*
2-2. 확장 응답 체이닝 테스트 (res.ok, res.created, res.fail, res.error)
4) /users (전체 조회, res.ok)
curl -i http://localhost:3000/users

5) /users (POST, res.created)
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Charlie\",\"role\":\"user\"}"

6) /users/:id 존재하는 사용자 (res.ok)
curl -i http://localhost:3000/users/1

7) /users/:id 존재하지 않는 사용자 (res.clientError 404)
curl -i http://localhost:3000/users/999

8) /users/:id 에 잘못된 형식 (res.clientError 400)
curl -i http://localhost:3000/users/abc

9) /demo/error (res.serverError 500)
curl -i http://localhost:3000/demo/error

10) /demo/unauthorized (res.clientError 401)
curl -i http://localhost:3000/demo/unauthorized

11) 존재하는 유저 삭제 (res.send 204)
curl -i -X DELETE http://localhost:3000/users/1

12) 다시 같은 id 삭제 시 (이미 삭제됨) (res.clientError 404)
curl -i -X DELETE http://localhost:3000/users/1

*/
