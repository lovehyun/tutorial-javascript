const express = require('express');
const sqlite = require('better-sqlite3');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SQLite 데이터베이스 연결 (파일이 없으면 새로 생성됨)
const db = sqlite('mydatabase.db');

// 테이블 생성 (사용자 정보를 저장하는 예시 테이블)
db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT
)`);

// 루트 경로에 대한 예시 핸들러 - 모든 사용자 조회
app.get('/users', (req, res) => {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
});

// 특정 사용자 조회
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    res.json(user);
});

// 새로운 사용자 생성
app.post('/users', (req, res) => {
    const { username, email } = req.body;
    const insert = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
    const result = insert.run(username, email);
    res.send(`User added with ID: ${result.lastInsertRowid}`);
});

// 사용자 정보 업데이트
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, email } = req.body;
    const update = db.prepare('UPDATE users SET username = ?, email = ? WHERE id = ?');
    update.run(username, email, userId);
    res.send('User updated successfully');
});

// 사용자 삭제
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const deleteQuery = db.prepare('DELETE FROM users WHERE id = ?');
    deleteQuery.run(userId);
    res.send('User deleted successfully');
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
