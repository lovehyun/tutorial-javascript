const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('mydatabase.db');

// 테이블 생성 (사용자 정보를 저장하는 예시 테이블)
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT
    )
`);

// 루트 경로에 대한 예시 핸들러 - 모든 사용자 조회
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.send('Error querying database');
            return;
        }
        res.json(rows);
    });
});

// 특정 사용자 조회
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            res.send('Error querying database');
            return;
        }
        res.json(row);
    });
});

// 새로운 사용자 생성
app.post('/users', (req, res) => {
    const { username, email } = req.body;
    db.run('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], function (err) {
        if (err) {
            res.send('Error inserting into database');
            return;
        }
        res.send(`User added with ID: ${this.lastID}`);
    });
});

// 사용자 정보 업데이트
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, email } = req.body;
    db.run('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId], (err) => {
        if (err) {
            res.send('Error updating database');
            return;
        }
        res.send('User updated successfully');
    });
});

// 사용자 삭제
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
            res.send('Error deleting from database');
            return;
        }
        res.send('User deleted successfully');
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
