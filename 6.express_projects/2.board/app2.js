// npm install express nunjucks body-parser
const express = require('express');
const nunjucks = require('nunjucks');
// const bodyParser = require('body-parser');
const Database = require('./databas_bettersqlite3');

const app = express();
const port = 3000;

// Nunjucks를 뷰 엔진으로 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html');

// 미들웨어 설정
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 데이터베이스 모듈로부터 DB연결 객체를 생성
const db = new Database();

// 홈 페이지 렌더링
app.get('/', (req, res) => {
    res.render('index_fetch.html');
    // res.render('index_jquery.html');
});

// 데이터 생성 엔드포인트
app.post('/create', async (req, res) => {
    try {
        const title = req.body.title;
        const message = req.body.message;
        // SQL 쿼리에 prepared statement 사용
        const sql = `INSERT INTO board(title, message) VALUES(?, ?)`;
        const result = db.execute(sql, [title, message]);
        res.json({ 'result': 'success' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 데이터 목록 조회 엔드포인트
app.get('/list', async (req, res) => {
    try {
        // 비동기 처리를 위해 await 사용하지 않음
        const result = db.executeFetch("SELECT * FROM board");
        // 결과를 필요한 형태로 매핑
        res.json(result.map(row => ({ id: row.id, title: row.title, message: row.message })));
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 데이터 삭제 엔드포인트
app.post('/delete', async (req, res) => {
    try {
        const id = req.body.id;
        // SQL 쿼리에 prepared statement 사용
        const sql = `DELETE FROM board WHERE id=?`;
        db.execute(sql, [id]);
        res.json({ 'result': 'success' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 데이터 수정 엔드포인트
app.post('/modify', async (req, res) => {
    try {
        const title = req.body.title;
        const message = req.body.message;
        const id = req.body.id;
        // SQL 쿼리에 prepared statement 사용
        const sql = `UPDATE board SET title=?, message=? WHERE id=?`;
        db.execute(sql, [title, message, id]);
        res.json({ 'result': 'success' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
