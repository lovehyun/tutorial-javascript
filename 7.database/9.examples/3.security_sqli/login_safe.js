const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:'); // 메모리에 데이터베이스 생성
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, nickname TEXT)');

    // 기본 사용자 추가
    const insert = db.prepare('INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)');
    insert.run('user1', 'password1', 'bill');
    insert.run('user2', 'password2', 'steve');
    insert.run('user3', 'password3', 'tom');
    insert.finalize();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
        if (err) {
            return res.status(500).json({ message: '회원가입 실패' });
        }
        res.status(201).json({ message: '회원가입 성공' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

    db.get(sql, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ message: '로그인 실패' });
        }
        if (row) {
            res.status(200).json({ message: '로그인 성공' });
        } else {
            res.status(401).json({ message: '로그인 실패' });
        }
    });
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    // Prepared Statement를 사용하여 SQL 인젝션 방어
    const sql = "SELECT username, nickname FROM users WHERE id = ?";
    console.log(`Executing query: ${sql} with id = ${userId}`);

    db.get(sql, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: '사용자 조회 실패' });
        }
        if (row) {
            res.status(200).json({ username: row.username, nickname: row.nickname });
        } else {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
