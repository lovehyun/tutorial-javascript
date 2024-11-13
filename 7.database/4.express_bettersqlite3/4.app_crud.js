// curl -X POST 127.0.0.1:3000/users -d username=user3 -d password=password3
// curl -X PUT 127.0.0.1:3000/users/2 -d username=user002 -d password=password002
// curl -X DELETE 127.0.0.1:3000/users/1
// curl -X PUT http://localhost:3000/users/1 -H "Content-Type: application/json" -d '{"username": "new_username", "password": "new_password"}'
// curl -X POST 127.0.0.1:3000/users -H "Content-Type: application/json" -d "{\"username\":\"user5\", \"password\":\"password5\"}"

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
    try {
        const users = db.prepare('SELECT * FROM users').all();
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 특정 사용자 조회
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Internal Server Error");
    }
});

// 새로운 사용자 생성
app.post('/users', (req, res) => {
    const { username, password } = req.body;
    const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = insert.run(username, password);
    res.send(`User added with ID: ${result.lastInsertRowid}`);
});

// 사용자 정보 업데이트
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body;
    const update = db.prepare('UPDATE users SET username = ?, password = ? WHERE id = ?');
    update.run(username, password, userId);
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
