// npm install mysql2 dotenv
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 3000;

// MySQL 데이터베이스 연결
// const db = mysql.createConnection({
//     host: 'localhost',         // 본인 환경에 맞게 수정
//     user: 'your_username',     // 본인 환경에 맞게 수정
//     password: 'your_password', // 본인 환경에 맞게 수정
//     database: 'your_database'  // 본인 환경에 맞게 수정
// });
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// MySQL 연결 후 테이블 생성
db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
    } else {
        console.log('DB 연결 성공');
        const query = `
            CREATE TABLE IF NOT EXISTS todos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                text VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT FALSE
            )
        `;
        db.query(query, (err) => {
            if (err) {
                console.error('테이블 생성 실패:', err);
            }
        });
    }
});

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 요청 로깅
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 모든 To-Do 조회
app.get('/api/todos', (req, res) => {
    console.log('GET /api/todos 호출됨');
    const query = 'SELECT * FROM todos';
    db.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'DB 조회 실패' });
        } else {
            const todos = rows.map(row => ({
                id: row.id,
                text: row.text,
                completed: !!row.completed
            }));
            res.json(todos);
        }
    });
});

// 새 To-Do 추가
app.post('/api/todos', (req, res) => {
    console.log('POST /api/todos 호출됨:', req.body);
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'text는 필수입니다.' });
    }
    const query = 'INSERT INTO todos (text, completed) VALUES (?, FALSE)';
    db.query(query, [text], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'DB 삽입 실패' });
        } else {
            res.json({ id: result.insertId, text, completed: false });
        }
    });
});

// To-Do 완료 토글
app.put('/api/todos/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`PUT /api/todos/${id}/toggle 호출됨`);
    
    const selectQuery = 'SELECT * FROM todos WHERE id = ?';
    db.query(selectQuery, [id], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'DB 조회 실패' });
        } else if (rows.length === 0) {
            res.status(404).json({ error: 'Not found' });
        } else {
            const todo = rows[0];
            const newCompleted = todo.completed ? 0 : 1;
            const updateQuery = 'UPDATE todos SET completed = ? WHERE id = ?';
            db.query(updateQuery, [newCompleted, id], (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'DB 업데이트 실패' });
                } else {
                    res.json({ id, text: todo.text, completed: !!newCompleted });
                }
            });
        }
    });
});

// To-Do 삭제
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE /api/todos/${id} 호출됨`);
    
    const query = 'DELETE FROM todos WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'DB 삭제 실패' });
        } else {
            res.json({ success: true });
        }
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
