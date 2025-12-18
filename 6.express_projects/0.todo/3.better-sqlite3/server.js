const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

let db = new Database('todos.db'); // 파일 없으면 생성
console.log('DB 연결 성공');

function init_database() {
    try {
        db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      )
    `);

        console.log('DB 초기화 완료');
    } catch (err) {
        console.error('DB 연결/초기화 실패:', err);
        process.exit(1);
    }
}

// 여기서 초기화 함수 호출
init_database();

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
    try {
        const rows = db.prepare('SELECT * FROM todos').all();
        const todos = rows.map((row) => ({
            id: row.id,
            text: row.text,
            completed: !!row.completed,
        }));
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 조회 실패' });
    }
});

// 새 To-Do 추가
app.post('/api/todos', (req, res) => {
    console.log('POST /api/todos 호출됨:', req.body);

    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text는 필수입니다.' });

    try {
        const info = db.prepare('INSERT INTO todos (text, completed) VALUES (?, 0)').run(text);

        res.json({ id: Number(info.lastInsertRowid), text, completed: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 삽입 실패' });
    }
});

// To-Do 완료 토글
app.put('/api/todos/:id/toggle', (req, res) => {
    const id = Number(req.params.id);
    console.log(`PUT /api/todos/${id}/toggle 호출됨`);

    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

    try {
        const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
        if (!row) return res.status(404).json({ error: 'Not found' });

        const newCompleted = row.completed ? 0 : 1;

        const info = db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(newCompleted, id);

        if (info.changes === 0) return res.status(404).json({ error: 'Not found' });

        res.json({ id, text: row.text, completed: !!newCompleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 업데이트 실패' });
    }
});

// To-Do 삭제
app.delete('/api/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(`DELETE /api/todos/${id} 호출됨`);

    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

    try {
        const info = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
        if (info.changes === 0) return res.status(404).json({ error: 'Not found' });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB 삭제 실패' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// (선택) 종료 시 DB 닫기
process.on('SIGINT', () => {
    try {
        db.close();
    } catch (_) {}
    process.exit(0);
});
