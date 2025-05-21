// npm install mysql2 dotenv
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// .env 파일 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL 연결 풀 생성
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,      // 기본값 true
    connectionLimit: 10,           // 최대 10개의 커넥션만 유지
    queueLimit: 0                  // 대기열 제한 없음 (0은 무제한 대기 허용)
});

// 앱 시작 시 테이블 생성
async function initDB() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS todos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                text VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT FALSE
            )
        `;
        await pool.execute(query);
        console.log('DB 초기화 완료');
    } catch (err) {
        console.error('DB 초기화 실패:', err);
        process.exit(1);
    }
}

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 로깅 미들웨어
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 전체 To-Do 조회
app.get('/api/todos', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM todos');
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
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'text는 필수입니다.' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO todos (text, completed) VALUES (?, FALSE)',
            [text]
        );
        res.json({ id: result.insertId, text, completed: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 삽입 실패' });
    }
});

// To-Do 완료 토글
app.put('/api/todos/:id/toggle', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: '해당 항목이 존재하지 않습니다.' });
        }
        const todo = rows[0];
        const newCompleted = todo.completed ? 0 : 1;
        await pool.execute('UPDATE todos SET completed = ? WHERE id = ?', [newCompleted, id]);
        res.json({ id, text: todo.text, completed: !!newCompleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 업데이트 실패' });
    }
});

// To-Do 삭제
app.delete('/api/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await pool.execute('DELETE FROM todos WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 삭제 실패' });
    }
});

// 서버 실행
app.listen(PORT, async () => {
    await initDB();
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
