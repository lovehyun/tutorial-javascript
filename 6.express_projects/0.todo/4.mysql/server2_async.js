// npm install mysql2 dotenv
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();;

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL 데이터베이스 연결
let db;
async function initDB() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('DB 연결 성공');

        // 연결 끊김 처리 (끊기면 재접속)
        // db.on('error', async (err) => {
        //     console.error('DB 연결 오류:', err);
        //     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        //         console.log('DB 재연결 시도 중...');
        //         db = null;
        //         await initDB();
        //     } else {
        //         throw err;
        //     }
        // });

        const query = `
            CREATE TABLE IF NOT EXISTS todos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                text VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT FALSE
            )
        `;
        await db.execute(query);
    } catch (err) {
        console.error('DB 연결 실패:', err);
        process.exit(1);
    }
}

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 요청 로깅
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 모든 To-Do 조회
app.get('/api/todos', async (req, res) => {
    console.log('GET /api/todos 호출됨');
    const query = 'SELECT * FROM todos';
    try {
        const [rows] = await db.execute(query);
        const todos = rows.map(row => ({
            id: row.id,
            text: row.text,
            completed: !!row.completed
        }));
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 조회 실패' });
    }
});

// 새 To-Do 추가
app.post('/api/todos', async (req, res) => {
    console.log('POST /api/todos 호출됨:', req.body);
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'text는 필수입니다.' });
    }
    const query = 'INSERT INTO todos (text, completed) VALUES (?, FALSE)';
    try {
        const [result] = await db.execute(query, [text]);
        res.json({ id: result.insertId, text, completed: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 삽입 실패' });
    }
});

// To-Do 완료 토글
app.put('/api/todos/:id/toggle', async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`PUT /api/todos/${id}/toggle 호출됨`);

    const selectQuery = 'SELECT * FROM todos WHERE id = ?';
    const updateQuery = 'UPDATE todos SET completed = ? WHERE id = ?';

    try {
        const [rows] = await db.execute(selectQuery, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        const todo = rows[0];
        const newCompleted = todo.completed ? 0 : 1;
        await db.execute(updateQuery, [newCompleted, id]);
        res.json({ id, text: todo.text, completed: !!newCompleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 업데이트 실패' });
    }
});

// To-Do 삭제
app.delete('/api/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE /api/todos/${id} 호출됨`);
    
    const query = 'DELETE FROM todos WHERE id = ?';
    try {
        await db.execute(query, [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 삭제 실패' });
    }
});

// 서버 시작
app.listen(PORT, async () => {
    await initDB(); // 서버 시작할 때 DB 연결 먼저!
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
